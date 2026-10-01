1. **Blocking**

**7.2 and 7.5 — Time is counted twice in deliberation, and waiting is missing from scheduling.**

7.2 defines:

> `slack(task) = deadline − now − remaining(task) − wait(task)`

7.5 then subtracts again:

> `slack of the task (7.2) − time to execute and verify the chosen action`

Execution belongs in `remaining`. Subtracting it again can deny thinking time that exists. Also, the chosen action is not known before the call starts.

The schedule still uses:

> `late(t, start) = max(0, start + remaining(t) − deadline(t))`

This omits waiting, despite 7.1 saying:

> “both together are what the deadline is measured against”

Exact rule:

> `remaining` includes execution and verification. Deadline slack reserves that time once. Calls and requests use the same urgency bound. Their time allowance is capped by positive slack, the identity’s ceiling, the task’s remaining active budget after the execution reserve, and what the wallet can fund after that reserve. Reserves come from estimates available before the call. With no deadline, omit the slack cap. With non-positive slack, skip optional thinking; a required deliberation uses the shortest supported settings within the remaining budget and records the expected lateness. Permission and evidence checks still hold.

Replace the lateness formula with:

```text
late(t, start) = max(0, start + remaining(t) + wait(t) − deadline(t))
```

When computing start and resume times, blocked waits release the agent for other work.

**7.5 and 7.10 — The fixed output cannot express the proposed plan.**

7.5 still declares:

> `plan?: Step[]`

7.10 requires:

> “A deliberation proposes a plan or revises one.”

The new `Plan` has dependencies, node preconditions, assumptions and open questions. `Step[]` cannot carry those. Code cannot recover their meaning from prose without another language step.

Exact rule:

> The `deliberate` output gains a typed plan proposal or revision. It carries nodes, steps, dependencies, preconditions, completion predicates, estimates, assumptions, open questions and alternatives. A revision names the plan and the revision it changes. Code assigns the stored revision, basis, checks and status. It never extracts plan fields from free text. `Step[]` remains available for short plans. Later deliberations receive a bounded rendering of the current plan, with its id and revision included in their basis.

**7.10 — The simulation shortcut also bars useful memory searches.**

Admission says:

> “A request is admitted when all of these hold”

One condition is:

> “the chosen action is not a plain `read` … and the task is not blocked on a factual conflict”

This covers recall too. It prevents searching for evidence precisely when a conflict needs evidence. It also prevents recall from answering whether a live read is needed.

Replace that condition with:

> For simulate and search, do the plain read when it can answer the question more cheaply. Neither may settle a factual conflict. Directed recall may run before a read or while a conflict is pending; retrieved evidence still follows the reconciliation and certainty rules.

**7.10 — Plan checks require search that the admission rule may refuse.**

The lifecycle says:

> “the simulators that apply have been asked where feasibility can be computed”

and:

> “Alternatives are tested by search where there is a simulator”

But the section also says:

> “Search is admitted only where its rung on the ablation ladder shows a gain.”

It also allows simulators with only the `simulate` part. Having a simulator does not establish that search exists or has earned admission. As written, a plan can require a request that the same section forbids.

Exact replacement rule:

> Code distinguishes required feasibility checks from optional comparison of alternatives. Required checks must pass before the affected node is ready. They are subject to budget and permission checks, but not to the learned usefulness gate. If they cannot run, the node stays unready. Rollouts and search for better alternatives are optional. They run only when the required simulator parts exist and admission allows them. A denied optional search does not prevent readiness when the required checks have passed.

2. **Non-blocking**

- **1.1:** Replace “The last row is the most important” with “The language-cortex row is the most important.” The added row changed the reference.
- **4.6:** Define how failures share a bounded recall page with successes. “Always includes the matching episodes” cannot promise every failure within seven slots. Reserve space for a matching failure and report the rest through coverage and paging.
- **7.10:** Replace “an exact evaluator” in the chess example with “exact transitions and a labelled evaluator.” The earlier contract correctly allows heuristic scores.
- **11.1:** Separate capability parity from ablation. B0 can have access to the same operations while a named experiment disables directed recall or rollout. State which comparison each rung reports.

3. **Verdict**

REJECT