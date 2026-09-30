# Abe: a brain-shaped autonomous agent

Design for the autonomous agent behind Abe (eldon3). The raw ideas are in `abe_brainstorm.md`; this document turns them
into something we can build. It is written chapter by chapter.

The goal: an agent that runs on its own, on behalf of a person or a team, and whose architecture follows the
organisation of the human brain as closely as is useful.

---

## 1. Frame

### 1.1 What "like the brain" buys us

We are not simulating neurons. We are copying the brain's **organisation**: which jobs it splits apart, what it keeps
small, what it does in the background, what it forgets. Each of those choices solves a problem we also have.

| Brain trait                                 | Problem it solves for us                                        |
| :------------------------------------------ | :-------------------------------------------------------------- |
| Continuous sensing, but a tiny attention    | Cheap to be always on; only a few things ever reach the LLM     |
| Working memory holds ~4 to 7 chunks         | Prompts stay small, fast, and readable in a debugger            |
| Several memory systems, not one             | Facts, events and skills need different storage and retrieval   |
| Sleep consolidates and forgets              | Memory stays fast and relevant; noise is dropped, not kept      |
| Habits run without thinking                 | Most repeated work costs no LLM call and takes milliseconds     |
| Prediction first, then surprise             | Novelty and errors are detected for free, and drive learning    |
| Drives (hunger, boredom, curiosity)         | The agent acts unprompted, and knows when to stop spending      |
| Emotion tags memories and steers attention  | Important things are remembered and handled with care           |
| Language is one region, not the whole brain | The LLM is a tool the agent uses, not the agent itself          |

The last row is the most important. In most "LLM agents" the model is the whole brain: memory is a transcript, decision
is the next token, and every step is a call. Here the LLM is the **language and reasoning cortex**. Everything else
(sensing, attention, memory, drives, action selection, monitoring) is ordinary code with ordinary data. That is how we
get the goals from the brainstorm:

- **Debuggability:** every tick leaves a trace of what was sensed, what won attention, what was recalled, what was
  decided and why. The agent explains itself from the trace, not from a fresh guess.
- **No hallucination:** facts live in memory stores with sources. The LLM reasons over what it is shown and marks what
  it does not know. Outbound claims are checked against memory before they leave.
- **Reliability:** repeated tasks become procedures. Procedures are deterministic.
- **Performance:** the fast path (habit) runs without a model. The slow path (deliberation) runs on a bounded prompt.

### 1.2 Running example

To keep the text concrete, one agent appears throughout: **Nia**, an operations agent on a three-person team. Her owner
is Kam. She has a mailbox, a calendar and a Notion workspace. Her standing job: keep Kam's inbox handled, keep the
team's weekly plan in Notion up to date, and flag anything that needs Kam.

### 1.3 The brain map

| Brain                                       | Agent component     | Job                                                                         |
| :------------------------------------------ | :------------------ | :-------------------------------------------------------------------------- |
| Senses, thalamus                            | **Perception**      | Turn raw stimuli (mail, chat, calendar, timers, drives) into percepts       |
| Salience network (insula, cingulate)        | **Attention**       | Score percepts; let a few into working memory; interrupt when needed        |
| Prefrontal cortex                           | **Working memory**  | The bounded "now": self, goal, task, attended percepts, recalled memories   |
| Hippocampus                                 | **Episodic memory** | What happened, when, with whom, how it went                                 |
| Neocortex                                   | **Semantic memory** | Entities and facts with confidence: people, projects, documents, rules      |
| Basal ganglia, cerebellum                   | **Procedures**      | Compiled skills that run without deliberation                               |
| Sleep, hippocampal replay                   | **Consolidation**   | Nightly job: extract facts, compile habits, compact, forget                 |
| Predictive coding, cerebellum               | **Expectations**    | What should happen next; surprise when it does not                         |
| Hypothalamus, interoception                 | **Drives**          | Boredom, budget, curiosity, social contact; set-points that create stimuli  |
| Amygdala, appraisal                         | **Appraisal**       | Valence and arousal on percepts; weighs attention and memory strength       |
| Prefrontal cortex, basal ganglia            | **Executive**       | Goals → tasks → steps; pick one action, inhibit the rest; monitor outcome   |
| Motor cortex, effectors                     | **Tools**           | Typed atomic operations with cost, reversibility and permission             |
| Language cortex                             | **LLM**             | Understand and produce language; deliberate over working memory            |
| Default mode network                        | **Idle mode**       | When nothing is pressing: review, plan, explore, per identity               |
| Theory of mind                              | **People models**   | What each person knows, wants, and how close they are                       |
| Sense of self                               | **Identity**        | Name, role, values, autonomy level, owner. Fixed by the owner               |

Each component gets its own chapter. Chapter 10 maps them onto eldon3 and h.

### 1.4 The tick

The agent is a loop. The brain never stops sensing; the loop never stops ticking. A tick is cheap when nothing
happens, and most ticks are like that.

```text
every tick (seconds while active, minutes while idle):

  1. Sense      collect stimuli since last tick: integrations, chat, timers, job results,
                and internal signals from drives
  2. Perceive   normalise each stimulus into a percept: entities, changes, actor, time
  3. Predict    match percepts against open expectations; mark met / missed / surprising
  4. Appraise   tag valence and arousal
  5. Attend     score salience; gate into working memory; decide whether to interrupt
  6. Recall     pull related episodes, facts, procedures and people into working memory
  7. Select     fast path: a procedure matches with confidence → run it
                slow path: deliberate with the LLM over working memory → a plan and one action
                no path: wait, or ask the owner
  8. Act        run one atomic operation; store the expected outcome
  9. Observe    compare outcome to expectation; write the episode; update procedure stats
 10. Regulate   update drives; evict from working memory; schedule the next tick
```

Sleep is not a step in the tick. It is a separate job that runs when the agent has been idle long enough or on a
schedule (Chapter 5).

Two things make this loop different from a chat loop:

- **Interrupts are decided, not automatic.** A new stimulus does not stop the current task. It gets a salience score,
  and only wins if it beats what the agent is doing (Chapter 3).
- **The LLM is optional per tick.** Steps 1 to 6 and 8 to 10 are code. Step 7 only calls the model when no procedure
  fits. A quiet day for Nia is thousands of ticks and a handful of model calls.

### 1.5 What one tick looks like for Nia

09:12. Nia is drafting the weekly plan (a task, step 3 of 6). A tick runs.

1. **Sense:** two new emails, one calendar reminder (standup in 15 min), a Notion page edit by a teammate.
2. **Perceive:** email A is from a supplier about an invoice; email B is a newsletter; the reminder is the daily
   standup; the Notion edit touched the page Nia is editing.
3. **Predict:** the standup reminder was expected (met). The Notion edit was not (surprising: someone touched the page
   she is working on). The invoice mail was expected "this week" (met, early).
4. **Appraise:** invoice mail: mild negative valence (money owed), low arousal. Notion edit: neutral, medium arousal
   (conflict risk).
5. **Attend:** Notion edit scores highest (surprise + touches the active task) and interrupts. Invoice mail enters
   working memory but does not interrupt. Newsletter scores below threshold: logged to episodic memory, not attended.
   Standup: queued as a task with a deadline.
6. **Recall:** the teammate's people model (she often edits plans directly), the page's recent history, the procedure
   "merge concurrent edits".
7. **Select:** the procedure matches with confidence 0.85: fast path. No model call.
8. **Act:** re-read the page, merge, continue the draft. Expected outcome: no conflict on save.
9. **Observe:** save succeeded. Episode written. Procedure stats: one more success.
10. **Regulate:** boredom 0, budget fine, next tick in 5 seconds.

The invoice is still in working memory. When the plan is done, the executive picks the next task, and the invoice
procedure ("forward supplier invoices to Kam with a one-line summary") is the likely winner.

### 1.6 Principles, in one place

1. **Sense everything, attend to little.** Cost lives in attention, not in sensing.
2. **Working memory is small on purpose.** If it does not fit, recall it or summarise it.
3. **Nothing is lost by inattention, only demoted.** Unattended percepts still become episodes.
4. **Facts have sources and confidence.** A fact without a supporting episode dies at the next sleep.
5. **Habits before thought.** Deliberation is for the new and the surprising.
6. **Predict, then compare.** Every action carries an expected outcome. Every expectation has a deadline.
7. **Drives make it autonomous.** No drive, no unprompted action.
8. **Understand emotion, do not perform it.** Appraisal is internal. Tone toward people comes from people models.
9. **The trace is the explanation.** "Why did you do that" is answered from the tick record.
10. **Autonomy is a dial the owner holds.** Irreversible or outward-facing actions need the identity's permission
    level, or the owner.

### 1.7 Chapters

2. Perception
3. Attention and working memory
4. Memory: episodic, semantic, procedural
5. Consolidation (sleep) and forgetting
6. Drives, appraisal and identity
7. Executive: goals, planning, action selection, monitoring
8. Tools and the LLM
9. Learning
10. Debugger, safety, and the eldon3 mapping
11. Milestones and the test harness

---

## 2. Perception

Senses turn physical stimuli into signals the brain can use. The eye does not send pictures; it sends edges, motion
and contrast, and later stages build objects out of them, helped by what the brain already expects to see. Perception
is continuous, parallel, cheap, and mostly ignored.

For Nia, a stimulus is an email, a chat message, a calendar change, a Notion edit, a timer, the result of her own
action, or a signal from one of her drives. Perception turns each into a **percept**: a small structured record that
says who did what, to which entity, when, and where.

### 2.1 Senses

A sense is a source of stimuli plus the code that reads it (the receptor). Each integration an agent is granted
becomes one or more senses. Internal sources are senses too, so everything enters through one door.

| Sense           | Stimulus                                    | Receptor                                                   |
| :-------------- | :------------------------------------------ | :--------------------------------------------------------- |
| `mail`          | New or changed message in a mailbox         | Poll or watch; headers and snippet only                    |
| `chat`          | Message in an Abe conversation              | Push from the app                                          |
| `calendar`      | Event created, moved, cancelled, or near    | Poll a rolling window; diff against the last snapshot      |
| `notion`        | Page created or edited                      | Poll `last_edited_time`; diff blocks against last snapshot |
| `timer`         | An expectation's deadline, a scheduled tick | The scheduler                                              |
| `outcome`       | Result of the agent's own action            | The tool runner                                            |
| `drive`         | A drive crossed its set-point               | The regulator (Chapter 6)                                  |
| `web`           | Result of a requested read                  | Only on demand (see active sensing)                        |

A revoked or failing integration is a numb sense. The receptor emits a stimulus saying so, and the agent perceives its
own numbness instead of silently going blind. That is how Nia ends up telling Kam "I lost access to the calendar"
instead of missing meetings.

### 2.2 Shapes

```typescript
type Stimulus = {
  id: string
  at: Date                  // when it happened in the world
  sensedAt: Date            // when the receptor saw it
  sense: SenseKind
  accountId?: string        // which integration account
  externalId?: string       // for de-duplication (message id, page id + version)
  payload: unknown          // raw, as received
}

type Percept = {
  id: string
  stimulusId: string
  at: Date
  sense: SenseKind
  space: SpaceRef           // where in the agent's world: mailbox, thread, page, channel
  actor: EntityRef | null   // who caused it; null for timers and drives
  entities: EntityRef[]     // everything recognised: people, documents, projects, amounts
  changes: Change[]         // what changed, as facts: "message added to thread T"
  content?: {               // present only after a focused read (2.4)
    text: string
    intent?: 'request' | 'question' | 'information' | 'notification' | 'social'
    asks?: Ask[]            // things someone wants done, with who and by when
    summary: string
  }
  signature: string         // stable hash of (sense, actor, kind) for habituation
  seenBefore: number        // how many times this signature has been perceived
}

type Change =
  | { kind: 'added'; entity: EntityRef; to: SpaceRef }
  | { kind: 'edited'; entity: EntityRef; diff?: string }
  | { kind: 'removed'; entity: EntityRef }
  | { kind: 'moved'; entity: EntityRef; from: SpaceRef; to: SpaceRef }
  | { kind: 'approaching'; entity: EntityRef; in: Duration }   // an event or deadline
  | { kind: 'level'; drive: DriveKind; value: number }        // internal
```

An `EntityRef` points into semantic memory (Chapter 4) or, for something never seen, into a **candidate** entity
created on the spot with low confidence. Perception may propose entities; only consolidation promotes them.

### 2.3 Stages

Perception is a pipeline, and each stage is cheaper and more common than the next. The order matters: the deterministic
stages do the bulk of the work, and the model sees only what survives.

1. **Receptor.** Source-specific parsing: ids, timestamps, headers, participants, thread ids, diffs. Deterministic.
   Produces the `Stimulus` and the skeleton of the `Percept`.
2. **Features.** Mentions, dates, amounts, URLs, reply markers, "urgent" tokens, language. Regex and parsers.
3. **Recognition.** Entity resolution against semantic memory. Identifiers first (email address, page id, calendar id),
   then names. A match fills `actor` and `entities`. No match creates a candidate.
4. **Priors.** Match the percept against open expectations (Chapter 7). "Reply from the supplier about the invoice,
   this week" matches a mail from the supplier's domain with "invoice" in the subject. A matched expectation lends its
   interpretation to the percept, and the next stage can be skipped.
5. **Interpretation.** For natural-language content only, and only when attended (2.4): a small model call that returns
   `intent`, `asks` and `summary` as structured output. Batched per tick. This is the one place the LLM takes part in
   perception, on the cheapest tier.

Stages 1 to 4 run on every stimulus. Stage 5 runs on the few that matter.

### 2.4 Peripheral and focused sensing

The eye has a high-resolution centre and a blurry periphery, and the brain moves the centre to what attention picks.
We copy that.

- **Peripheral sensing** is what receptors do on their own: metadata, participants, subject lines, snippets, diffs. It
  is enough to compute salience (Chapter 3) and costs nothing but API calls.
- **Focused sensing** fetches the full content: the mail body, the whole page, the thread. It happens only when
  attention selects a percept, or when the executive asks for it as an action ("read this thread"). The result comes
  back as a new percept with `content` filled in.

Nia's newsletter is perceived peripherally (sender, subject, snippet), scores low, and is never read in full. The
supplier's invoice is read in full because it won attention. Reading is an act, and it shows up in the trace.

### 2.5 Time and space

Every percept has two times: when it happened (`at`) and when Nia saw it (`sensedAt`). The gap matters: a mail that
arrived while she was asleep is old news, not a fresh event, and salience uses `at`.

Space for a digital agent is the place in its world: this mailbox, this thread, this Notion page, this chat. Spaces
nest (page inside workspace, message inside thread inside mailbox). A percept's space is what lets attention ask "does
this touch what I am doing", and what lets episodes answer "where was I".

### 2.6 Habituation

Repeated identical stimuli fade. The daily newsletter, the recurring reminder, the bot that posts every hour. Perception
computes a `signature` (sense, actor, kind of change) and counts how often it has been seen. Attention turns the count
into lower novelty (Chapter 3). A change in the pattern (the newsletter arrives from a new address, or twice in a day)
breaks the signature and the stimulus is novel again.

### 2.7 What perception does not do

- It does not decide or act.
- It does not write facts. It writes stimuli, percepts, and candidate entities.
- It does not read full content on its own.
- It does not call the model except for interpretation of attended text.

### 2.8 The invoice mail, perceived

```text
stimulus   mail, account=kam@…, externalId=<msg-id>, at=09:11:40
receptor   from=billing@acme.com  to=kam@…  subject="Invoice 2291 – due Oct 15"  thread=T-88  snippet="Please find…"
features   amount=€1,240  date=Oct 15  urgentTokens=none  isReply=false
recognise  actor → Person "Acme billing" (id P-31, seen 6 times)   entities → Org "Acme" (O-4), Amount, Date
priors     expectation E-207 "Acme invoice, this week" → matched, early
interpret  skipped (expectation supplies intent=request, ask="pay 1240 by Oct 15")
percept    space=mailbox/T-88  changes=[added message to T-88, approaching deadline Oct 15]  signature=mail:P-31:invoice  seenBefore=5
```

Salience will decide what happens to it next.

---

## 3. Attention and working memory

The brain senses far more than it can think about. A salience network picks the few things that get through, and a
small working memory holds them while the prefrontal cortex works. Capacity is about four chunks. That limit is not a
weakness we should engineer away: it is what forces the brain to recall, summarise and prioritise, and it is what will
keep Nia's prompts small and her trace readable.

### 3.1 Salience

Each percept gets one score. Bottom-up terms come from the percept itself; top-down terms come from what the agent is
doing and who it is.

```text
salience = wN·novelty + wG·goal + wA·actor + wU·urgency + wV·arousal + wS·self
```

| Term      | Source                | How it is computed                                                                   |
| :-------- | :-------------------- | :----------------------------------------------------------------------------------- |
| novelty   | Predict step (2.3 §4) | 0.1 if an expectation matched, 0.5 if it matched loosely, 1.0 if nothing predicted it; then divided by `1 + log(1 + seenBefore)` for habituation |
| goal      | Executive             | 1.0 if the percept's space or entities touch the current task; 0.6 if they touch another open task; 0.3 if they touch a standing goal; else 0 |
| actor     | People models         | The actor's proximity (Chapter 6): owner 1.0, teammate ~0.7, known contact ~0.4, stranger 0.2, none 0.3 |
| urgency   | Features              | From the nearest deadline among `changes`: 1.0 under 15 minutes, 0.7 today, 0.4 this week, 0.1 later; explicit "urgent" words add at most 0.2 |
| arousal   | Appraisal (Chapter 6) | 0 to 1                                                                               |
| self      | Features              | 1.0 if addressed directly (To:, @mention, DM), 0.5 if copied, 0 otherwise           |

The weights `w` are part of the identity (Chapter 6). A support agent runs with a high `actor` weight and a low `goal`
weight: people first. A research agent runs the other way round. The defaults sum to 1 so salience stays between 0 and 1.

Nia's tick from 1.5, with default weights (N .25, G .25, A .15, U .15, V .1, S .1):

```text
                     novelty  goal  actor  urgency  arousal  self   salience
Notion edit           1.0     1.0   0.7    0.0      0.5      0.0    0.68
Invoice mail          0.1     0.3   0.4    0.4      0.3      0.5    0.28
Standup reminder      0.1     0.0   0.3    1.0      0.1      0.0    0.23
Newsletter (seen 40×) 0.21    0.0   0.2    0.0      0.0      0.0    0.08
```

### 3.2 Gates

Two thresholds, and one comparison against the current task.

- **Attend** (default 0.15): at or above, the percept enters working memory. Below, it is written to episodic memory
  as an unattended percept and nothing else happens now. The newsletter stops here.
- **Interrupt**: the percept wins the tick, and the current task is suspended, when
  `salience > engagement + switchCost`. Engagement is the current task's priority (Chapter 7) scaled by how deep the
  agent is in it (a task at step 5 of 6 is harder to interrupt than one just started). `switchCost` defaults to 0.1
  and is the price of losing flow. The Notion edit (0.68) beats Nia's plan-drafting engagement (0.45 + 0.1).
- **Queue**: attended but not interrupting. The percept sits in working memory and becomes a candidate task at the
  next selection. The invoice and the standup do this.

Nothing below the attend gate is lost. Unattended percepts are still perceived, still counted for habituation, and
still reviewed in bulk during idle mode (Chapter 6) the way a person skims the inbox when there is nothing better to do.

### 3.3 Inhibition of return

Once a percept has been handled (a task consumed it, or the executive chose to ignore it), the same thread or entity
does not win attention again unless something new happens to it. Perception's `changes` list is what "new" means. This
is what stops Nia re-reading the same thread every tick.

### 3.4 Working memory

Working memory is a fixed set of slots with fixed capacities. Its rendering is the prompt for the slow path; there is
no other prompt. What is not in working memory does not exist for the LLM on that tick.

```typescript
type WorkingMemory = {
  self: IdentitySummary          // fixed, ~200 tokens. Who am I, whose agent, what I may do alone
  now: {
    time: Date
    space: SpaceRef              // where attention currently is
    drives: DriveSnapshot        // boredom, budget, curiosity, social, as levels
    goal: GoalRef | null         // the standing goal being served
    task: TaskFrame | null       // the current task: steps, current step, short history
  }
  attention: Percept[]           // max 4, ordered by salience
  recall: Recalled[]             // max 7: episodes, facts, people, procedures; each with id and activation
  expectations: Expectation[]    // max 5, the open ones tied to the task
  scratch: string                // the agent's own last reasoning summary for this task, max ~300 tokens
  conflicts: Conflict[]          // recalled facts that contradict attended percepts (3.6)
}
```

Budget: about 3,000 to 4,000 tokens rendered. That is a design constraint, not a tuning value. If a task needs more,
the task is too big and should be split (Chapter 7), or the content should be recalled on demand instead of carried.

### 3.5 Eviction and chunking

Every item in working memory has an activation: recency, times touched, and relevance to the current task. When a slot
is full, the lowest activation leaves. Eviction is free because episodic memory already has everything; only the
convenience of having it in front of the agent is lost. Recall (Chapter 4) can bring it back.

Long task histories are chunked. When `task.history` grows past its budget, the oldest steps are collapsed into one
line ("steps 1 to 3: read the thread, found two open questions, drafted answers") by a cheap model call, and the detail
stays in the episode. This is rehearsal: the story gets shorter and the agent keeps the point.

### 3.6 Focus and the frame stack

`context:focus` from the brainstorm is the executive setting `now.task`. Everything top-down (goal relevance, recall,
expectations) is computed relative to the focus, while `self` and the standing goals stay in place. The bigger picture
is never dropped; it is just not in the foreground.

When a percept interrupts, the current `TaskFrame` (its step, history, scratch and recalled items) is pushed onto a
stack and the new task takes the foreground. When the new task ends, the frame is popped and restored, and the agent
resumes where it was. The stack has a depth of three. A fourth interrupt does not push; it is queued instead. Deeper
than that, people lose the thread too.

Frames on the stack are the brainstorm's ephemeral and nested contexts: the plan Nia was drafting, inside which the
merge she is now doing, inside which a question she may ask the teammate.

### 3.7 Reconciliation

A recalled fact and an attended percept can disagree: memory says the standup is at 10:00, the calendar says 09:30
today. Attention does not pick a side. It records a `Conflict` in working memory, and the executive must resolve it
before acting on either: update the fact with the new evidence, distrust the percept, or ask. Conflicts are surprising
by definition, so they also feed learning (Chapter 9). An agent that acts on two contradicting beliefs at once is the
software version of confusion, and this slot is what prevents it.

### 3.8 Rendering

Working memory renders to text in a fixed order (self, now, conflicts, attention, recall, expectations, scratch), each
item prefixed with its id (`P-1042`, `E-207`, `F-77`). The LLM is asked to cite those ids when it uses them. The
debugger shows the rendering verbatim next to the model's answer. If the agent says something that cites no id, that
is a claim from the model's own weights, and Chapter 10 says what happens to it.

---

## 4. Memory: episodic, semantic, procedural

The brain does not have "a memory". It has several, with different jobs, different speeds, and different ways of
forgetting. The hippocampus records specific events fast, in one shot. The neocortex learns general facts slowly, from
many events. The basal ganglia and cerebellum store skills that run without recall. Working memory (Chapter 3) is
none of these: it is where the others meet.

Today's Abe keeps memory as a transcript and replays the last 20 to 50 requests. That is neither episodic nor semantic;
it is a tape. Nia keeps the transcript as an audit log and never reads it back. She remembers the way people do.

### 4.1 Episodic memory: what happened

One episode per attended thing: a percept that won attention, an action with its outcome, a decision. Episodes carry
time, space, who, what, how it went, and how it felt.

```typescript
type Episode = {
  id: string
  at: Date
  until?: Date                  // for spans (a task, a conversation)
  space: SpaceRef
  goal?: GoalRef
  task?: TaskRef
  percepts: PerceptRef[]
  action?: { op: string; args: unknown; expected: string }
  outcome?: { result: unknown; matchedExpectation: boolean }
  entities: EntityRef[]
  people: EntityRef[]
  valence: number               // -1 to 1
  arousal: number               // 0 to 1
  summary: string               // one to three lines, written at encoding
  accesses: number              // times recalled (creation counts as one)
  lastAccess: Date
  pinned: boolean               // the owner said "remember this"
  block?: EpisodeRef            // set once compacted into a block (Chapter 5)
}
```

Unattended percepts also become episodes, but **thin** ones: percept refs, no summary, arousal 0. They exist so that
"did anything come from Acme last week" has an answer, and they are the first thing sleep throws away.

### 4.2 Semantic memory: what is true

Entities and facts. An entity is a person, an organisation, a project, a document, a thread, a tool, a place. A fact
is subject, attribute, value, and every fact carries a distribution and its sources. This is the brainstorm's
**Identity** made concrete: memory does not say "Acme pays in 30 days", it says "Acme pays in 30 days (0.8) or 45
days (0.2), from six episodes, last confirmed Sept 2".

```typescript
type Entity = {
  id: string
  kind: 'person' | 'org' | 'project' | 'document' | 'thread' | 'tool' | 'place' | 'concept'
  names: string[]
  identifiers: Record<string, string>   // email, notion page id, calendar id, domain
  candidate: boolean                    // proposed by perception, not yet confirmed by sleep
  firstSeen: Date
  lastSeen: Date
}

type Fact = {
  id: string
  subject: EntityRef
  attribute: string                     // "pays_in_days", "prefers", "works_on", "reports_to"
  values: { value: unknown; p: number }[]   // a distribution; values can be entity refs
  confidence: number                    // how much evidence stands behind the distribution
  sources: EpisodeRef[]
  firstSeen: Date
  lastConfirmed: Date
  lastContradicted?: Date
  pinned: boolean
}
```

Three things live here that people usually store elsewhere:

- **Relations** are facts whose value is an entity: `Acme —supplier_of→ team`.
- **Preferences and rules** are facts about a person or the team: `Kam —prefers→ "supplier invoices forwarded with a
  one-line summary"`. The owner's instructions are facts with `pinned: true` and `p: 1`.
- **People models** (Chapter 6) are entities of kind person with a few reserved attributes: proximity, response time,
  what they know, how they like to be addressed.

Perception creates candidate entities. Sleep promotes or drops them. A candidate seen twice, or involved in an attended
episode, gets promoted; the rest are gone in thirty days.

### 4.3 Procedural memory: how to do things

A procedure is a trigger, preconditions, steps, and an expected outcome, plus its track record. Procedures are what
make the fast path in the tick (1.4 step 7) possible. They come from two places: the owner writes them (a playbook),
or sleep compiles them from repeated successful episodes (Chapter 5).

```typescript
type Procedure = {
  id: string
  name: string
  trigger: {
    percept?: PerceptPattern     // sense, actor kind, intent, entity kinds
    goal?: GoalRef               // or: serves this standing goal
  }
  preconditions: FactPattern[]   // must hold in semantic memory, e.g. actor is a known supplier
  steps: Step[]                  // atomic ops with parameters bound from working memory
  expected: OutcomePattern
  permission: PermissionLevel    // the highest level any step needs (Chapter 8)
  origin: { kind: 'authored'; by: EntityRef } | { kind: 'compiled'; from: EpisodeRef[] }
  stats: { runs: number; successes: number; failures: number; lastRun?: Date; lastFailure?: Date }
}
```

Confidence is `(successes + 1) / (runs + 2)`: a new compiled procedure starts around 0.75 after three clean runs, and
one failure in ten runs leaves it at 0.83. The fast path needs 0.8 (Chapter 7); below that the procedure is still
recalled, but as a suggestion the slow path can follow or reject. Authored procedures start at 0.9 and are never
deleted by sleep, only flagged when they keep failing.

### 4.4 Prospective memory: what should happen

Expectations are memories about the future: "a reply from Acme by Friday", "the standup at 09:30", "Kam sends the
contract Thursday". They are what the Predict step (1.4 step 3) matches percepts against, and what fires as a `timer`
stimulus when the deadline passes with nothing matched. They are created by actions (every outbound message expects a
reply), by perception (an ask with a date), and by sleep (open loops). Chapter 7 gives the shape and the lifecycle.

### 4.5 Activation: the one number behind recall and forgetting

Every episode, fact and procedure has an activation. It rises when the item is created or recalled, and decays with
time. It decides what recall returns first, and what sleep forgets. We use the ACT-R base-level form because it has
thirty years of fit to human recall curves and is cheap to compute:

```text
B = ln(accesses) − d · ln(hoursSinceCreated)  + 0.5 · arousal  (+ bonus if pinned)
                                                d = 0.5
```

Then, at recall time, cue overlap adds to it:

```text
A = B + Σ over cues c in working memory of  S(c, item)
```

where `S` is a fixed strength for each kind of match: same thread 1.0, same entity 0.7, related entity one hop away
0.3, same space 0.2, text similarity scaled to 0 to 0.5.

A few consequences, and they are the ones we want:

- Something seen once fades within days. Something recalled three times is available for weeks. A fact confirmed ten
  times lasts years.
- Recalling an item strengthens it. Habits of thought form on their own.
- Emotionally charged episodes (a mistake that upset Kam) stay recallable much longer than routine ones.
- The formula runs in SQL: `accesses`, `createdAt` and `arousal` are columns.

### 4.6 Recall

Recall is step 6 of the tick. Its cue is the content of working memory: the attended percepts' entities, threads and
spaces, the current task's goal, and the text of the percept if any. It runs in three passes, all deterministic:

1. **Index lookup.** Episodes, facts and procedures that reference the cued entities, threads or spaces directly. This
   is the hippocampal index: entity to everything that touched it.
2. **Spreading.** One hop along relation facts from the cued entities (Acme → its people, its project, "supplier"), and
   the items those touch, at lower strength. This is pattern completion: a sender's address brings back the invoice,
   the deal, and the last time it went wrong.
3. **Similarity.** Text search over summaries and fact values for the percept's words. Full-text search first; an
   embedding index later, once we have one (Chapter 10).

Candidates are scored by activation `A`, everything under a retrieval threshold is dropped, and the top items fill the
`recall` slot up to its capacity of seven, with procedures and pinned facts given the first places. Each recalled item
gets an access recorded. Recall never calls the model.

### 4.7 Reconsolidation

A recalled memory is open for editing. When a recalled fact is confirmed by an attended percept, its `lastConfirmed`
and confidence move now, in the tick, not at night. When it is contradicted, the conflict goes into working memory
(3.7) and its resolution writes back: the winning value's `p` goes up, the losing value's goes down, the new episode
joins the sources. Values are never deleted at this point; they are outweighed. That is why Nia can answer "I thought
the standup was at ten; it moved to nine-thirty on Sept 12".

### 4.8 What is not memory

- The **transcript** of model calls (`AiSingleTurnRequest` in h) stays as an audit trail and a cost ledger. The agent
  does not read it.
- **Raw payloads** (mail bodies, page snapshots) are kept in cold storage for a while, addressed from percepts, and
  are not part of any recall pass. Reading them is focused sensing (2.4), an act.
- **The model's weights** are not memory. Anything the model asserts that has no id behind it is a guess, and
  Chapter 10 says how guesses are handled.

### 4.9 The invoice, recalled

Cues: Acme billing (P-31), Acme (O-4), thread T-88, "invoice", mailbox.

```text
pass 1   F-77   Kam prefers supplier invoices forwarded with a one-line summary   (pinned, via O-4 → supplier)
         PR-12  procedure "forward supplier invoice"                                 conf 0.88, 9 runs
         E-1180 episode Sept 2: Acme invoice 2260 forwarded, Kam paid in 3 days      A = 1.9
         P-31   Acme billing: replies in ~1 day, formal tone                          (people model)
pass 2   F-102  Acme is the supplier for the "office move" project                   A = 0.6
pass 3   E-1044 episode July: an Acme invoice had a wrong amount, Kam asked to check  A = 1.4 (arousal 0.7 kept it warm)
```

Seven candidates, six make it. The July episode is the interesting one: without the arousal bonus it would have faded,
and Nia would not think to check the amount before forwarding.
