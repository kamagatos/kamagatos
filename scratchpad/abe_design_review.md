# Review of the Abe design

Review by Codex, 2026-09-30, of [abe_design.md](abe_design.md), informed by the full design, the
[brainstorm](abe_brainstorm.md), and the relevant scheduler and agent code.

My assessment: **there is a valuable core here, but I would substantially revise the design before implementing it as written.** The strongest parts are durable tasks, explicit memory, observed outcomes, persistent guards, and execution checks outside the model. The weakest parts are the assumptions about how evidence becomes knowledge and how repeated behavior becomes trustworthy.

My biggest concern is that Abe could become increasingly confident, consistent, and inexpensive while becoming less responsive to contradictory evidence. Several mechanisms reinforce one another in that direction, and the proposed metrics might report it as improvement.

These are the issues I would prioritize.

## 1. The brain analogy is generating useful ideas, but it is also granting them too much authority

Different memory systems, selective attention, background consolidation, and reusable procedures are sensible engineering choices. Their biological analogues are useful inspiration.

Other choices need independent justification: a hard 3,000–4,000 token working memory, six deliberations per task, compulsory sleep, one operation per tick, forgetting based on access frequency, and global confidence affecting unrelated actions.

In [§3.4](abe_design.md#34-working-memory), the context limit explicitly becomes a design constraint rather than a tuning value. A task needing more context is declared too big. But decomposition can lose relationships that require simultaneous consideration. Comparing several contracts, reconciling conflicting accounts, or reviewing this design are examples where a larger working set might reduce total calls and errors.

Similarly, separating the model from the runtime does not demonstrate that the model has become merely a language organ. It still supplies interpretation, planning, generalization, composition, and much of the judgment behind learning. The architecture controls when those capabilities run; whether it improves their quality remains an empirical question.

I would give every biological analogy three accompanying statements: the engineering problem, the proposed mechanism, and the experiment that could reject it. If resembling a brain is itself a research objective, that is legitimate—but its constraints should still be distinguished from requirements for a useful assistant.

## 2. The hardest intelligence problems are currently hidden inside types and supposedly cheap stages

`PerceptPattern`, `FactPattern`, `CompletionPredicate`, situation matching, and parameter binding carry an enormous amount of responsibility. Their semantics are less developed than the mechanisms that consume them.

For example, “forward invoices with a one-line summary” requires deciding whether something is an invoice, extracting its amount and conditions, determining what matters, and producing a correct summary. Compiling the surrounding operation sequence does not make those transformations deterministic.

The same problem appears in attention. Peripheral metadata is supposed to determine which content deserves interpretation. Consider a familiar supplier, the usual subject, and an ordinary snippet—but paragraph four changes the payment instructions. That distinction may be unavailable until the expensive read and interpretation have already happened.

Priming and idle review help, but do not establish timely detection. **Preserving an unread message does not preserve the opportunity to respond before its deadline.**

I would start by defining a narrow executable language for predicates, bindings, transformations, and outcomes. A procedure should explicitly declare which parts require a model. Then measure how much real work can actually become deterministic. That coverage is one of the design’s central unknowns.

## 3. The consolidation rule can manufacture evidence for its own explanations

The most concerning sentence is in [§5.2](abe_design.md#52-phases): an episode matching a pattern confirms the facts referenced by the pattern’s `because` links.

Suppose Nia believes that blue rows mean “approved.” She encounters another blue row with the expected structural shape. Its existence supports “blue rows occur here.” It does not independently confirm that blue means approved.

The proposed mechanism risks this cycle:

> An explanation creates a pattern → the pattern interprets new observations → those interpreted observations strengthen the explanation.

Matching episodes also bypass the model extraction path. Consequently, an established pattern could become both easier to confirm and less likely to receive the scrutiny needed to discover that it is wrong.

I would require a stronger invariant: **a belief gains evidence only through an observation that tests its proposition, with the supporting field or passage recorded.** A pattern match can propose an inference or select an extractor. It cannot itself confirm the pattern’s explanation.

Compaction has a related problem. Repointing a fact’s source at a generated summary preserves a reference, but may lose the evidence, qualifications, and source identity that made the fact defensible. Summaries should be derived representations with links to evidence. Where the evidence is deleted, the system should acknowledge the loss of verifiability.

The design already recognizes that agents repeating the same source must not manufacture independent confirmation. That principle needs to govern extraction, summaries, patterns, and prior knowledge throughout the system.

## 4. “Fact” combines several things that need different update rules

[§4.2](abe_design.md#42-semantic-memory-what-is-true) puts observations, beliefs, preferences, instructions, and statistical regularities into a similar representation. Later chapters distinguish some of their provenance, but their behavior remains entangled.

These statements have different meanings:

- “Kam instructs Nia to forward supplier invoices.”
- “Kam believes the standup starts at ten.”
- “The calendar currently lists ten.”
- “Standups usually start at ten.”
- “This particular standup starts at nine-thirty.”

The first establishes a policy within Kam’s authority. The others provide different kinds of evidence about the world. Giving every owner statement `p = 1` and pinning it conflates authority with correctness.

Likewise, “Acme pays in 30 days with probability 0.8” could describe uncertainty about contractual terms, variation across invoices, or uncertainty about which contract applies. A distribution without the relevant context cannot distinguish these cases.

The `ChangeEvent` mechanism then assumes too readily that a contradiction means the world changed. Other possibilities include an earlier extraction error, a different entity, an exception, or two statements referring to different periods.

I would make assertions explicit about proposition, scope, provenance, temporal applicability, and derivation. Instructions should have their own authority and lifecycle. They can coexist in one storage system without sharing one theory of truth.

## 5. The treatment of time creates knowledge the agent does not actually possess

The distinction between `at` and `sensedAt` is good. But [§13.3](abe_design.md#133-facts-move-along-time) then derives validity from successive observations too confidently.

Suppose Nia observes a ten o’clock standup on September 5 and a nine-thirty standup on September 12. That does not establish that the change happened on September 12. She learned of it then. It might have changed on September 8.

§13.9 introduces an uncertainty interval, which helps, but the earlier current-value examples still assert a precise transition. These mechanisms need one consistent interpretation.

I would also reopen the rejection of declared validity for a specific reason: the world sometimes supplies it. A contract can say that new terms apply from October 1; temporary access can expire Friday; an instruction can apply only during someone’s absence. Those are evidence about applicability, distinct from a guessed freshness deadline.

The same distinction undermines treating a model’s training cutoff as an observation date in [§4.12](abe_design.md#412-prior-knowledge-what-the-model-already-knows). The cutoff does not tell you when a particular claim was learned or last verified. Labeling model knowledge is useful; dating it as an observation gives it unsupported precision.

That section acknowledges intrinsic model error. The verification policy needs to incorporate that error alongside freshness. A stable claim can remain wrong indefinitely.

## 6. The confidence numbers are doing more work than their statistical meaning supports

The procedure formula `(successes + 1) / (runs + 2)` gives 0.8 after three successes. Under the simple Beta–Bernoulli interpretation implicit in that formula, the posterior is `Beta(4,1)`.

**There is still about a 41% posterior probability that the underlying success rate is below 80%.** This already assumes comparable, independent trials and correctly measured outcomes. Generalizing from several invoices to future invoices introduces additional uncertainty.

Three repetitions can reasonably identify a candidate procedure. They do not establish broad reliability.

There is a more basic issue: what counts as success? These are different:

> The API accepted the operation.  
> The intended state appeared.  
> The user’s objective was achieved.  
> The action was appropriate.

The design understands some of this through completion signals, but success statistics and global confidence still risk pooling unlike evidence. Successful reads should not increase confidence in interpreting a contractual exception. An undelivered email and a misunderstood instruction should not teach the same lesson.

I would keep reliability conditional on procedure version, operation, relevant context, and outcome type. Model-reported confidence can be an input to calibration; it should not directly carry permission decisions.

The change formula also has a concrete contradiction: with single-read trust at 0.6, `p₀` cannot exceed 0.6, while the minimum acceptance threshold is 0.8. The claimed live-score flip from one observation cannot follow from that formula. More fundamentally, multiplying source trust by a change prior is not a specified posterior update. The likelihood of the observation under competing explanations is missing.

## 7. Procedure compilation is the most promising research component—and deserves much more of the design

The example of replacing a concrete message ID with a binding is reasonable. But learning the argument binding is only part of learning a safe procedure.

The difficult question is which conditions made the demonstrated action appropriate. Three examples rarely reveal that. Perhaps Kam forwarded those invoices because they were already approved, concerned one project, or fell below a spending threshold. Those conditions may never appear among the varying arguments.

“The other variants have gone quiet” is also weak evidence of convergence. A variant can stop being chosen because an earlier preference stopped giving it opportunities.

I would promote learned procedures through proposal, evaluation against contrasting cases, shadow execution, and bounded deployment. At least some tests must change a condition that should prevent the procedure from running.

There is relevant prior work here: [Soar’s procedure learning](https://soar.eecs.umich.edu/soar_manual/04_ProceduralKnowledgeLearning/) explicitly tracks dependencies and constraints involved in producing a result. Its documentation describes how an ordinary working-memory trace lacks enough explanatory information for reliable generalization. That is directly relevant to Abe’s compiler.

Traits and roles make this more demanding. A role can preserve operation names across integrations, but a procedure may also depend on ordering, visibility, delivery behavior, or notification timing. Transfer should carry an explicit list of required invariants and trigger revalidation when those assumptions change.

## 8. The security boundaries are partly real and partly assertions about model behavior

The runner’s ACL checks, separation of grants from installs, and distinction between proximity and authorization are strong choices.

But [§8.6](abe_design.md#86-grounding-rules-in-every-prompt) overclaims when it says the architecture handles injection before the prompt does. A stranger’s actor weight controls attention. It does not prevent attended text from influencing the model’s chosen action or reported confidence.

Similarly, checking that an ID exists establishes citation validity. It does not establish that the cited item supports the claim. All names and amounts in a false sentence can appear somewhere in working memory.

The disclosure rule needs machinery that survives transformations. If a confidential source affects an uncited summary, a compiled procedure, or a recalled fact, what tells the runner that the resulting output still carries that source’s restrictions? Model-selected citations cannot be the sole accounting mechanism.

I would distinguish authenticated instructions, untrusted content, and derived information structurally, and carry access restrictions through derivations. [CaMeL](https://arxiv.org/abs/2503.18813) is relevant because it makes control flow, data flow, and capabilities explicit parts of the defense.

The document also contains operation-class contradictions that cross this boundary: `control:acquire` is called read-like despite changing shared state, and `physical:go` appears as a move even though `Move.class` is fixed to `read`. Those need resolution before any permission matrix can be meaningful.

## 9. The runtime needs a stronger consistency model before the cognitive mechanisms can be trusted

Consider this sequence:

> Nia starts drafting from invoice version A.  
> A correction arrives while the model is running.  
> Working memory updates to version B.  
> The old model call finishes and proposes sending its draft.

The model did not see the updated memory. The design explicitly revalidates parent frames after child completion; it needs an equivalent rule for every asynchronous result before an action is committed.

I would bind a deliberation to a task revision and the versions of the evidence and policy it used. Before execution, validate those dependencies. A cancellation must also invalidate later results from the cancelled work.

There is a concrete integration gap in [§10.3](abe_design.md#103-mapping-onto-eldon3-and-h). The existing [scheduler](../../h/core/scheduler/eldon_scheduler.ts) lease in `runScheduledTick` protects schedule dispatch. The scheduler then enqueues jobs in `tickOnce`. That does not by itself establish exclusive execution of a long-running agent loop across subsequent fires.

Shared-tool leases have another limitation: an expired lease cannot retract a request already in flight. The design needs protection against a former holder’s delayed writes where correctness depends on exclusivity. [Fencing tokens](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html) address this when the destination enforces them; integrations that cannot enforce them need a weaker, explicitly stated guarantee.

I would also reconsider leasing an entire shared tool instance. Exclusive robot control makes sense. Serializing all activity in a team document integration is much broader than most conflicts require.

## 10. The memory policy optimizes familiarity, but familiarity is not the same as future usefulness

The design correctly says recall frequency does not make a fact truer. It still makes the fact more likely to enter the small context window, influence action, and be recalled again.

That creates a feedback loop even without changing `p`. Familiar evidence can crowd out unfamiliar contradictory evidence. Matching patterns can further suppress expensive inspection. A guard can persist because the observations that would narrow it are never sought.

Retention should account for commitments, future deadlines, dependency value, correction history, and the cost of losing the item. A rarely accessed cancellation condition may matter more than a frequently recalled routine success.

I would also separate working-memory eviction, retrieval ranking, summarization, archival, and deletion more firmly. They solve different problems. A small prompt does not require aggressively deleting its evidence.

The absolute prohibition on reading conversation history is particularly costly. “Yes, the second option, but use the previous wording” depends on conversational state. Selected recent turns can be useful evidence alongside structured memory. Removing transcript replay in M1 makes a major behavioral change before much of the replacement machinery exists.

Finally, a trace supports an explanation of what the system received, selected, checked, and executed. The model’s contemporaneous explanation remains a reported rationale. Recording it does not establish that it faithfully identifies every cause of the model’s decision.

## 11. The proposed evaluation can reward the architecture for doing less

Fast-path share, fewer model calls, fewer questions, and fewer corrections can all improve while the agent overlooks difficult work.

Corrections are only visible when someone notices an error. A familiar task distribution can make a poor generalization look excellent. A scripted invoice world can quietly give the agent exactly the structure its compiler expects.

The harness is necessary, but it needs unfamiliar situations, delayed consequences, ambiguous evidence, and independent judgments of completion. Recorded model calls are valuable for regression testing; they cannot establish performance on changed prompts or situations by themselves.

I would make the principal outcome **correct, authorized, timely completion per unit of total cost**, including human review and correction time. Track missed obligations and unsupported claims alongside overt failures.

Then compare a simpler system—durable tasks, retrieval, a capable model, and an enforced runner—with versions adding procedures, learned attention, forgetting, and the other mechanisms. Each addition should demonstrate an incremental benefit.

## Concrete contradictions to correct

A few smaller contradictions also deserve immediate correction:

| Mechanism | Problem |
|---|---|
| [Glance-rate decay](abe_design.md#29-glances) | Multiplying by 0.9 at each daily sleep gives a half-life of about **6.6 days**, not six weeks. Opportunistic sleep changes it further. |
| [Slack example](abe_design.md#72-priority) | Four hours of work due in six hours has 120 minutes of slack; ten minutes due in two hours has 110. The stated ordering is reversed. |
| [Proximity](abe_design.md#65-people-models) | Two recent neutral two-way exchanges approximately saturate the score at 1. |
| [Time hierarchy](abe_design.md#132-the-grain-hierarchy) | Weeks do not nest within months. Calendar grains need overlapping groupings. |
| [Navigation example](abe_design.md#1210-nia-finds-the-invoice) | A multi-operation habit taking 300 ms conflicts with one operation per tick and active ticks five seconds apart. |

These are repairable. Their importance is that the document’s formulas and examples are not yet functioning as a coherent executable specification.

## Implementation sequence I would use

I would change the implementation sequence accordingly:

1. Build a durable task and operation runtime with cancellation, evidence versions, execution checks, and an explicit “outcome unknown” state.
2. Add source-preserving memory with separate treatment of instructions, observations, and inferred beliefs.
3. Run one complete workflow using authored procedures and model-assisted exceptions.
4. Introduce learned procedures in shadow mode, then evaluate them against unfamiliar cases.
5. Add the remaining attention, consolidation, and drive mechanisms only as measured experiments.

For the invoice workflow, the decisive test would include an ordinary invoice, a changed bank account, a duplicate, an exception buried in familiar wording, a correction arriving during deliberation, and a send that succeeds while its response is lost. Measure correct handling, omissions, user intervention, and cost against the simpler baseline.

I would make that experiment the next milestone. It would test the design’s hardest assumptions much more directly than another round of adding mechanisms.
