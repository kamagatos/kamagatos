1. **Blocking**

   **7.5 and 7.10 — Required checks need access to their reserved budget.**

   Section 7.5 says:

   > “The execution reserve is the estimated time and money to execute and verify the task's remaining steps.”

   But 7.10 admits a request only when:

   > “the task's budget (7.1) covers the request's estimate with the execution reserve (7.5) left over”

   Required checks are exempted from the usefulness gate, but not from this rule. A required simulator check whose cost is already reserved must therefore fit twice: once in the reserve and once outside it.

   The same issue affects time. Section 7.5 gives “each call, and each request” the positive-slack cap. Its exception names only “a deliberation it cannot do without”. A required verification request can have no allowance even when the task can finish on time, because `remaining` already includes that verification.

   For example, ten minutes remain before the deadline. A required check takes one minute, and execution takes nine. The task has ten minutes of active budget. Both fit, but the request fails the reserve rule and has zero slack.

   **Exact rule to add:**

   > Classify a request before setting its budget. Optional thinking must leave the execution reserve intact and fit within positive slack. A required check already included in the reserve spends from that reserve. Its cost is not reserved again, and spare slack does not cap it. Before dispatch, code moves that check's reserved time and money to its running allowance, leaving the rest reserved. Required work still obeys the task budget, the wallet and permissions. If it cannot fit, its node stays unready and the task asks the owner. Expected lateness is recorded; it never waives a check.

2. **Non-blocking**

   - **7.10 — Make node progress explicit.** The text promises a rendering of “its nodes and their state”, but the node shape has no state or link to execution records. Add code-owned node status and outcome references, or state how these are derived durably. Associate required checks with node ids.
   - **7.10 — Record the search stopping reason.** `SearchRun.status` cannot distinguish an exhausted frontier, a good-enough result and no improvement. Add a typed `stopReason` to support the promised trace.
   - **11.15, item 8 — Update the summary.** It still applies the simulator and factual-conflict conditions to every request. Say that these conditions apply only to simulate and search, and that required checks bypass the usefulness gate.

3. **Verdict**

   REJECT