1. **Blocking**

**7.5 and 7.10 — Contradiction on the time budget for required requests.**
In round two Astra pointed out that 7.5 subjects "each request" to the positive-slack cap, which conflicts with the fact that required checks have their time already reserved. In 7.10 you correctly added that for required requests, "positive slack does not cap it." However, 7.5 still applies the positive-slack cap to all requests and names only "a deliberation" in its late-task exception. This creates a direct contradiction.

Quote from 7.5:
> - **Time budget.** Each call, and each request (7.10), gets a time budget, set before it starts:
>   `min(positive slack of the task (7.2), the identity's ceiling for this prompt kind, the task's remaining active budget after the execution reserve, what the wallet allows (6.1) after that reserve)`.

Quote from 7.10:
> A **required** request is a required check on a plan node (above), and its cost is already inside the execution reserve (7.5): it spends from that reserve, it is not reserved twice, and positive slack does not cap it.

**Exact replacement text** for the 7.5 "Time budget" bullet:
```markdown
- **Time budget.** Each call, and each optional request (7.10), gets a time budget, set before it starts:
  `min(positive slack of the task (7.2), the identity's ceiling for this prompt kind, the task's remaining active budget after the execution reserve, what the wallet allows (6.1) after that reserve)`.
  The **execution reserve** is the estimated time and money to execute and verify the task's remaining steps. It is
  already inside `remaining` (7.1), so slack reserves it once; the reserve is subtracted only from the task's own budget
  and from the wallet, so that thinking never eats what the actions need. All reserves come from estimates that exist
  before the call starts. A task with no deadline has no slack cap. A task whose slack is zero or negative skips
  optional thinking; a deliberation or required request it cannot do without runs at the shortest supported settings
  within the remaining budget, and the trace records the expected lateness. The budget maps to the call's settings:
  tier, reasoning effort, maximum tokens. Care mode raises the ceiling; a task that is already late lowers it and drops
  a tier. Decision models call this a collapsing bound: as time runs out, the threshold for accepting an answer lowers,
  and you go with less evidence. How long the agent may think is decided by urgency, never by a constant. Urgency
  shortens thinking; it never lowers a permission, skips an evidence check, or turns an unresolved precondition into a
  satisfied one. What happens to a call in flight is in 8.5.
```

2. **Non-blocking**

None. The additions of `status`, `outcome`, `stopReason`, and the updates to `PlanProposal` and 11.15 item 8 resolve all of Astra's other concerns perfectly.

3. **Verdict**

REJECT
