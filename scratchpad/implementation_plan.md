# Abe implementation plan

This plan is built phase by phase from `abe_design.md`; each phase has its own section.

## Phase 1 - Ticks

### Goal and non-goals

Build the tick structure. Agents have durable rows. A worker pool claims them, runs a bounded tick, saves a checkpoint,
and hands off safely. Add the eleven named hooks, a generic slow-run contract, durable wake requests, a scheduler
backstop, timing traces, tests, and metrics. Prove these parts with synthetic work before any hook gains behaviour. All
numerical settings and capacity estimates below are starting defaults to test.

Perception is out of scope: all of Chapter 2, including the receptor, screening, interpretation, and glances. Attention,
recall, memory, deliberation, procedures, tools, the notification tray, and sleep are also out. Do not build tasks,
drives, identity refresh, observation stores, or a debugger UI. The checkpoint contents stay opaque. Every excluded tick
step is a named no-op that records its invocation. Synthetic runs exercise dispatch and recovery without calling a model
or a tool.

### What the design requires

- **1.4 — Budget and cadence.** Allow 1,000 ms of control work, including saving, with 200 ms reserved for saving.
  Active starts are 5,000 ms apart. Schedule starts from a fixed cadence, not from the previous finish. Record missed
  starts. Never replay empty ticks to catch up. Only one valid tick may run for an agent.
- **3.4 — Checkpoint envelope.** Persist a revision, update time, and opaque contents. Restore the last committed
  contents after restart or ordinary idleness. Phase 1 does not interpret slots, versions, priming, or activation.
- **8.1 — Consistency and recovery.** The checkpoint must agree with committed cursors and intents. Persist an intent
  before dispatch. “Committed work is recovered, unfinished work replays safely.” Test this with synthetic cursor and
  intent records. Do not implement observation cursors or task changes.
- **8.1 — Unknown runs.** Lost contact with an executing run leaves its outcome `unknown`. A missing result is not
  success or permission to repeat an unknown effect.
- **8.5 and 10.3 — Ownership.** Persist run records before dispatch. The run worker owns slow execution, cancellation
  checks, progress, and its execution timeout. The tick never waits for a slow result.
- **8.5 and 10.3 — Continuation and exit.** Keep the agent’s loop scheduled while work is runnable or needs attention
  before the next scheduler fire. A process-held call keeps its owning job alive. Exit only after responsibility for
  outstanding work and supervision has a durable owner.
- **10.3 — Lease and wake.** Use a holder, increasing epoch, and expiry. Renew a retained lease. Fence state writes
  against the holder, epoch, and unexpired lease. Coordinate the final work check, wake check, and release. The minute
  heartbeat is a backstop.
- **10.1 — Timing trace.** Record `scheduledAt`, `missedStarts`, `durationMs`, `controlBudgetMs`, `saveReserveMs`,
  `overrunMs`, and `runtimeSettingsVersion`.
- **6.6 — Settings.** Timing and execution limits belong in immutable, versioned runtime settings. They do not belong in
  identity.
- **11.1 and 11.2 — Proof before behaviour.** Use a fake clock and failure injection. Phase 1 delivers the tick portion
  of M1, not the whole milestone.

Two details amend the earlier recommendation:

- `min(nextTickAt, now)` alone does not prevent a later checkpoint write from overwriting a wake. Add a pending-wake
  flag and a locked handoff.
- Sections 8.5 and 10.3 require continued ownership while work remains runnable. Keep a lightweight continuation under a
  renewed lease when needed. Do not release after every active tick unconditionally. No agent gets a dedicated process.

### Data model

Use `EldonModel` for schemas, ordinary reads, ACLs, and transactional writes. Use explicit SQL for claims and
conditional lease writes. Declare each model in a `.model.server.ts` file with
`new EldonModel<Interface, ClientShape>({ name, schema, toClient, ... })`, following
`h/core/models/schedule.model.server.ts` and `eldon3/apps/abe/core/models/agent_task_run.model.server.ts`. The interface
extends `EldonModelApi`; the base model supplies `_id`, `active`, `created`, `updated`, and ACL fields. Use the
inherited `created` and `updated` row timestamps rather than adding `createdAt` and `updatedAt`.

Choose `internal: true` for these Phase 1 runtime models, with an id-only `toClient`. Platform creates use
`{ internalObject: true }`; platform queries and mutations use `{ skipAclCheck: true }` with a reason at the call site.
Internal models do not acquire a read policy merely because a requester is passed. Keep agent/team binding checks
explicit. Models exposed to requesters later need declared `permissions`, as `agentTaskRunModel` has today.

`register(eldonDb)` builds the table specification from the model’s `name` and `schema`, registers generated
`createTableSql(...)` statements and expected columns, and makes the model available through `EldonModel.byName`. Use
the model’s `tableName`; do not add a separate table-name or `createSql` property to the model declaration. SQL must use
the generated column names: ordinary fields retain their spelling, such as `"nextTickAt"`, while ACL fields have
mappings such as `"acl_team_id"`. The explicit `teamId` below is a runtime field, not that ACL column.

`EldonDb.withTransaction(callback)` checks out a `pg.PoolClient`, begins a transaction, commits the callback’s
successful result, rolls back returned or thrown errors, and releases the client. Raw SQL uses
`eldonDb.query({ text, values }, { client })`. Model methods take an `EldonTransactionSession` in their options, not a
raw `pgClient`. For mixed model and SQL work, use `model.startTransaction(async (session) => ...)`, which wraps
`withTransaction`; pass `{ session, ...accessOptions }` to every model call and use `session.client` for SQL. Sessions
must belong to the same database and are closed when the callback’s transaction ends.

Map TypeScript dates to `timestamptz`, opaque values to `jsonb`, and epochs to PostgreSQL `bigint`. Represent epochs as
decimal strings in TypeScript to avoid integer precision loss. These storage choices remain Phase 1 choices. Declare
ordinary fields with `DbFieldType.DATE`, `MIXED`, `STRING`, `BOOLEAN`, and `NUMBER`, and agent references with
`DbFieldType.OBJECT_ID` and `ref: 'Agent'`. Ensure the table compiler, hydration, and schema validation support the
chosen epoch mapping; do not assume a `STRING` or `NUMBER` declaration already provides a lossless `bigint` mapping.
Preserve the checkpoint’s JSON contents without interpretation and explicitly encode and restore its envelope timestamp
if the envelope is stored as one JSON value.

**AgentState — new, one row per agent.**

```typescript
type CheckpointEnvelope = {
    revision: number
    updatedAt: Date
    contents: unknown // JSON only; preserved without interpretation
}

interface AgentState extends EldonModelApi {
    _id: string
    agentId: string
    teamId: string
    enabled: boolean

    nextTickAt: Date
    wakePending: boolean
    wakeRequestedAt: Date | null // earliest unacknowledged wake

    holder: string | null // unique worker process identity
    epoch: string
    leaseUntil: Date | null

    nextActiveStartAt: Date | null // null while ordinarily idle
    nextTimerAt: Date | null // generic timer boundary, not an expectation
    heartbeatAt: Date

    runtimeSettingsVersion: string
    checkpoint: CheckpointEnvelope

    attempt: {
        id: string
        scheduledAt: Date
        startedAt: Date
        runtimeSettingsVersion: string
    } | null

    lastClosedTickId: string | null
}
```

Field ownership:

| Fields                                                | Writer                                                                   |
| :---------------------------------------------------- | :----------------------------------------------------------------------- |
| Identity, team, initial checkpoint, initial due times | Provisioning                                                             |
| `enabled`, `runtimeSettingsVersion`                   | Platform configuration                                                   |
| `holder`, `epoch`, `leaseUntil`                       | Claim, renewal, and release code                                         |
| `wakePending`, `wakeRequestedAt`                      | Wake producers set them; tick start acknowledges them                    |
| `nextTickAt`                                          | Wake producers can move it earlier; the tick sets it through the handoff |
| Cadence, heartbeat, attempt, last closed tick         | Fenced tick coordinator                                                  |
| `nextTimerAt`                                         | Generic timer registration and acknowledgement                           |
| Checkpoint envelope                                   | Fenced checkpoint transaction                                            |
| `created`, `updated`                                  | Model write helpers; explicit SQL maintains `updated` with database time |

A timer registration locks the agent row and moves its due time earlier in the same transaction. Acknowledgement cannot
erase a timer registered concurrently. Phase 1 exposes this contract to fixtures only.

Add:

- A unique index on `"agentId"`.
- A partial index on `("nextTickAt", "leaseUntil", "_id")` for active, enabled rows.
- A partial index on `("teamId", "nextTickAt", "leaseUntil", "_id")` for team-scoped claims of active, enabled rows.
- An index on `"heartbeatAt"` for active, enabled rows.

The recommended composite index is a starting point, not proof of a cheap query. Check plans with many future rows, held
leases, and due rows.

**AgentRun — new, generic execution record and dispatch intent.**

```typescript
interface AgentRun extends EldonModelApi {
    _id: string
    agentId: string
    teamId: string
    requesterId: string
    kind: string // only "stub" is registered in Phase 1
    purpose: string
    inputs: { id: string; version: string | number }[]
    destination: string // opaque durable destination
    deadline: Date

    originTickId: string
    originAgentEpoch: string
    idempotencyKey: string

    status: 'intent' | 'queued' | 'running' | 'completed' | 'cancelled' | 'failed' | 'unknown'

    dispatchPending: boolean
    dispatchRetryAt: Date | null
    dispatchAttempts: number

    executionHolder: string | null
    executionEpoch: string
    executionLeaseUntil: Date | null

    cancelRequested: boolean
    cancelReason: string | null
    progressRef: string | null
    resultRef: string | null

    dispatchedAt: Date | null
    startedAt: Date | null
    externalCompletedAt: Date | null
    observedAt: Date | null
    consumedAt: Date | null
}
```

The tick creates the immutable intent fields. The dispatcher owns dispatch bookkeeping. The run worker owns execution,
saved progress, and result fields under its execution fence. The tick coordinator records consumption only when the
synthetic result’s consequences commit.

Add a unique index on `("agentId", "idempotencyKey")`, an index for pending dispatch by retry time, an index on
`("agentId", "status")`, and an index for expired execution leases.

`dispatchedAt` means confirmed publication. `externalCompletedAt` means execution finished, when known. `observedAt`
means the runtime received the result. `consumedAt` means its consequences committed. Do not collapse these times.

**AgentTick — new, timing only.**

```typescript
interface AgentTick extends EldonModelApi {
    _id: string
    agentId: string
    at: Date
    scheduledAt: Date
    missedStarts: Date[]
    durationMs: number | null
    controlBudgetMs: number
    saveReserveMs: number
    overrunMs: number | null
    runtimeSettingsVersion: string
}
```

Add an index on `("agentId", "at")` and use the tick id as the unique key. Null duration and overrun mean the process
died before it reported its final measurement. Never invent a monotonic duration from wall-clock timestamps.

Do not add perception, memory, action, or model fields. Hook invocation records belong in structured operational logs
and counters.

**AgentRuntimeSettings — new, immutable versions.**

```typescript
interface AgentRuntimeSettings extends EldonModelApi {
    _id: string // version

    controlBudgetMs: number // 1_000
    saveReserveMs: number // 200
    activeCadenceMs: number // 5_000
    scanIntervalMs: number // 200
    heartbeatIntervalMs: number // 60_000
    leaseTtlMs: number // 15_000
    leaseRenewIntervalMs: number // 5_000

    maxConcurrentTicksPerAgent: 1
    maxConcurrentRunsPerAgent: number // 4
    maxConcurrentTicksPerWorker: number // 2
    maxTickStartsPerTeamPerSecond: number // 250

    runTimeoutMs: number // 300_000
    runPrefetch: number // 1
}
```

Validate positive durations, `saveReserveMs < controlBudgetMs`, and enough lease time for renewal and saving. The
single-tick limit is an invariant, not a tuning option.

Load one immutable settings version for each tick. A settings change applies at the next tick boundary. A cadence change
starts a new cadence segment; it must not reinterpret earlier missed starts.

Each new model registers generated table-creation SQL and needs a deployment migration, including the composite and
partial indexes. `EldonDb.ensureSchema()` creates missing local tables in development and test; deployed environments
validate existing schemas. Local table creation is not a deployment mechanism. Deploy migrations before enabling
workers.

### Components

| Component          | Inputs and outputs                                                   | Responsibility and boundary                                                                                             |
| :----------------- | :------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------- |
| Tick worker        | Due rows → claimed ticks and scheduled continuations                 | Polls PostgreSQL, applies team fairness, limits local concurrency, and renews retained leases. Never runs slow bodies.  |
| Tick coordinator   | Claim, settings, checkpoint → committed checkpoint and next due time | Runs lifecycle code and the eleven hooks. Never calls a model, tool, or perception service.                             |
| Run dispatcher     | Committed run intents → RabbitMQ jobs                                | Publishes with confirms and retries through a new confirm-backed queue path. Never creates an intent after publication. |
| Run worker         | Run id and hydrated job context → progress, result, durable wake     | Executes only the registered stub. Never writes working memory or advances agent steps.                                 |
| Wake helper        | Agent id and caller’s transaction → earlier due time                 | Records a durable request. Never treats pubsub delivery as persistence.                                                 |
| Scheduler backstop | Due heartbeat or timer → wake update                                 | Uses existing scheduler dispatch and retry machinery. Never drives the active cadence.                                  |
| Exit handoff       | Current lease and durable work state → continuation or release       | Checks ownership and work under the row lock. Never releases first and checks later.                                    |

Put the generic claim-loop lifecycle, clock interface, bounded execution helper, and lease helper in `h/core`. They know
nothing about agents or cognition. Keep the `agent_state` SQL adapter, models, tick hooks, scheduling rules, and job
registrations in `eldon3/apps/abe`.

Use `startWorker` to start the scanner once per worker process and stop it during shutdown. The scanner is not a
long-running RabbitMQ delivery. Register `tick_agent` as the bounded wake/backstop adapter and register a separate
stub-run job in `jobs.ts`, with names in `constants.server.ts`. Export the new models through
`core/shared/models.server.ts` and include them in the worker’s `models` array.

`startWorker` takes `WorkerConfig.jobs` and optional `schedules`. It registers jobs in parallel, runs each job’s
argument-free `onServerStart()` before attaching that job’s listener, and stores the returned data as
`QueueCtrlParams.serverData`. `onServerStop(serverData)` receives the same resource. Give one designated registration
ownership of the scanner lifecycle. Startup failures are currently logged without aborting job registration, so scanner
startup must report an unhealthy state and prevent claims if its required resources are unavailable.

`QueueCtrlParams` provides `aiEngine`, optional `pubsub` and `scheduler`, `sendToQueue`, `broadcastMessageToUser`,
`sendToAppInstance`, and `serverData`. It does not provide a database client or the queue manager. Supply scanner and
dispatcher resources explicitly through bootstrap wiring; do not assume lifecycle callbacks receive these parameters.
The current shutdown path closes the queue manager before invoking job stop hooks. Add the lifecycle support needed to
stop claims and drain the new dispatcher before queue teardown, then close the scanner and retained continuations.

Declare the minute backstop through `WorkerConfig.schedules`, using a registered job name and
`EldonScheduleType.INTERVAL` with `everyMs: 60_000`. `startWorker` calls `scheduler.create` after job registration.
Creation reuses an existing active schedule matching name, payload, and owner; ownerless declarations are system
schedules. The choice of backstop payload and bounded scan batch remains Phase 1 configuration. The current Abe worker
declares only the hourly memory-consolidation schedule and does not pass `redisUrlstring`; configure that worker option
where Redis-backed scheduler election and queue dedupe are required.

The tick has this skeleton:

```text
begin
  restore the committed checkpoint
  load the pinned settings version
  establish the attempt and acknowledge the current wake
  reconcile generic execution ownership within the budget
  invoke beginContextHook

1.  Sense      → senseHook
2.  Perceive   → perceiveHook
3.  Predict    → predictHook
4.  Appraise   → appraiseHook
5.  Prime      → primeHook
6.  Attend     → attendHook
7.  Recall     → recallHook
8.  Select     → selectHook
9.  Act        → actHook
10. Observe    → observeHook
11. Regulate   → regulateHook

close
  commit the checkpoint and structural changes

continue
  keep the continuation scheduled, or perform the exit handoff
```

Every hook returns `no_change` and records its name, tick id, invocation, and duration. A hook skipped because the
budget is spent records `skipped_budget`. `beginContextHook` does no identity refresh, decay, drive update, or
observation catch-up.

Checkpoint saving is mandatory coordinator code. It must run even when `regulateHook` is skipped.

Synthetic fixture adapters exercise intents, results, cancellation, and cursor consistency around this skeleton.
Production hooks remain no-ops.

### Algorithms

**Claim.** Choose a team with an available start permit, then run this statement against the `AgentState` model’s table
with parameters for team, worker identity, and lease TTL:

```sql
WITH candidate AS (
    SELECT "_id"
    FROM "agent_state"
    WHERE "active" = true
      AND "enabled" = true
      AND "teamId" = $1
      AND "nextTickAt" <= statement_timestamp()
      AND (
          "nextActiveStartAt" IS NULL
          OR "nextActiveStartAt" <= statement_timestamp()
      )
      AND (
          "leaseUntil" IS NULL
          OR "leaseUntil" < statement_timestamp()
      )
    ORDER BY "nextTickAt", "_id"
    FOR UPDATE SKIP LOCKED
    LIMIT 1
)
UPDATE "agent_state" AS agent
SET "holder" = $2,
    "epoch" = agent."epoch" + 1,
    "leaseUntil" =
        statement_timestamp() + ($3 * interval '1 millisecond'),
    "updated" = statement_timestamp()
FROM candidate
WHERE agent."_id" = candidate."_id"
RETURNING agent.*, statement_timestamp() AS claimed_at;
```

`findOneAndUpdate(query, update, options)` already selects one row with `FOR UPDATE` inside `withClient`, using
`options.sort`, and supports `upsert` and `session`. It can perform an ordered, locked conditional update and can
participate in the caller’s transaction. Its selection path emits plain `FOR UPDATE`, with no `SKIP LOCKED`. Use
explicit SQL for this claim’s nonblocking queue selection and database-time lease expressions. A plain locking update
could make workers wait behind the same busy row.

The statement acquires ownership; it does not acknowledge wakes or advance the schedule. If the worker dies immediately,
the row remains due and becomes claimable after expiry.

Run the statement as a short transaction. Never hold its row lock throughout a tick. No returned row means another
worker won, the team has no eligible work, or the row is still leased.

**Begin.** Start the local monotonic budget immediately before sending the claim, so claim latency consumes budget. A
retained continuation starts a fresh budget before its fenced begin transaction.

Lock `AgentState` and verify holder, epoch, and expiry. Recover any unfinished attempt before replacing it. Record the
new attempt, choose its scheduled start, snapshot the pending wake, and clear `wakePending` and `wakeRequestedAt`. New
arrivals after this transaction set them again.

Restore the checkpoint and inspect a bounded set of generic run records. A healthy run owned by another worker remains
running. An expired execution owner leaves the run `unknown`; losing the tick worker does not invalidate a healthy run
worker.

**Budget.**

```text
deadline = monotonicStart + controlBudgetMs
admissionDeadline = deadline - saveReserveMs

for hook in orderedHooks:
    if leaseLost or monotonicNow >= admissionDeadline:
        record remaining hooks as skipped
        break
    invoke bounded hook
    check budget and lease again

closeAndHandoff(deadline)
```

Pass the remaining deadline through the new database execution helper. `EldonDb.query` currently accepts only a
statement and optional client, and `withTransaction` accepts only its callback; neither supplies a deadline or
cancellation option. Add the support needed to bound pool acquisition, lock waits, statements, and commit waits. Do not
use `Promise.race` as if it cancelled a database write. Cancel or close the affected client, and resolve an uncertain
commit before retrying.

Synchronous work must be small or yield in bounded pieces. A timer cannot interrupt blocked JavaScript. The budget stops
admission; it cannot guarantee a stalled database or runtime pause ends within one second.

**Close of tick.** Use `agentStateModel.startTransaction`, backed by `EldonDb.withTransaction`, with one session and its
client. Pass that session to every participating model call; execute explicit SQL on `session.client`.
`findWithFixedStatement` takes only `{ skipAclCheck: true }` and is not the transaction path for these writes.

1. Lock the agent row.
2. Check holder, epoch, unexpired lease, and expected checkpoint revision.
3. Commit synthetic cursor changes, result consumption, and run intents.
4. Save the checkpoint with its new revision and database update time.
5. Advance cadence and timer bookkeeping.
6. Check durable runnable work, run ownership, and pending wakes.
7. Set the next due time and retain or release ownership.
8. Insert a timing row when the tick is non-empty or anomalous.
9. Set `lastClosedTickId`, clear `attempt`, and commit.

Every tick-owned mutation uses this fenced transaction boundary. A failed condition rolls back all dependent writes, not
just `AgentState`. Return an error from the transaction callback on a failed fence; a successful result containing no
matching row does not itself trigger rollback. A future early durable write must use the same rule and leave the
checkpoint consistent with what it committed.

A bare `$set` containing an old copy of `nextTickAt` is forbidden.

**Wake.** Store the event or result and request the wake in the same PostgreSQL transaction:

```sql
UPDATE "agent_state"
SET "nextTickAt" = LEAST("nextTickAt", statement_timestamp()),
    "wakePending" = true,
    "wakeRequestedAt" = CASE
        WHEN "wakeRequestedAt" IS NULL THEN statement_timestamp()
        ELSE LEAST("wakeRequestedAt", statement_timestamp())
    END,
    "updated" = statement_timestamp()
WHERE "agentId" = $1
  AND "active" = true;
```

Repeated wakes coalesce. They do not create a queue entry per arrival. Publish an optional `EldonPubSub` nudge only
after commit. Polling remains sufficient if the nudge is lost. The nudge channel and publication adapter remain Phase 1
choices; the available method signatures do not establish a publish/subscribe call contract.

`EldonPubSub` provides `setIfAbsentWithTTL(key, value, ttlSec)`, `setWithTTL`, `get`, `delete`, `claimOwnership`,
`deleteIfEquals`, and `refreshIfEquals`, plus `incrementWithTTL` for counters. Acquisition returns `wasSet`; conditional
renewal returns `refreshed`; conditional deletion returns `removed`. These primitives can support optional Redis
coordination, but they do not replace the PostgreSQL holder, epoch, expiry, and fenced state transaction.

Wakes during an active segment do not create extra tick starts between cadence boundaries. The claim condition and
retained continuation both enforce `nextActiveStartAt`. A wake from ordinary idleness can start immediately.

**Release and handoff.** Under the close transaction’s row lock, check in this order:

1. The lease and checkpoint revision still match.
2. The tick owns no slow call.
3. Every outstanding run has a durable dispatch retry, execution owner, or recovery deadline.
4. Runnable structural work and any pending wake are accounted for.
5. The next timer, active start, and heartbeat have an owner.

Keep a lightweight continuation when work is runnable or something needs attention before the scheduler backstop. The
worker sleeps until the next allowed start and renews the lease separately. Waiting does not occupy a tick execution
slot.

Otherwise save the idle due time and clear `holder` and `leaseUntil` in the same transaction. Keep the epoch.

When `wakePending` is true, preserve the earlier due time with `LEAST(current nextTickAt, computed due time)`. When
false, replace the old due time with the computed one. Do not clear a wake at close.

An arrival before the lock is seen by the handoff. An arrival blocked behind it updates the committed row afterward. It
either nudges the retained owner or leaves a released row due for the scanner. Neither path relies on a successful
enqueue.

**Next due time and missed starts.**

- Idle: the earliest generic timer, run-supervision boundary, or heartbeat.
- Active: the next cadence boundary, with earlier wake requests retained but subject to the active-start gate.
- First wake from idle: start a new active segment at its first tick.
- Delayed active start: run once for the latest eligible cadence boundary. Record all earlier unserved boundaries as
  missed.
- Close after another boundary passes: record that boundary as missed and schedule the first future boundary.

For example, if the next start was due at 10 seconds and the worker can start only at 22 seconds, run the 20-second tick
and record 10 and 15 seconds as missed. Do not run three ticks.

Persist cadence accounting with the attempt and close transaction so crashes do not count the same gap twice. Long
outages must not allocate an unbounded array inside the control budget. Retain the exact cadence segment and unreported
range durably, then materialise `missedStarts` in bounded timing-only trace batches before clearing that range.

The scheduler’s interval advancement is separate: it advances from the previous due time for ordinary jitter, but
collapses a delay greater than one interval to `now + everyMs`. Do not reuse `computeNextRunAt` for the active tick
cadence.

**Run dispatch and result.** Use the run row as the durable outbox:

1. Commit a run in `intent` with `dispatchPending = true`.
2. A separate dispatcher publishes its id to the registered RabbitMQ job.
3. On publisher confirmation, record dispatch and clear the pending flag.
4. A worker validates the payload, hydrated requester and team, and the run’s agent/team binding.
5. Atomically claim execution. Duplicate deliveries cannot claim an already owned or terminal run.
6. Execute the stub, checking cancellation and deadline between bounded chunks.
7. Persist the result reference and wake the agent in one transaction.
8. A later tick commits synthetic result consumption and `consumedAt`.

`EldonQueueManager.send(queueName, envelope, { sendToQueueMaxRetries })` currently uses an ordinary `amqp.Channel`, sets
`persistent: true`, and writes `x-max-retries`. It returns after `channel.sendToQueue`; it does not wait for a broker
confirmation. Its boolean result describes buffer backpressure, not confirmed publication, and a false return does not
prove the message was never sent. Add a confirm-backed publication path in `h/core/library/database/eldon_queue.ts` for
the outbox. Retaining confirmed publication as the meaning of `dispatchedAt` is a Phase 1 choice and requires this
change.

The retry option defaults to zero and is carried in the message header; it is not a retry loop around the publisher
call. Keep publication retries in the durable outbox. `QueueCtrlParams.sendToQueue(name, data, context)` checks
requester quota and accepts `requester`, `teamid`, and `skipQuotaCheck`, then constructs the envelope with
`created: Date.now()`. It does not expose an idempotency key, retry count, or confirm option. Wire the dispatcher to the
new publication path explicitly.

Queue envelopes carry `data`, a typed `requester: Principal`, `teamid`, `created`, and an optional `idempotencyKey`. A
requester id alone is insufficient to construct a principal; establish its actor type from trusted provisioning or
registered identity records. Require both requester and team identity on stub-run messages. `startWorker` loads
`jobInfo.principal` and `jobInfo.team` when both `requester` and `teamid` are present, rejects missing identities or
invalid membership, and then calls the handler. User requesters load through `userModel`; other actors load through
`EldonModel.byName(requester.type)`. The handler must still check the run binding.

`listen(queueName, callback, { prefetch, payloadSchema, pubsub })` registers the consumer and defaults to prefetch one.
Declare a payload schema for the stub’s run id. The queue’s one-hour Redis dedupe covers duplicate initial deliveries
with an idempotency key; retries bypass it, and expiration permits later deliveries. It is not durable execution dedupe.

Use a consistent lock order: agent row before associated run rows when a transaction needs both.

A crash between publication and confirmation can cause redelivery. PostgreSQL run state provides durable dedupe; the
queue listener’s one-hour Redis dedupe does not provide execution correctness.

Run execution has its own fence because it must survive changes to the agent lease. The origin agent epoch records which
valid intent authorised dispatch. A later tick epoch does not invalidate an independently owned result. Run workers may
write only their own execution records and wake requests.

Use `prefetch: 1` and a job timeout aligned with the run deadline. `startWorker` wraps handlers in
`withTimeout(jobConfig.timeoutMs)`; that wrapper does not establish the run’s durable cancellation or execution-lease
protocol. The stub owns its deadline and cancellation checks. The stub supports delayed completion, saved progress,
cancellation, failure, and lost-response fixtures. No model or tool implementation is registered.

**Overrun and lease loss.** On overrun, stop admitting work, stop renewing that attempt’s lease, and make a bounded
close attempt while ownership is valid. Record `max(0, durationMs - controlBudgetMs)`. If close cannot finish, retain
the last committed checkpoint and let ownership expire.

On lease loss, stop immediately. Do not dispatch or retry a state write with the old epoch. Discard local changes and
let the next owner recover durable work.

Epochs prevent stale effects; they cannot stop a paused process from later resuming CPU execution. All resumed code must
check its fence before useful work. “No overlap” means one valid owner and no concurrent accepted agent mutations.

### Failure handling

| Failure                                              | Required behaviour                                                                                                                                                                                                              |
| :--------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Crash before checkpoint                              | Restore the prior checkpoint. Replay only unfinished structural work with stable ids. Recover the unfinished attempt and cadence accounting.                                                                                    |
| Crash after dispatch but before creating the run row | This ordering is impossible through the dispatcher: it publishes only committed run rows. Test that an uncommitted intent cannot be published.                                                                                  |
| Crash after intent commit, before publication        | The pending-dispatch scan publishes the existing intent.                                                                                                                                                                        |
| Publication succeeds, acknowledgement is lost        | Retry publication with the same run id. The execution claim prevents duplicate execution.                                                                                                                                       |
| Run worker dies after execution starts               | Mark unresolved execution `unknown` after ownership expires. Do not infer success or automatically repeat an unknown effect.                                                                                                    |
| Tick worker dies holding a lease                     | Stop receiving renewals, expire the lease, and claim with a higher epoch.                                                                                                                                                       |
| Two workers claim                                    | Row locking chooses one owner. After a later takeover, the former owner’s epoch fails every dependent state write.                                                                                                              |
| Commit response is lost                              | Re-read `lastClosedTickId` and durable run ids. Determine whether the transaction committed before replaying.                                                                                                                   |
| Redis is down                                        | Poll PostgreSQL. Wake correctness and fencing continue. With pubsub configured, the scheduler skips dispatch when Redis is disconnected or lease acquisition fails; queue dedupe is unavailable. Neither owns tick correctness. |
| RabbitMQ is down                                     | Keep intents pending with retry times and visible age. Ticks continue. Never wait for the broker inside the control budget.                                                                                                     |
| PostgreSQL is slow                                   | Stop admission, use bounded database timeouts, record overruns where possible, and preserve the last committed state.                                                                                                           |
| Worker clock is skewed                               | Use a monotonic clock for local duration and database time for due times, expiry, and wake timestamps.                                                                                                                          |
| Cancellation races with completion                   | Preserve the actual terminal result. A cancellation request is not proof that execution stopped.                                                                                                                                |
| Worker shuts down                                    | Stop claims, finish bounded closes, and release safely. Unfinished ownership expires if shutdown cannot complete.                                                                                                               |

### Capacity

At 1,000 active agents and a five-second cadence:

```text
1,000 / 5 = 200 ticks per second
200 × 0.050 seconds = 10 worker-seconds per second
```

Start load testing with 10 to 15 tick worker processes. This estimate assumes 50 ms of occupied execution time per tick.
Measure CPU, database time, event-loop delay, and lease-renewal traffic separately.

Each process can retain many sleeping continuations. Limit simultaneous tick bodies separately from the number of
retained agents. Do not reserve one process or one execution slot per agent.

The scanner has no RabbitMQ prefetch. Its equivalent is bounded local concurrency. Short wake-adapter jobs may use
prefetch above one. Slow-run consumers start at one.

Idle agents hold a row and index entries. Workers share indexed scans; they do not scan every idle row on each polling
interval. Heartbeats still cost work: 1,000 idle agents with a minute heartbeat average roughly 17 heartbeat checks per
second. They do not cost 200 active ticks per second.

Apply team fairness before starting ticks. Use round-robin team selection and a shared PostgreSQL start budget,
including retained continuations. Start with 250 starts per team per second. Store budget reservations durably so adding
worker processes cannot multiply the cap. Rate-limited rows remain pending with their age visible.

The scheduler’s defaults are a 60,000 ms tick interval, `TICK_BATCH_LIMIT = 1000`, and
`MAX_FIRES_PER_TICK_PER_TEAM = 100`. Its query uses `ROW_NUMBER()` partitioned by `"acl_team_id"` to take at most 100
due schedule rows per team before the global limit; ownerless schedules share a system bucket. Excess rows stay due.
These are schedule-dispatch limits, not active-tick limits, and they must not become active-tick limits.

`runScheduledTick` acquires `scheduler.tick.lease` with `setIfAbsentWithTTL` and a 30-second TTL. `tickOnce` attempts
renewal every 15 seconds while iterating the batch, using unconditional `setWithTTL`. The value is a timestamp
breadcrumb, not a checked ownership token; this is not an agent fencing lease. `isTicking` prevents overlapping
scheduled ticks in one process. Without configured pubsub, the scheduler dispatches directly for single-worker use.

The scheduler sends the registered schedule name and payload directly through `queueManager.send`, bypassing requester
quota. It includes the schedule owner principal and team when present, an idempotency key of
`{scheduleid}:{nextRunAtMs}`, and the row’s `maxRetries`, which defaults to ten. After send returns, it records
`lastDispatchedAt` and advances `nextRunAt` with an optimistic condition on the old due time. The dispatch marker
prevents another send when advancement alone failed; it is not a broker-confirmed outbox. Handler success resets
`consecutiveErrors`; final failures reported by the error-queue listener increment it and disable the schedule at ten.
Monitor the heartbeat schedule’s enabled state as well as pending agent rows.

Past 10,000 active agents, evaluate partitioning or sharding by team. Keep an agent’s state, runs, checkpoint
transaction, and fairness budget together. Measure first; agent count alone does not establish the database limit.

### Tests

Pure tests use fake wall and monotonic clocks. Database tests use real PostgreSQL. Queue tests use real PostgreSQL and
RabbitMQ; include Redis where the existing queue or scheduler requires it.

- **Hook order — pure:** `begin`, all eleven hooks, close, and `continue` occur in order; excluded behaviour is never
  called.
- **Opaque checkpoint — pure and PostgreSQL:** arbitrary JSON survives close, idle exit, and restart unchanged.
- **Claim race — PostgreSQL:** concurrent workers obtain only one valid lease for the same agent.
- **Skip locked — PostgreSQL:** a locked candidate does not block claims for other due agents.
- **Lease expiry and takeover — PostgreSQL:** a dead owner expires and the next owner receives a higher epoch.
- **Epoch rejection — PostgreSQL:** a former owner cannot change checkpoint, cursor fixture, intent, or due-time state.
- **Budget reserve — pure:** admission stops before the save reserve and mandatory close still runs.
- **Budget overrun — pure and PostgreSQL:** delayed queries cause a measured overrun, stop renewal, and admit no further
  hooks.
- **Missed starts — pure and PostgreSQL:** late starts and long outages preserve exact missed boundaries without cadence
  drift.
- **No replay of empty ticks — pure:** a jump across cadence boundaries causes one current tick, not a catch-up loop.
- **Wake during exit — PostgreSQL:** wakes before, during, and after the release transaction remain claimable.
- **Wake during takeover — PostgreSQL:** a takeover cannot clear a wake it has not acknowledged.
- **Duplicate wakes coalesce — PostgreSQL:** repeated wakes retain one pending request and the earliest request time.
- **Flood respects cadence — pure and PostgreSQL:** repeated wakes do not increase an active agent’s start rate.
- **Run completion bumps the agent — PostgreSQL and RabbitMQ:** completion survives tick-worker exit and wakes a later
  tick.
- **Duplicate run delivery — PostgreSQL and RabbitMQ:** publication retries and redelivery produce one accepted
  execution, including deliveries after Redis dedupe expiry and retries that bypass dedupe.
- **Intent before dispatch — PostgreSQL and RabbitMQ:** rollback leaves no runnable job; committed intents survive
  publisher failure; only a broker confirmation permits clearing pending dispatch, including backpressure and
  lost-confirmation cases.
- **Crash around checkpoint — PostgreSQL:** cursor fixture, consumption, intent, checkpoint, and due time commit
  together or roll back through the same transaction session.
- **Unknown commit — PostgreSQL:** a lost commit response is resolved by durable tick identity before retry.
- **Run cancellation and owner death — PostgreSQL and RabbitMQ:** cancellation is checked between chunks; unresolved
  execution becomes `unknown`.
- **Scheduler backstop firing — PostgreSQL, RabbitMQ, and Redis:** a lost nudge is recovered without duplicate active
  loops; scheduler lease races and repeated deliveries cannot bypass the agent claim.
- **Settings versioning — pure and PostgreSQL:** a tick keeps its pinned version; changes apply only at the next
  boundary.
- **Redis outage — PostgreSQL with Redis fault injection:** polling and durable wake handoff continue while the
  configured scheduler skips dispatch.
- **Team fairness — PostgreSQL:** multiple workers share the cap and a flooded team cannot starve another.
- **Clock skew — pure and PostgreSQL:** worker wall-clock offsets change neither lease decisions nor measured duration.
- **Empty trace suppression — PostgreSQL:** routine no-op ticks increment counters; missed starts and overruns still
  create timing rows.
- **Capacity soak — full stack:** active and idle agents sustain the chosen load with bounded queues and measured
  recovery after faults.

### Metrics and trace

Count all starts and closes, including empty ticks. Record:

- Ticks per second, completed, empty, interrupted, and failed.
- Claim latency, claim misses, and due-to-start delay.
- Control budget use, save time, overruns, and overrun duration.
- Missed starts and oldest unserved cadence boundary.
- Wake-to-claim latency from the earliest pending wake.
- Lease renewals, renewal failures, takeovers, and rejected stale writes.
- Run queue depth, pending-dispatch age, unknown runs, and completion-to-consumption delay.
- Team throttling and oldest eligible row per team.
- Hook invocations and skips by hook name.

An empty tick invokes only no-op hooks and performs routine bookkeeping. It increments a counter and creates no tick
row. A missed start, overrun, recovery, synthetic intent, or result transition makes a tick non-empty.

The timing row contains only its identifiers and timing fields apart from inherited model metadata. Hook logs establish
which stubs ran without adding cognitive trace fields.

Insert the timing row in the close transaction when needed. Finalise duration after the close acknowledgement using an
idempotent telemetry update by tick id. If saving itself turns an otherwise empty tick into an overrun, insert its
timing row then. This telemetry write cannot mutate agent state.

If the process dies before finalisation, leave the duration unknown. Report trace-write failures; do not claim complete
timing data through a database outage.

### Rollout

Ship behind an `abeTicks` flag, off by default. Provision rows only for the test cohort. Deploy schemas and migrations
before starting scanners.

Run shadow ticks beside today’s `run_agent_task` and `respond_to_conversation_message`. Leave their handlers, dispatch
paths, and outputs unchanged. Shadow ticks receive synthetic wakes and stub runs. They do not consume conversations,
task inputs, or observations.

`runAgentTaskJob` in `jobs/jobs/run_agent_task/run_agent_task.job.ts` has a five-minute timeout and uses the default
prefetch of one. `RunAgentTaskJobData` carries exactly one of `runid` or `taskid`; the payload schema validates UUID
fields and the handler enforces the exclusive choice. Manual jobs load a precreated `AgentTaskRun`. Scheduled jobs load
the task, skip successfully when its latest run is `IN_PROGRESS`, and otherwise call `createScheduledTaskRun` inside the
handler. The handler requires `jobInfo.requester` and hydrated `jobInfo.team`, performs model access as that requester,
gathers integration tools, saves status changes, calls `runAgent`, creates an artifact, and broadcasts status updates.
The new generic `AgentRun` and stub job remain separate from this existing execution path and its `taskid`, `agentid`,
`instructions`, `sequence`, `startMs`, and `endMs` fields.

Start with deterministic failure scripts. Then run a mixed active and idle load with real PostgreSQL and RabbitMQ.
Inject shutdowns, process pauses, broker outages, database delays, duplicate deliveries, and wakes at every handoff
boundary.

Promote the cohort only when:

- Every Phase 1 correctness test passes.
- No stale owner commits agent state.
- No durable wake is stranded after services recover.
- Checkpoint recovery preserves committed synthetic work.
- Intent publication survives crashes without duplicate accepted execution.
- Slow runs leave the tick free and keep an explicit execution owner.
- Missed starts, overruns, and pending work remain visible under overload.
- The measured load meets the agreed latency and capacity targets.
- Existing task and conversation behaviour remains unchanged.

These are the bounded-loop and handoff exit checks from **11.2 M1**. They do not complete M1. Tasks, action-basis
checks, resource fencing, perception, the tray, B0, and the timeline remain for later phases.

Rollback disables new claims and new stub dispatch. Drain or cancel owned runs, close active ticks, and retain durable
rows for inspection and recovery. Do not delete state as part of rollback.

### Work items

1. `eldon3/apps/abe/core/tick/`: add clock interfaces, structural contracts, and the pure fake-clock harness.
2. `eldon3/apps/abe/core/models/` and deployment migrations: add immutable runtime settings and validation using
   `EldonModel` declarations and inherited model metadata.
3. `eldon3/apps/abe/core/models/` and deployment migrations: add `AgentState`, checkpoint envelope, indexes, and
   provisioning; ensure lossless epoch storage is supported by the table compiler and hydration.
4. `h/core/worker/` and `h/core/library/database/eldon_db.ts`: add bounded scanner lifecycle and lease helpers with
   startup, shutdown, and database deadline support.
5. `eldon3/apps/abe/core/tick/`: add explicit claim SQL, renewal, epoch checks, and PostgreSQL race tests.
6. `eldon3/apps/abe/core/tick/`: add cadence accounting, budget enforcement, eleven no-op hooks, and retained
   continuations.
7. `eldon3/apps/abe/core/tick/`: add transactional close through a shared `EldonTransactionSession`, wake update, timer
   boundary, and coordinated exit tests.
8. `eldon3/apps/abe/core/models/` and deployment migrations: add `AgentRun` and durable intent storage.
9. `eldon3/apps/abe/jobs/` and `h/core/library/database/eldon_queue.ts`: add the outbox dispatcher, confirm-backed
   publication path, stub-run job, result bump, cancellation, and unknown-run recovery.
10. `eldon3/apps/abe/jobs/` and `h/core/scheduler/`: add the bounded heartbeat adapter using `WorkerConfig.schedules`
    and the existing scheduler contract.
11. `eldon3/apps/abe/core/models/` and `eldon3/apps/abe/core/tick/`: add timing rows, bounded missed-start reporting,
    hook logs, and metrics.
12. `h/core/worker/` and deployment migrations: add shared team start budgets and fairness tests.
13. `eldon3/apps/abe/jobs/server.ts`, `eldon3/apps/abe/jobs/jobs.ts`, `eldon3/apps/abe/jobs/constants.server.ts`, and
    `eldon3/apps/abe/core/shared/models.server.ts`: wire the flag, model registration, scanner resources, continuations,
    jobs, schedules, and Redis configuration.
14. `eldon3/apps/abe/` test fixtures: add crash, outage, duplicate-delivery, handoff, and capacity suites.
15. `eldon3/apps/abe/` rollout configuration and runbook: enable the shadow cohort, record results, and document
    rollback.

### Open decisions

- **Load and latency target.** Default to 1,000 active agents, 200 starts per second, and p95 wake-to-start below one
  second for idle agents under healthy load. Active wakes obey cadence. Measure overload separately.
- **Worker deployment.** Default to a separate tick-worker deployment using the existing `startWorker` bootstrap, with
  run consumers scaled separately.
- **Initial execution limits.** Default to the settings shown above. Change them only through a new settings version
  after the capacity and fault tests.
- **Trace retention.** Default to seven days in PostgreSQL, then archive timing rows. Do not implement sleep or episode
  compaction in this phase.
