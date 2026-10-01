**The missing piece is a bounded process for building and testing a decision across ticks.** Planning, simulation and search already have partial homes in Abe. They need stronger contracts, not three new “brain regions.”

**1. The first review is directionally right, but overstates the gaps.**

| Claim | My reading |
| :--- | :--- |
| Planning must happen in one call | Too strong. §7.5 permits later step deliberations and plan revision. Frames preserve steps, history and scratch across ticks (§3.6). What is missing is an explicit lifecycle for a *plan under construction*, with alternatives and unresolved questions. |
| The forward model only predicts one step | It has no sequence rollout, yes. But its expectations already extend hours or days and cover several consequences of an action (§7.6–7.7). Also, predictions come from procedures and deliberation, not only causal facts and people models. |
| Zoom is not search | Correct. A context stack does not supply candidate generation, evaluation, pruning or a stopping rule. |
| Simulation exists only in dreams | Incorrect. There are sandbox experiments (§9.6), constructed negative cases (§9.3), the offline what-if debugger (§10.1), and the simulated harness (§11.1). None supplies online action lookahead. Dreams also run the fast path, so “never candidate moves” is stronger than the text supports. |
| Recall is passive | Incomplete. `read_history` is explicitly directed (§4.8). Temporal lookup, widening and zooming into blocks are also directed (§13.4–13.6). Priming and incubation broaden retrieval (§4.10). What is missing is a general query interface available during deliberation. |
| Exploration means tool experiments | That is its defined meaning in §9.6. But wandering (§12.5), incubation and the `explore` knob already cover other forms. Name the proposed mechanism **option search** or **directed recall**. |
| Two candidates within 0.1 detect uncertainty | No. Their *priority* measures scheduling importance, not uncertainty about consequences or the value of further computation. `Deliberation.options` does not even have a priority field. |
| One mismatch-per-model-call test is enough | No. It omits simulator cost, delay, omissions and human work. It also rewards avoiding difficult actions. §11.1 already has a better admission rule. |

The document also already states “nothing simulated counts as real” in §11.4. The problem is that its types and storage rules do not enforce this.

**2. Simulation needs a contract and an evidence boundary.**

Put the simulator contract in **§8.1**, with conformance tests in **§8.8**. Put online lookahead in a new **§7.10**. Extend monitoring in **§7.7**.

Separate three functions:

- **Simulator:** given state and an action, compute possible next states.
- **Evaluator:** score a state against declared goals and constraints.
- **Search algorithm:** choose which states and actions to evaluate next.

A chess engine may provide all three. A calendar conflict checker may only test feasibility. Do not require every domain to implement a general world model.

A minimal contract could be:

```typescript
type SimulatorSpec = {
    id: string
    version: string
    stateSchema: JsonSchema
    actionSchema: JsonSchema
    resultSchema: JsonSchema
    fidelity: 'exact_under_rules' | 'approximate'
    applicability: Predicate[]
    execution: 'isolated_local' | 'external_service'
}

type SimulationRun = {
    id: string
    simulator: { id: string; version: string }
    basis: SnapshotRef             // immutable, versioned inputs
    assumptions: Assumption[]
    actions: SimAction[]          // data; never executable runner intents
    horizon: number
    seed?: number
    limits: { wallMs: number; cpuMs: number; nodes: number; money: Money }
    status: 'complete' | 'truncated' | 'unsupported' | 'failed'
    trajectories: HypotheticalTrajectory[]
    diagnostics: {
        constraintsViolated: string[]
        unknowns: string[]
        exploredNodes: number
    }
}
```

Each trajectory needs predicted states, duration, costs and constraint results. Distinguish exact results, sampled distributions and heuristic scores. A chess evaluation score is not automatically a calibrated win probability.

The important rules are:

1. **A simulator operates on an explicit snapshot.** It cannot silently read changing live state during a rollout. State versions, simulator version, assumptions and random seed make the result reproducible where possible.

2. **Its execution is isolated.** A local simulator gets no live operation handles or credentials. It cannot send the simulated message, reserve the simulated meeting or acquire a real lease. An external simulation service still requires disclosure checks and a spending budget.

3. **`read` does not mean pure.** Reads can depend on time, remote state or randomness. A `pure` flag alone proves nothing. Enforce isolation and test it.

4. **Hypothetical results have a separate type and namespace.** Add an explicit distinction to stored results:

   ```typescript
   type ResultDomain =
       | { kind: 'live' }
       | { kind: 'sandbox'; instance: string }
       | { kind: 'hypothetical'; run: string; branch: string }
   ```

   This is separate from integrity and access labels. A perfectly clean result can still be hypothetical.

5. **No simulated consequence enters the live evidence pipeline.** It cannot satisfy an obligation, settle a `ChangeEvent`, increase live procedure reliability or update a person’s `knows` field. Repeated rollouts are not independent confirmations. Sleep must preserve this boundary too.

6. **Running a simulation is itself a real computation.** Monitor whether it ran, respected its budget and produced a valid result. That does not make its imagined effects real. A trace may truthfully record “Nia simulated forwarding the invoice”; it must not record “Nia forwarded the invoice.”

7. **Only execution arms live action expectations.** A selected prediction may supply an `expected` outcome after the real action is dispatched. Store the prediction’s simulator, version, horizon and assumptions with it. Unchosen branches create no live deadlines or nudges.

There is a related conflict in **§7.5**. Its certainty rule says shared or outward actions may depend only on confirmed items. Predictions are never confirmed in advance. Distinguish **observed preconditions and authority**, which must meet the existing rule, from **predicted consequences**, which may inform choice under uncertainty. A prediction must never substitute for a required precondition or be stated as an observed fact.

For Nia, “the calendar snapshot contains no overlap” is a checkable result. “Acme will agree tomorrow” is an uncertain forecast. They should not share one confidence number.

**3. Planning should be a resumable activity with an explicit artifact.**

Use an ordinary task or zoom for planning. A zoom is appropriate when the planning question needs its parent’s context. It is not mandatory.

The current requirement that every zoom narrow a `place` is awkward here. Planning an office move crosses mail, calendar and documents. Add a planning scope of relevant entities and places; do not force that into one spatial subtree.

Extend **§7.1 and §7.5** with a durable plan:

```typescript
type Plan = {
    id: string
    revision: number
    task: TaskRef
    status: 'draft' | 'ready' | 'executing' | 'stale' | 'done' | 'abandoned'
    goal: CompletionPredicate
    constraints: ConstraintRef[]
    basis: SnapshotRef
    nodes: {
        id: string
        step: Step
        dependsOn: string[]
        preconditions: Predicate[]
        done: CompletionPredicate
        estimates: { activeMs: number; waitMs: number; money: Money }
    }[]
    assumptions: Assumption[]
    openQuestions: string[]
    alternatives: CandidateRef[]
    selected?: CandidateRef
    checks: CheckResult[]
}
```

The lifecycle should be:

- Deliberation proposes or revises a plan.
- Code checks schemas, bindings, dependency cycles, declared constraints and supported feasibility conditions.
- Missing evidence becomes a recall or read request.
- Alternatives can be tested through simulation.
- The plan becomes `ready` when its declared checks pass and unresolved assumptions are acceptable for the next step.
- The runner executes only the next eligible step, with current permissions, evidence and preconditions.
- A mismatch or relevant change invalidates affected plan nodes and triggers revision.

`ready` means “usable as a plan.” It grants no permission and does not complete the parent task. Human approval is required only where existing policy requires it.

Execute a short prefix, observe, then reconsider. Do not commit blindly to a long rollout. Acquire real leases when executing, not while imagining a resource being available.

Planning also exposes an existing scheduling defect: **§7.1 excludes waiting from estimates, while §7.2 subtracts that estimate from a deadline.** A ten-minute task requiring a two-day supplier reply can appear comfortably on time. Keep active effort separate from elapsed completion time. Deadline slack should account for dependencies and expected waits.

“Thinking out loud” should mean explicit questions, alternatives, assumptions, results and brief decision notes. It should not mean a growing transcript of unconstrained reasoning. The structured artifact is what lets another tick resume reliably.

**4. Option search and memory search need different interfaces.**

Extend the existing fixed `deliberate` prompt. No extra prompt is required.

Use a discriminated request rather than adding more loosely related optional fields:

```typescript
type CognitiveRequest =
    | {
        kind: 'recall'
        query: {
            text?: string
            entities?: EntityRef[]
            places?: PlaceRef[]
            time?: TimeRange
            kinds?: MemoryKind[]
            relation?: 'support' | 'contradict' | 'precedent'
        }
        cursor?: string
        limit: number
    }
    | { kind: 'simulate'; candidate: CandidateRef; simulator: string }
    | { kind: 'search'; problem: SearchProblemRef; resume?: SearchRunRef }
```

Add **directed recall to §4.6**:

- The model states the information need. Code performs lookup, filtering, ranking and pagination.
- Explicit queries can retrieve cold items below the ordinary activation threshold. Otherwise the same familiar seven items can permanently hide the answer.
- Results carry original evidence references, versions, coverage and truncation status.
- “No result” means no match within the searched coverage. It does not mean the event never happened.
- Existing conflict discovery remains mandatory.
- Duplicate queries and repeated hits are recorded. Repeated planning searches should not manufacture unlimited activation gains.

An appropriate query is: “Acme disputes, before this invoice, including failed responses and corrections.” It should return failures and unresolved cases, not just successful precedents.

Add **option search to §7.10**:

- Persist candidates, the search frontier, evaluated branches, rejection reasons and the current best feasible candidate.
- Deduplicate states only when their relevant state, assumptions and model versions match.
- Let code enumerate legal options when the domain permits it. In chess, the model need not nominate every move.
- Use established domain algorithms when available. Do not prescribe one universal search algorithm.
- Let the LLM propose open-ended alternatives and interpret results where goals or consequences require language.
- Keep durable alternatives separate from executable action candidates. §7.3 can still recompute the next action each tick without deleting all previous search work.

Search needs a stopping rule: exhausted frontier, sufficient solution under declared criteria, no measured benefit from further work, cancellation, stale inputs or budget exhaustion. It must report whether the result is complete or merely the best found so far.

**5. Budget all computation, and choose it by its expected usefulness.**

Replace the six-call doctrine in **§7.5**, while retaining six as a possible measured default.

Use one inherited task budget covering model spend, tool spend, CPU, elapsed time and node expansions. Zooms and splits share it. Simulator calls consume no deliberation count unless they actually call a model, but they are never free.

Reserve enough time and money to execute and verify the selected action:

```text
available thinking time =
    max(0, deadline − now − estimated execution and verification time)
```

Bound that further by the wallet and identity limits. Missing deadlines use the identity ceiling. Waiting and dependency uncertainty must enter the completion estimate.

The close-priority rule is not a suitable search trigger. Ask whether further computation could change the decision enough to justify its cost. Start with measurable heuristics:

- interacting steps or constraints;
- costly consequences;
- materially different plausible outcomes;
- a simulator known to be useful for this task kind.

A factual conflict often needs an authoritative read. Simulating both disputed premises does not resolve it.

Urgency reduces computation. It must not lower permission requirements or turn an unresolved precondition into a satisfied one.

**6. The brain basis is useful, but narrower than the proposed claims.**

| Mechanism | Evidence worth citing | Limit on the analogy |
| :--- | :--- | :--- |
| Online simulation and option search | Johnson and Redish observed hippocampal representations sweeping ahead along alternative paths at decision points. Pfeiffer and Foster found sequences biased toward remembered goals before navigation. [Johnson & Redish, 2007](https://doi.org/10.1523/JNEUROSCI.3761-07.2007); [Pfeiffer & Foster, 2013](https://www.nature.com/articles/nature12112). | This supports prospective sequence representation. It does not establish a generic simulator API, an exhaustive search tree, or “only when unsure.” |
| Consequence-based choice | Human model-based choices were associated with neural representations of future paths at decision time. [Doll et al., 2015](https://www.nature.com/articles/nn.3981). | This supports prospective evaluation. It does not prescribe the search algorithm or stopping threshold. |
| Sustained planning | Both autobiographical and visuospatial planning engaged a frontoparietal control network; default-network involvement depended on the planning domain. [Spreng et al., 2010](https://pubmed.ncbi.nlm.nih.gov/20600998/). | Planning is not confined to idle mode. “Default mode = idle” is too narrow. |
| Directed memory retrieval | Left inferior prefrontal activity increased with demands for controlled semantic retrieval, even with selection demands held constant. [Wagner et al., 2001](https://www.sciencedirect.com/science/article/pii/S0896627301003592). | This supports top-down retrieval control. It does not specify SQL filters, ranking weights or a seven-item limit. |

Put these beside the mechanisms and in the experiment table in **§1.1**. Keep efference copy as the analogy for predicting consequences of a dispatched action. It is not enough by itself to justify branching counterfactual search.

**7. Each mechanism needs a separate rejection experiment.**

Use §11.1’s fixed workload, full cost accounting and per-stratum completion gates. Give B0 the same simulators and retrieval capabilities. Otherwise the experiment tests access to better operations, not Abe’s architecture.

| Mechanism | Harness experiment | Reject or restrict it if… |
| :--- | :--- | :--- |
| Simulation | Compare no rollout, one-step prediction and bounded sequence rollout. Include delayed traps, stale snapshots, inaccurate models and unsupported conditions. Test both chess and an office workflow. | It fails to improve timely, correct completion at equal or lower total cost; or benefits disappear under realistic model error. |
| Resumable planning | Compare one-shot plans, existing stepwise revision, and the proposed durable plan. Include interruptions, cancellations, changing deadlines and supplier waits. | It mostly adds planning delay, repeated reconstruction or stale-plan execution without improving outcomes. |
| Directed recall | Plant a rare correction among many routine successes. Include compacted evidence, ambiguous dates, revoked access and absent records. Compare automatic recall with directed queries at equal budget. | It retrieves more material without improving decisions, repeatedly misses the decisive evidence, or increases unsupported answers. |
| Option search | Compare direct choice with bounded search using the same evaluator. Include duplicate branches, a promising wrong branch and deadlines too short for deep search. | Extra search consumes slack without improving decisions, or selects candidates that exploit evaluator errors. |
| Search allocation | Compare always search, never search, the close-priority trigger and a usefulness-based trigger. | The adaptive trigger is no better than a simple fixed allocation after overhead is counted. |

Add hard invariant tests across interruption, restart and sleep:

- Imagined sends never send.
- Simulated success never raises live reliability.
- Hypothetical replies never satisfy live expectations.
- Stale simulation results cannot authorize execution.
- Search cannot reset its budget by opening another frame.
- The agent’s simulator cannot inspect the harness’s hidden future script.

Keep the evaluation world independent enough to expose simulator mistakes. Testing a planner against exactly the model it searches can conceal the main failure mode.

For calibration, score forecasts against later real observations, by simulator version, domain and horizon. Unchosen branches remain unobserved. Do not count them as correct. Deeper search can select the branch where an approximate model is most wrong.

**8. What I would drop or correct.**

- Drop “a task needing more than six thoughts is not the agent’s to finish.” It has no engineering or biological basis.
- Drop “the model never evaluates lines in its head.” Use code where a formal evaluator exists. Open-ended reasoning remains an explicit job of the model.
- Drop “deliberation is the only place the LLM decides anything” as a universal description of decision-making. A deterministic planner can choose a route or legal move under a declared objective. The executive and runner remain responsible for execution.
- Do not make the number **nine** a principle. Fixed, versioned, typed prompts are the principle. These additions happen to fit the existing prompt set.
- Do not infer a useful causal simulator merely from §9.6’s observed operation-effect records. Sparse, confounded observations may support a warning or an estimate while being inadequate for rollout.
- Do not start with a general simulator of people. Exact calendar constraints and budget arithmetic are much easier to validate than predicted supplier reactions.

I would implement **directed recall first**, then **durable plan revisions**, then **one isolated calendar or cost simulator**. Admit option search only where its experiment shows a gain. Chess is a useful test of mechanics; Nia’s office work is the test of relevance.