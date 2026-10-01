1. **Blocking**

   None. Section 7.10 resolves the remaining objection. Required checks draw from their reserve once, without a positive-slack cap. Budget and permission limits still hold. A check that cannot run leaves its node unready.

2. **Non-blocking**

   - **7.5:** Make the exception easy to find beside the general time-budget formula. Add: “Required requests use the execution reserve under 7.10 and are not capped by positive slack.”
   - **11.1:** Add a regression case with zero or negative slack and enough budget for exactly the remaining execution reserve. The required check must run, its allowance must be counted once, and optional search must be refused. With too little budget, the node must stay unready and the task must ask.

3. **Verdict**

   ACCEPT