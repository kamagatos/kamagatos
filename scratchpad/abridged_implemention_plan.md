# Abe implementation plan

## Phase 1 - Ticks

A tick is a quick step where the agent decides how to interpret a stimuli.

When nothing happens, a tick for a given agent will run every 60s.

|----60s----| tick |----60s---| tick |----60s----| tick |----60s---|

That default 60s cadence is controlled by `nextTickAt`.

The agent will glance at something here and there, consider there's nothing worth doing and go back to sleep until the
next 60s.

Now, if the agent receives a notification, or there is something interesting to do, an internal process will set
`nextTickAt` to an earlier timer.

For example, a notification sets a tick to 5sec. You get:

|--5s--| tick |----60s---| tick |----60s----| tick |----60s---|

Every agent runs some work at a certain cadence. When the agent is busy, it will run every at least every 5 sec, and
when not busy, it will run at least once every minute.

## Mechanism behind the tick

There are a few mechanism that ensure agent's tick:

### The scanner

It's a worker job that picks up all agents that are due for a run. It queries the database every 200ms and picks up
agents that match the following criteria:

1. The agent is `active` and `enabled`.
2. `earliestStartAt` is < `now`.
3. `nextTickAt` is < `now`.
4. `leaseUntil` is < `now`

### Scheduler backstop

In case the agent missed a bit for whatever reason (e.g. server reboot), there's also another job (`tick_agent`) that
runs every 60s, and pick up agents that have not ticked for 60+sec.

- due time passed (). nextTickAt is set when there is a reason for the agent to tick.
- not blocked by the active-start gate (`nextActiveStartAt`).
- not leased by anyone (`leaseUntil`). `leaseUntil` is set when a worker currently owns it.

a row can be in four states that matter to the scanner.

- Not due: nothing to do.
- Due but leased: someone is running it, skip.
- Due, unleased, gate closed: it wants to run, but its next slot has not come yet.
- Due, unleased, gate open: claim it.

There are three ways to run an agent tick:

1. A scheduler backstop: It runs on an 60s interval and wake agents that are due for a tick.
2. A scanner poll:
3. A runtime wake: A finishing run or a timer firing.
