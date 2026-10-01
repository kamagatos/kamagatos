# Answers to the Codex review of the Abe design

Working document, 2026-09-30. Proposals only: nothing here is written into `abe_design.md` yet. Each numbered part
answers the same-numbered part of [the review](abe_design_review.md). Codex (Astra) and the assistant work on
these until both are satisfied; Kam decides.

Revision 5, after four Codex rounds on the proposals. Accepted by round 4: everything except part 6. Revision 5
changes only part 6: a `ChangeEvent` is accepted only by explicit scoped resolution (an authoritative read, a citing
deliberation, or the owner); the binary calculation is an illustration and orders resolution, it never accepts.

## 1. The brain analogy and its authority

**Accepted by both.** The analogy earns ideas; it does not earn numbers.

- Every brain-derived mechanism in the document gets three lines: the engineering problem, the mechanism, and the
  harness experiment that would reject it. Section 0 states the rule; 1.1's table gains the third column.
- **Working memory size becomes a default, not a constraint.** The default rendering stays about 3,000 to 4,000
  tokens. A deliberation may return `needs: 'widen'` with the ids it wants in full, and the next call runs on a wide
  rendering (up to the identity's `widen` ceiling, default 12,000 tokens) at a stronger tier. Widening costs like a
  care-mode call, so the budget drive bounds it. The harness measures, per task kind, whether split, zoom or widen
  finishes with fewer errors and fewer calls. Comparing three contracts is the first widen case in the scripts.
- **One decision per tick, not one operation.** A procedure step may be a bounded batch of read-class moves (a scan
  path): at most the trait's page size of items, at most ten calls, at most the step's time budget, with a
  cancellation check between calls. Anything that writes stays one per tick.
- **Six deliberations** is an identity default per task kind, calibrated in the harness, not a rule about minds.
- **Global confidence leaves the permission matrix** (part 6).
- The "language organ" claim is rephrased: the architecture decides when the model runs and what it sees. Whether that
  improves the model's judgement is what the ablation ladder (part 11) measures.

## 2. The hidden intelligence in types and "cheap" stages

**A small executable language** for everything a procedure, expectation or guard uses:

```text
Predicate   over percept fields, view items, fact patterns and time ranges:
            equals, matches (regex), in, before/after, exists, count ≥
Binding     a path: trigger.percept.<field> | fact(<subject>, <attribute>, <scope>, <at>).value | role(<name>) | const
            a binding that is missing, ambiguous, conflicting, or out of scope or applicability returns Unknown;
            Unknown never satisfies a predicate or a precondition, and a step that binds Unknown stops the procedure
Transform   deterministic only: copy, template("Invoice {n} from {org}: {amount}"), arithmetic, lookup in a fact
ModelStep   an explicit model call inside a procedure: { prompt: 'perceive' | 'compose' | 'check', schema, budget }
```

- A procedure step is either deterministic (predicate, binding, transform, operation) or a `ModelStep`. Nothing else
  is allowed. "Forward invoices with a one-line summary" compiles to: a structural trigger (sender in known-supplier
  facts, attachment present), a `perceive` step that extracts `{amount, dueDate, bankAccount}` with a schema, a
  template transform for the summary, and the forward operation. The model step is visible, costed and counted.
- **Fast-path share splits in two** on the learning page: model-free runs, and habitual runs with declared model
  steps. The harness metric **deterministic coverage** is the share of steps that ran without a model, per task
  kind. It is a central unknown and it is measured from M3 on.
- **Coverage is learned in shadow mode** (part 7): the compiler proposes the deterministic version of a step the
  slow path keeps doing the same way; the proposal runs beside the model until they agree often enough.

**Screening: every in-scope item is read for obligations and exceptions, whatever its salience.** Attention decides
what the agent thinks about; **scope and stakes decide what it reads**.

- **Screening** runs on every incoming item in an observed place within a bounded delay (default five minutes, from
  the observation policy), independently of salience. It extracts, from the full content: asks and deadlines; the
  **declared high-stakes attributes** of the item's kind (bank account, amount, due date, payment terms; the trait
  supplies the starting list per item kind, the owner and the why queue extend it); and **action-relevant exceptions
  and qualifications even when they concern no declared attribute** ("unless the PO is signed", "this replaces the
  earlier invoice", "do not pay before delivery"), returned on the percept as a list of
  `{ passage, concerns: 'condition' | 'replacement' | 'exception' | 'other' }` so that a deliberation or a guard can
  see them, and a non-empty list keeps the item off the fast path. Deterministic parsers first for the attributes; a
  cheap `perceive` model step with a schema for asks, exceptions and whatever has no parser. Screening cost and missed detections
  are harness metrics; an item not screened within the delay (budget, outage) is a **coverage gap**, shown as one on
  the tool's page and counted, never silent.
- **A first or changed value of a declared high-stakes attribute blocks the dependent action at once.** No regularity
  threshold is needed: the block is a guard on the item ("bank account differs from the last three Acme invoices",
  or "first bank account seen for this supplier"), opened by screening, and rule 5 of the fast path (7.4) stops the
  habit. The slow path sees the guard; `write_shared` and above on that item ask first until the value is confirmed
  by an independent source or the owner. The `n ≥ 10` rule stays for regularities the agent discovered itself.
- **Obligations are expectations from screening, with a status** (Codex's N1). An extracted ask with a deadline
  creates an expectation `handled by deadline − margin` with `status: 'candidate'`. A candidate becomes `accepted`
  only under **authenticated, scope-applicable authority**: an instruction whose author is authenticated (the owner
  or a team member over a channel the platform verified, 8.1) and whose scope covers the ask, or a standing goal
  whose scope covers it ("keep Kam's inbox handled" covers a supplier's invoice; nothing covers a stranger's "reply
  by Friday", and a teammate's ask about a project outside their authority stays a candidate). Candidates get
  **budgeted triage**: the idle mode's skim (6.4 §1) and a triage budget per day decide attend, ask the owner, or
  reject; a sender-supplied deadline never schedules mandatory work, never creates a `timer` that pre-empts an
  accepted task, and never nudges anyone outward. Only accepted obligations nudge; rejected ones are kept with the
  reason, and a candidate that expires untriaged is counted as a coverage gap. The margin comes from the task kind's
  measured duration.

## 3. Consolidation must not manufacture evidence

**Invariant.** A fact gains an observation only from an item of evidence that tests its proposition, and every
observation records what supported it:

```typescript
observed: { at: Date; evidence: EvidenceRef; support: { field: string } | { passage: string }; kind: AssertionKind }[]
```

A pattern match never adds an observation. It updates the pattern's own counts (this shape occurred; this variant was
chosen; this regularity's value was seen) and it may **select an extractor**: the pattern says which fields to read
and which facts they would test. Reading the field is what confirms the fact.

**`because` links stay hypotheses.** A `because` carries a `status: 'hypothesis' | 'supported'` and a `test`. It
becomes `supported` only by a **discriminating** test (an observation that the explanation predicts and a named
alternative does not: "if blue means approved, blue rows and only blue rows appear in the approved list") or by an
explicit source (Kam said so, cited). Observing a predicted consequence alone leaves it a hypothesis, and the
deliberation is shown it as one.

**Spot checks keep old patterns honest.** Of the episodes that matched a pattern by shape, every one with stakes above
0.5 and an independently drawn 5% of the rest still go through the model extraction path. A disagreement between the
pattern's expectation and what extraction found is an anomaly on the pattern and lowers the pattern's own confidence.

**Compaction keeps the evidence chain, one rule** (this replaces the numeric retention rule in part 10):

- A block is a derived representation. It never becomes a fact's source.
- When an episode is compacted, everything an assertion, guard, instruction, procedure or open expectation cites
  survives as a **stub**: the source's identity and version (message id and revision, page id and version), the cited
  passages **with all the context needed to interpret them: the qualifications, conditions and referenced clauses
  wherever they occur in the source**, as found by screening (part 2) and by the extractor that made the
  observation, the actor, the place,
  `at`, and a link to the block. Referenced stubs survive every compaction grain; they are not pruned by age.
- `evidenceLost` marks the case where the evidence really is gone: the source was deleted at the tool, access was
  revoked, or the owner or a retention rule required deletion. The observation keeps its `at` and `support` text
  where allowed, the fact renders as "evidence no longer available", and the certainty rule (7.5) treats it as a
  hypothesis for `write_shared` and above.

**Evidence counts once, observations do not.** Provenance is deduplicated by evidence identity and version: the same
message extracted twice, summarised, matched by a pattern, or quoted by two agents is one item of evidence. The same
sensor read again later is a new observation with a new evidence id; that is how facts move along time (13.3). Shared
provenance is tracked on the evidence, so two agents citing one calendar show as one source. This becomes principle 11
in 1.6.

## 4. "Fact" is five things

One table, five kinds, five update rules.

```typescript
type AssertionKind = 'instruction' | 'observation' | 'report' | 'inference' | 'regularity'
```

| Kind          | Example                                          | Has                                                                       | Moves by                                                                                                    |
| :------------ | :----------------------------------------------- | :------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------- |
| `instruction` | Kam: forward supplier invoices                    | author, authority, scope, applies (from, until), status active/superseded/expired | the author or someone with authority over the scope; never by evidence                              |
| `observation` | the calendar lists 10:00                          | `p`, observations with support                                             | independent observations that test it; `ChangeEvent`                                                       |
| `report`      | Kam said the standup is at 10:00                  | speaker, time, what was said; a retraction appended, never a rewrite       | nothing: it is a record of speech. It is evidence *for* a belief about the world, weighted by the speaker's accuracy |
| `inference`   | this standup is at 09:30 (from the reply thread)  | derivation: the ids it follows from                                        | re-derived when a premise changes (the dependents index, 13.9)                                              |
| `regularity`  | standups usually start at 10:00                   | counts, lives in patterns (4.11)                                           | counting; never a claim about one instance                                                                 |

- An instruction has **no `p`**. It has an author with authority over its scope: the owner over the agent, a team
  admin over team things, a teammate over their own things. **Precedence applies only within overlapping scope and
  applicability**: the newer instruction from the same author supersedes; a higher authority wins; two instructions
  of incomparable authority, or equal authority with no order, **block the affected action** and go to the owner as a
  question. "Pinned, p = 1" disappears from the document.
- **Authority governs instructions, not truth.** The owner's factual statements are reports with a high calibrated
  accuracy (0.95 to start, part 6) and they update beliefs **through the same evidence rule as everyone else's**:
  no automatic acceptance. For most facts of the agent's own world that is enough to flip on one statement; for a
  stable fact it leaves a pending event, and the deliberation shows both ("Paris; Kam says Lyon, change 0.02").
  What 4.7 needs ("a correction at nine holds at ten") is met by the other kind: a correction of the agent's
  behaviour is an **instruction** with a scope, and it governs behaviour at once. When the owner wants a fact held
  regardless of evidence ("treat the capital as Lyon"), that too is an instruction, and it governs what the agent
  does and says, not `p`. 4.7's sentence about owner statements is rewritten this way.
- A report is preserved as what was said. "Kam said X" does not become false when Kam retracts X; the retraction is a
  second report, and the belief about the world is updated from both. A report supports a belief; weighting does not
  turn it into an observation of the world.
- Every assertion has `scope` (which entity, which context: "this contract", "invoices from Acme") and optional
  `applies` (part 5). "Acme pays in 30 days (0.8)" is either a regularity over Acme invoices or an observation of a
  contract's terms with a scope, and the two are different rows.
- `ChangeEvent` gets **competing explanations** (part 6): the world changed, the source or extraction was wrong, a
  different entity or scope. A contradiction is not assumed to be change.

## 5. Time: the agent knows when it learned, not when it happened

- **A transition has uncertain bounds unless evidence fixes them.** 13.3's tables are corrected: `until` is a window
  `(Sept 5, Sept 12]`, the last observation of the old value to the first of the new. "It moved between Sept 5 and
  Sept 12; I learned on Sept 12." The window narrows with observations, or closes to a point when a source states the
  effective time. 4.7's sentence changes to match.
- **Validity between observations is an assumption, and it says how strong it is.** Two observations bound a
  transition only if both are accurate, in the same scope, and a transition happened at all. Between two
  observations of the same value the fact is *assumed* unchanged with strength `e^(−λ · gap)`; a question about a
  time inside the gap renders that strength ("10:00, last seen Aug 10, next Sept 5; probably unchanged in between").
- **Declared applicability is evidence.** The rejection in 11.9 stands for *guessed* freshness deadlines and falls for
  what the world states. An observation may carry `applies: { from?: Date; until?: Date; support }` when the source
  says so: a contract effective Oct 1, access expiring Friday, an instruction "while I am away". It fixes a bound of
  the window, sets `since` for a value not yet current, and expires an instruction on its own. It is an observed
  field, with support, not a system guess.
- **Prior knowledge has no verification date.** A prior claim carries `verifiedAt: null` and, as metadata, the model
  id and its cutoff. It is not an observation and it is not dated. Its **correctness is calibrated** per claim kind
  and model version from the harness and from live use (how often a prior claim of that kind, later observed, was
  right), and **verification is required by stakes and by temporal sensitivity**: the action class and the attribute's
  change rate say whether a read must come first. 4.12's formula and its "dated at the cutoff" sentence go; the
  table's last column reads "none".

## 6. Confidence numbers that mean what they say

**Four outcome levels**, recorded separately on every run:

| Level         | What was observed                                                 | Known when                                                 |
| :------------ | :---------------------------------------------------------------- | :--------------------------------------------------------- |
| `accepted`    | the tool took the operation                                        | immediately                                                |
| `effect`      | the intended state appeared in the next view                       | the completion signal (8.1)                                |
| `objective`   | the task's completion predicate held                               | task end                                                   |
| `appropriate` | `confirmed` by a review (the owner acknowledged a do-and-report item, an independent check passed), `corrected`, or `unknown` | when the review happens; `unknown` otherwise |

Silence is `unknown`, not success. A correction that arrives later revises the original run's result, and the
statistics with it. Procedure statistics are per level; promotion (part 7) reads `effect`, `objective` and
`appropriate`, and a run that was accepted teaches nothing about whether a summary was appropriate. The rule in 10.2
("outward stays ask-first until the owner has approved ten outward actions") is this level's first use.

**Reliability is a lower bound, conditional.** For a procedure version, in a context slot signature, at an outcome
level: `Beta(successes + 1, failures + 1)` and the number the matrix reads is its **lower credible bound** (the 10th
percentile), compared unrounded, not the mean. Three clean runs give 0.562; ten give 0.811; twenty give 0.896;
twenty-one give 0.901. The fast-path bar becomes per class: `read` and `write_private` at 0.6, `write_shared` at 0.8,
`outward` at 0.9, `irreversible` and `physical` never. Three runs make a **candidate**; they no longer make a habit.
**An unfamiliar context stays in shadow** (part 7) or asks; pooled statistics and trait priors are shown as advice and
never qualify a context automatically.

**Global confidence is removed from the matrix.** The columns read the calibrated reliability of the thing about to
act. Recent mismatches produce a **caution** state per class that can only raise bars (shift columns right) and decays
over a day. The `confidence` drive row in 6.1 becomes `caution`. The model's own `confidence` field stays as an input to
calibration and to care mode; it never selects a column.

**The `ChangeEvent` update: explicit scoped resolution first, then one binary posterior.** The multi-hypothesis
table from revision 2 is withdrawn; it was not a probability model. A contradicting observation `E` (value `v'` where
`v` was current, from a source with calibrated accuracy `a`) is handled in two steps, both in code:

1. **Resolve scope before opening an event.** Two of the competing explanations are decided by lookup, not by
   probability. *Different entity:* recognition is re-run on the observation; if its best candidate is not the
   fact's subject, the observation is filed against that candidate and no event opens on this fact. *Different scope
   or period:* if the observation carries a scope or applicability qualifier (a project, a contract, "from Oct 1",
   an exception clause found by screening, part 2), it becomes a scoped observation beside the general one, and no
   event opens on the general fact. Only an observation of the same subject, in the same scope, opens or advances a
   `ChangeEvent`.
2. **Acceptance is explicit scoped conflict resolution, never a formula.** The binary calculations below are
   **illustrations assuming a correct baseline and exactly two possible states**. General `ChangeEvent` acceptance
   uses explicit scoped conflict resolution unless an exhaustive model with likelihoods for every possible
   observation, including the possibility that the baseline was already wrong, is supplied; none is supplied here,
   and the first implementation does not attempt one. A `ChangeEvent` is therefore **accepted only by one of three
   acts**, recorded as its `resolvedBy`:
   - a **read of the authoritative place** for the attribute (the calendar for the standup, the contract for the
     terms, the score page for the score), made by the agent itself; its observation replaces both the baseline and
     the contradiction, so "the baseline was already wrong" is answered by looking, not by weighing;
   - a **deliberation** that names which scoped observations it accepts and why, citing them, within the certainty
     rule (an outward action may not rest on it until the read above has happened);
   - the **owner**, through the why queue or a direct statement, as an instruction with a scope (part 4).

   Until then the event is `pending`, lives as a `Conflict` on the tasks it touches (part 10), renders beside the
   fact, and makes the fact a hypothesis for `write_shared` and above (7.5, 8.3).

3. **`p` orders resolution; it does not decide it.** The event still carries a number, and its job is to say **how
   urgently to resolve**: which authoritative place to read first, whether the fact should be marked stale in a
   rendering now, and whether the why queue should carry it tonight. It is computed by the binary model below, and it
   is never compared with a flip threshold. `θ_flip` goes; `stakes` stays, as the weight on resolution urgency
   (`urgency = p · (0.5 + 0.5 · stakes)`).

```text
prior          P(H) = 1 − e^(−λ · Δt)         λ the attribute's change rate, Δt since the last confirming observation
likelihoods    P(sees v' | H) = a        P(sees v' | ¬H) = 1 − a       an observation of the new value
               P(sees v  | H) = 1 − a    P(sees v  | ¬H) = a           an observation of the old value, after the window opened
update         posterior odds = prior odds · Π over independent items of evidence of the likelihood ratio
               ratio = a / (1 − a) for v',  (1 − a) / a for v;   one item of evidence counts once (part 3)
accuracy a     owner 0.95, teammate 0.9, known contact 0.75, stranger or a single read 0.6; all calibrated (part 5)
```

   Illustrations, under the two assumptions stated above: prior 0.99 (live score, one read at 0.6) gives 0.993;
   prior 0.2 (standup, a teammate's calendar entry at 0.9) gives 0.692, and a second independent entry 0.953; prior
   0.001 (a capital, a newsletter at 0.6) gives 0.0015, and a second newsletter 0.0022. In use: the live score was
   *already* an authoritative read by the agent, so it is accepted by act one the moment it is observed, and the
   number only confirms there is nothing to wait for; the standup at 0.692 goes to the top of the glance queue for
   the calendar, whose read settles it; the capital at 0.0015 is rendered as "a change is reported" and waits for
   idle mode's curiosity or the owner. Scoped observations plus explicit resolution replace the old
   `trust · (1 − e^(−λΔt))` formula and the flip threshold from 13.9.

## 7. Compiling procedures is the research; give it the stages it needs

The cited ids of every deliberation are **candidate** dependencies, not a causal trace; the compiler treats them as
proposals and starts narrow.

**Promotion ladder**, with the rung stored on the procedure:

1. **Proposal.** Three episodes with the same slot signature and the same variant, as before.
2. **Start narrow.** The procedure's preconditions are the intersection of the runs' cited facts and percept fields
   (as candidates) **plus every slot value and every high-stakes attribute value that did not vary across the runs**,
   kept as restrictions ("supplier Acme, amount under €2,000, project office-move"). A restriction is generalised only
   when a contrast test justifies it. A procedure with no cited condition beyond its trigger is flagged "no reason
   known" and stops here.
3. **Contrast.** The pattern keeps the losing variants and the episodes where the shape occurred and nothing was
   done. Each candidate precondition must separate the taken cases from at least one contrast case. Where no
   historical contrast exists, **negative cases are constructed**: the owner, or a cheap model call on the procedure
   page, proposes "what would make this action wrong" (an unknown bank account, an amount over the budget, a
   duplicate), and the cases run in the tool's sandbox or in shadow. A restriction with no contrast stays a
   restriction; it constrains deployment, it is not only displayed.
4. **Shadow.** The procedure computes its action on every match; the slow path still decides. Agreements are recorded
   as **agreement**, a separate count, not as `effect`; the actual outcome of the slow path's action is what feeds
   reliability. Shadow model steps cost and are counted. A disagreement is a new contrast case and reopens step 2.
5. **Bounded deployment.** Live on the fast path only for classes whose reliability bound (part 6) it meets, with a
   deployment policy that is the **stricter** of the matrix and the rung: an existing "ask first" is never relaxed to
   "do and report" by promotion.
6. **Full.** The matrix as written.

Every rung is a row the owner can see. **Manual promotion changes deployment authorisation only**: it does not add
evidence, and the runner's checks are unchanged.

**Convergence is a decision made with the alternative in view.** A variant has converged when the slow path chose it
in at least `k` of the last runs while the pattern's advice showed the other variants. Silence of the other variants
is no longer evidence.

**Roles carry invariants, and rebinding requires new evidence.** A procedure lists the trait invariants it relies on
(`send yields a visible message`, `edits carry an author`). Rebinding a role, or a trait version that changes a listed
invariant, puts every procedure that names it back on the shadow rung, from which it leaves by the shadow rung's own
exit criteria (reliability bounds on real outcomes in the new instance), not by a count of agreements.

## 8. Security: what the runner can really enforce

The prompt is hygiene; the runner is the defence; labels make the runner able to see derivations.

**Labels on every item**, four fields kept apart:

```typescript
type Label = {
  actor: PrincipalRef | null        // the authenticated principal who said it, over an authenticated channel; null for tool content
  provenance: ItemRef[]             // what it was made from, transitively; empty for a raw stimulus
  integrity: 'clean' | 'tainted'    // tainted if any untrusted content is anywhere in its provenance
  access: PrincipalSet              // who may see it: the intersection over provenance, re-read at use (below)
}
```

- **Every model output is labelled from every input the call was given**: the whole rendering, scratch, recalled
  procedures, primed items. The runner cannot recover which inputs the model really used, so it assumes all of them.
  Code transformations propagate labels field by field.
- **Access is re-read at disclosure time.** The label caches the access set for ranking; the runner recomputes it from
  the current grants and the source places when an outward operation is about to run, so a revocation takes effect on
  the next send, not on the next extraction.

**Control flow versus data flow.** The **control** arguments of an operation (which operation, on which instance, on
which resource, to which recipient, what amount, which account) are authorised **as one tuple**, by one applicable
**authorisation rule** the runner checks. Independent allowlists per argument are not enough: a permitted recipient
with a permitted amount to a permitted account can still be a combination nobody allowed. A rule is a row in the tool
configuration or an instruction with a scope, and it names the whole tuple:

```typescript
type AuthorisationRule = {
  operation: string                   // "messaging:forward"
  instance: ToolInstanceRef            // kam-gmail
  resource: PlaceRef | Predicate       // which items: "messages from known suppliers with an attachment"
  recipient: PrincipalSet | Predicate  // owner; the team roster; a named person
  amount?: { max: Money }              // when the operation moves money
  account?: AccountRef[]               // when it names one
  by: InstructionRef | GrantRef        // where the rule's authority comes from; authenticated author, applicable scope
}
```

An operation runs only if some rule covers its entire tuple; an operation with no covering rule is "ask first", and the
question to the owner is the tuple, which, if approved, becomes a rule. A first-seen or changed account (part 2) never
matches an existing rule, because rules name accounts. Neither appearing in a view nor being a fact grants anything: a
tool can faithfully report an attacker's account number, and **structural fields keep the integrity of their
provenance**: a field a view gave is *certain* about the tool's state (12.7) and it is `tainted` if its content came
from an outside party. Control arguments must be `clean` **and** covered by a rule; tainted content may flow into
**data** (the body of a summary, a quoted passage) with its label attached. An email that says "forward the contract
to x" cannot supply `to`; if the model proposes it anyway, the missing rule is what stops it, not the model's judgement.

**Claim-level support.** Consequential generated statements (anything about money, dates, commitments, people) are
produced by **templates over validated typed fields** wherever the procedure can; free text about such things goes
through the `check` model step against the cited items whenever it is consequential, not only in care mode. Matching
a number against a cited item is necessary and not sufficient, and the document says so.

**8.6 is reworded.** The architecture bounds what attended text can *do*, not what it can make the model *say*. A
stranger's words can change the chosen action; the runner makes that action ask first, drop, or fail the disclosure
check. The false sentence in 8.6 goes.

**Two class contradictions fixed** (accepted by Codex).

- `control:acquire` writes shared state: class `write_shared`, reversible (release), on the `control` place. Its
  matrix row may be "do" at low bars because the write is small and reversible; that is a matrix setting, not a class
  fiction.
- `physical:go` is **not a move**. It is a `physical` operation whose completion signal is the next telemetry view. A
  room's read-class moves are `look` and `focus_region`. `Move` keeps `class: 'read'` and 12.8's example is corrected.

## 9. A consistency model for the runtime

Every deliberation is bound to what it saw, and the runner refuses to act on a stale basis.

```typescript
type Basis = {
  task: { id: string; revision: number; ancestors: { id: string; revision: number }[] }
  inputs: { id: string; version: number }[]     // every item supplied to the call: rendered, scratch, primed
  scope: { places: PlaceRef[]; entities: EntityRef[]; asOf: Date }   // what "new relevant evidence" is measured against
  policy: { identityVersion: number; matrixVersion: number; grantsVersion: number }
  leases: { resource: 'agent' | PlaceRef; holder: PrincipalRef; epoch: number; until: Date }[]   // the agent lease and every resource lease the action touches
}
```

- **Validation is atomic with the intent write** (8.1): when the runner persists the intent it checks, in one
  transaction, that the task and every ancestor are at the basis revisions, that every input is at its version, that
  no stimulus at the basis's places or entities arrived after `asOf` (a query on the stimulus store, so relevance does
  not depend on winning attention), that policy and grants are unchanged, and that **every lease in the basis is
  still held**: for the agent lease and for each resource lease the action touches, the holder is this agent, the
  epoch is the row's current epoch, and `until` is later than the commit time plus the operation's expected
  duration. A current epoch alone is not enough; an expired lease with an unmoved epoch fails the check too. Any
  failure returns the result to the executive as a `Conflict` (3.7) with the stale ids, and the deliberation runs again
  on the current rendering with the old draft in scratch.
- **Cancellation cascades by revision.** Cancelling or re-planning a task bumps its revision; every descendant frame,
  split and model call names its ancestors' revisions in its basis, so their results are discarded on arrival. The
  trace records the discard.
- **Destination preconditions where the tool has them.** A `document` write carries the page version it was drafted
  against; `messaging:reply` the thread's last message id. Where the tool offers none, the remaining race is stated
  in the manual and the tool page shows it.
- **Outcome unknown is a state.** A run whose completion signal never arrived is `unknown`, reconciled at the next
  tick by asking the tool. **A non-idempotent operation in `unknown` is never retried because a read found no
  effect**; it stays `unknown` until the tool's own record settles it or the owner does. `unknown` counts as neither
  success nor failure in the statistics.

**The agent loop in eldon3.** Exclusivity of the loop is a **per-agent lease with a fencing epoch**: an `AgentState`
row with `holder`, `epoch`, `leaseUntil`, acquired by compare-and-set at the start of `tick_agent`, renewed by
heartbeat, incremented on every acquisition. Every store write and every intent carries the epoch and is refused
when the row's epoch has moved.

**Shared resources need their own token.** A per-agent epoch fences one agent's successive runs, not two agents on one
thing. The `control` place (8.9) holds a **resource epoch** that increments on every acquisition; the runner passes it
with each operation on the shared instance, and a tool that supports fencing refuses a stale one.

**Where the destination cannot fence.** The guarantee is stated, and it is weaker: while an earlier intent on the
resource is `unknown` or in flight, **conflicting writes from any holder are blocked**; when the owner accepts
best-effort coordination for an instance (a robot whose controller cannot fence), overlapping effects are possible and
the tool page says so. `cost.time` is a latency category and is not used as a bound.

**Lease scope is a place, not an instance.** A `control` place may sit at any node of the map. `physical` traits
lease the instance; `document` traits lease the page by default; `messaging` needs no lease (two agents in one mailbox
conflict only on a draft, which is a place).

## 10. Memory policy: keep what will matter, not what was familiar

Five operations, five rules.

| Operation                | Decided by                                                                                                                   |
| :----------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| working-memory eviction  | activation, as now; an unresolved conflict that touches the task is stored **on the task**, not in a slot, so eviction cannot lose it |
| retrieval ranking        | activation plus cues; **conflicts are found before ranking** (below)                                                          |
| summarisation            | age and grain (13.5); referenced stubs survive (part 3)                                                                       |
| archival                 | activation below threshold **and** no live reference                                                                          |
| deletion                 | archival plus ninety days, and past `retainUntil`                                                                             |

**Conflicts are discovered by proposition, not by popularity.** Before ranking, recall looks up every assertion with
the same subject, attribute and overlapping scope and applicability as each attended percept and each item about to
be recalled, regardless of activation, and any disagreement is a `Conflict`. A conflict that is relevant to an action
lives on the task until resolved; it survives eviction and re-renders on every deliberation of that task.

**Retention is explicit references and a date, not a score.** An item is **live** while an assertion, guard,
instruction, procedure, open expectation or accepted obligation cites it, or while it is a correction whose procedure
exists. `retainUntil` is set at appraisal from stakes (stakes above 0.7: two years; above 0.3: one year; else the
identity's default) and by the owner ("remember this" pins). Deletion needs both: no live reference, and
`retainUntil` past.

**Guards narrow by scope with a threshold; they close by absorption.** A guard has a scope ("Acme invoices"), a `test`
(the observation that bears on it: "an Acme invoice whose amount matches the PO"), and a threshold (default: five
passing observations with no failing one). Passing tests narrow the scope to what still failed, never to nothing; a
guard **closes** only when its check is compiled into the procedure (9.3) or the owner says so. The curiosity queue
(6.4 §3) includes open guard tests so the evidence is sought rather than waited for; a guard with no test after a month
is a why-queue question.

**Conversation history is a place with recent episodes.** The absolute prohibition goes. A conversation is a place;
its turns are episodes. When a task originates from a conversation, recall's pass 1 cues on that place and time and the
last turns render **verbatim** up to a `conversation` slot budget (default 800 tokens), most recent first. When a
referent is not in the slot, the deliberation returns `needs: 'read_history'` with what it is looking for ("the
wording I proposed earlier for the invoice mail"), and a read-class move fetches the matching turns as a focused read;
**an unresolved reference is never guessed**. This is recall by place, not transcript replay: bounded, cued, in the
trace. M1 keeps transcript replay behind a flag and runs both; replay is removed when the recall-built reply passes the
harness's conversation scripts, not before.

**Trace and rationale are named apart** (accepted by Codex). The trace is the record of what was received, selected,
checked and executed. The deliberation's `understanding` is a **reported rationale**, stored with it, and the why page
labels the two differently.

## 11. Evaluation that cannot be gamed by doing less

**A fixed offered workload, fully accounted.** Every scripted week offers a fixed set of tasks and obligations
(including requests with no explicit deadline, which get a default due time by kind). The report counts every one of
them as completed correctly, completed late, completed wrongly, asked about, or unresolved. Efficiency (cost per
correct, authorised, timely completion, with human time in the cost) is reported **only alongside** completion and
timeliness rates, per task stratum (routine, exception, ambiguous, adversarial). **An efficiency gain counts only if,
in every stratum, both the completion rate and the timeliness rate are at least what they were**; a configuration
that finishes routine work faster while the exception stratum slips is a regression, whatever the cost per completion
says. Beside those: unsupported claims, forbidden actions, unauthorised disclosures.

**The judge is deterministic first.** Completion and authorisation are judged from simulator state and the runner's
own checks against the script's ground truth. Semantic judgements (is the summary supported, was the answer right)
use a separate model whose verdicts are **audited against human-labelled cases** every release; the agent's own checks
are inputs, never the verdict.

**Three sets of scripts.** Development weeks, used to build and tune; validation weeks, used to promote procedures and
choose defaults; **held-out weeks**, never used for either, on which the frozen agent is evaluated. A case that was
used to revise or promote anything is no longer held out. Held-out weeks contain shapes not seen in development,
delayed consequences (a correction three days after the action), ambiguous evidence, exceptions in familiar wording,
a correction arriving mid-deliberation, and a send whose response is lost.

**The ablation ladder.** B0 is the baseline: durable tasks, retrieval over the same stores, a capable model, and the
enforced runner. Each mechanism is added one at a time (procedures, learned attention, forgetting, consolidation,
drives, patterns) and must improve completion and timeliness at equal or lower cost **on the validation weeks**; that
is where defaults are chosen and mechanisms admitted to the default identity. The chosen configuration is then frozen
and run once on the held-out weeks, whose result is reported and never used to choose again. A mechanism that does not
earn its place on validation stays an experiment. Record and replay stays for regression only.

## Concrete contradictions

| Mechanism         | Fix                                                                                                                                                                                                                                              |
| :---------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Glance-rate decay | Decay by elapsed time, not per sleep: `α ← α · 2^(−Δdays / 42)`, same for `β` (a daily factor of 0.9836); opportunistic sleeps then change nothing. Accepted by Codex                                                                            |
| Glance arithmetic | 2.9's numbers are recomputed from its own formula: the sent folder (λ 0.1, value ε, cost 0.02) glances every 5.1 hours, not two; the page read once last month (λ 0.05) every 10.2 hours, not daily. And when `cost ≥ value` the formula gives no finite interval: the place is glanced on the coverage floor only (once a day), stated as such |
| Slack             | Urgency becomes a continuous function of slack, not buckets: `urgency = clamp(1 − slack / 24 h, 0.3, 1.0)`, so 60 minutes of slack (0.96) outranks 110 (0.92), and the example reads "four hours of work due in five hours is more urgent than ten minutes due in two hours" |
| Proximity         | Saturating: `proximity = 1 − e^(−S / 5)` with `S` the weighted sum as written. For recent two-way exchanges with quality 1: five reach 0.63, twenty 0.98; neutral ones (quality 0.5): 0.39 and 0.86. Teammates start at 0.5 as a floor. Accepted by Codex |
| Time hierarchy    | `day ⊂ month ⊂ year` and `day ⊂ ISO week ⊂ week-year` as two chains over days; **seasons are separately indexed ranges** (they cross calendar years). Blocks are keyed by `(grain, range)`; month blocks are built from day blocks, never from week blocks |
| Navigation 300 ms | One *decision* per tick; a procedure step may batch read-class moves within the limits in part 1 (ten calls, the step's time budget, a cancellation check between calls). The 300 ms in 12.10 is labelled an illustrative simulated-tool measurement; real tools take their own latency |

## Implementation sequence

The review's five steps are adopted and the milestones renumbered:

| Milestone | Content                                                                                                                                                                                                                                            | Exit                                                                                                                                                                           |
| :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M0        | Harness: simulated tools with traits, the deterministic judge, the fixed-workload report, the three script sets. **No agent yet**: B0 is built on M1's runtime, not on a second one                                                                 | a scripted week runs against a null agent and the report prints every unresolved obligation                                                                                    |
| M1        | The operation runtime and B0 on it: durable tasks, intents persisted, `Basis` validation atomic with the intent, cancellation cascading by revision, `unknown` outcomes with the no-retry rule, the agent lease with epochs, resource epochs on control places. **B0's outward and shared writes stay disabled** (the runner refuses them) until M2 lands labels and disclosure enforcement; in M1 B0 reads, drafts privately and asks | stale-input rejection, lease takeover with a delayed write, cancellation of an in-flight call, and the lost-response send all behave as specified in the harness; B0 completes the routine stratum up to the point of sending |
| M2        | Memory with assertion kinds, support on observations, labels with access re-read at disclosure, stubs under compaction, conflict discovery by proposition, the conversation slot and `read_history`; chat replies from recall beside replay          | the conversation scripts pass with replay off; no disclosure test leaks                                                                                                        |
| M3        | One complete workflow (the invoice) on authored procedures: the executable language, screening with declared high-stakes attributes, obligations with status, the control-argument authorisation rule, templates over typed fields, model-assisted exceptions | **the decisive test** below passes on validation weeks against B0 at lower total cost, and holds on held-out weeks                                                              |
| M4        | Learned procedures: minimal episode grouping by slot signature and per-level procedure statistics (the part of patterns M4 needs, stated as a dependency), the promotion ladder with constructed negative cases, shadow, conditional reliability bounds | a shadow procedure qualifies for bounded deployment on validation weeks; the frozen, already-qualified procedure is then evaluated once on held-out weeks and the report shows its reliability there and zero forbidden actions |
| M5+       | Attention weights, consolidation, drives, the full pattern store, dreams, each as a measured rung on the ablation ladder                                                                                                                             | each qualifies for the default identity on validation weeks; held-out weeks evaluate and report the frozen, already-selected configuration without determining admission |

**The decisive test (M3 exit).** One scripted week with an ordinary invoice, a changed bank account in familiar
wording, a duplicate, an exception buried in paragraph four, a correction arriving during deliberation, and a send
that succeeds while its response is lost. Measured: correct handling, omissions, owner interventions, and total cost,
against B0. Qualification happens on validation weeks: the procedure is tuned and promoted there, and deployment is
decided there from its reliability bound. The frozen, already-qualified procedure is then run once on a held-out week
it never saw, and that result is the report's estimate of how it will do in use; it is not used to tune or promote
anything, and passing it once is a measurement, not a licence.
