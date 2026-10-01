1. **Blocking**: None. The fixes correctly resolve the double-counting of time, the missing wait times, the structural limitations of the proposed plan, and the admission conflicts for recall and search.

2. **Non-blocking**: 
   - In `type PlanProposal`, `nodes: Plan['nodes']` specifies the full node type. The comment says "for a revision the nodes that change". A true patch might need `Partial<Plan['nodes'][number]>` with the `id` required, but as a schema sketch in a design document, the current text gets the point across perfectly well.

3. **Verdict**: ACCEPT
