# Check of agy's rewrite of abe_design.md

2026-10-01. The rewrite (staged in git, 405 KB) was compared against the committed version (857105c, 311 KB)
chapter by chapter, by ten independent readers, each given the original and the rewritten chapter and asked to list
every rule, number, formula, type field, example, cross-reference and qualification that was lost, changed, weakened
or added. Mechanical checks ran first: headings, code fences (90 in both), table rows (244 in both), record ids and
numbers all survive; formulas survive as LaTeX. The 11.9 table keeps its 35 rows and every decision list keeps its
count. What did not survive is below.

## Summary

| Kind     | Findings |
| :------- | -------: |
| LOST     |      305 |
| CHANGED  |      292 |
| ADDED    |      168 |
| WEAKENED |       61 |
| total    |      843 |

About one finding per 60 words of the original. A share are minor (a dropped "minor" qualifier, a renamed example),
but the substantive ones recur in every chapter and follow a few patterns:

1. **Rules dropped or softened.** "never"/"only"/"always" statements become descriptions: "muting changes what wins,
   never what is seen"; "Unknown never satisfies anything"; "duration is measured, never declared"; "It is the only
   process that writes in bulk"; "Nothing in sleep is required to finish tonight"; "not facts about brains".
2. **Named mechanisms renamed, breaking cross-references.** Matrix cells "ask first"/"do and report"/"never" became
   "request confirmation"/"execute and report"/"prohibited"; "live" (retention) became "active"; the primed set became
   an "associative cache"; the `widen` field, the `forgetting` key, `systemInstructions`, the "came to mind" label and
   the task states `blocked`/`suspended` are renamed or merged.
3. **Definitions invented.** The four outcome levels get new definitions (`appropriate` = "adhered to organizational
   norms" instead of confirmed/corrected/unknown; `accepted` = "valid syntax"). Candidate promotion "seen twice"
   became "multiple sessions". "known supplier" became "approved supplier". "a transition is a window" gained
   "verified causal rationale" where the original allows `cause` to be empty.
4. **Hedges turned into certainties, and the reverse.** "can lose relations" → "often breaks down"; "likely winner" →
   "emerges as the preferred candidate"; "the harness measures it, not the other way round" → "calibrated via the
   harness"; "Most of it is in place by construction" → all of it.
5. **New claims the design never made.** "immutable" on labels, stubs, traces, identity and `self` (the design
   versions identity and re-reads access sets); "vector store", "dense vector embeddings" as present; "Hardware
   watchdogs"; "legal ownership"; "ethical boundaries" for values; "sub-second ticks" against the 5 s loop;
   "milliseconds" for completion signals; "zero-tolerance" on counts that only must not rise.
6. **History and provenance removed.** Every "the first draft said…" and "amended in 11.14" note, the brainstorm
   ties, the ninth-round sentence in section 0 with the two file names, "The owner then had the answers written in",
   "until Codex accepted every part", and the "any of them can be reopened" line in 11.9.
7. **Nia became Abe; the register became academic.** Chapters 4 to 6 switch the running example's name; headings and
   prose move to "homeostatic", "neuromodulatory", "collaborator profile models", "epistemic". The word count rose
   from 45,794 to 50,981.

The ten chapter reports follow, unedited.


## Section 0 and chapter 1 (51 findings)

Comparison of old_c01.md (ORIGINAL) against new_c01.md (REWRITE), section by section.

## Preface (title block)
- ADDED (minor): "something we can build" → "an implementable engineering specification". Same intent; flagged only because "specification" overstates what the original claims the document is.

## 0. Read this first — "How it is worked on"
- No meaning changes. ("durable record" → "permanent, authoritative record" is a harmless strengthening.)

## 0. Read this first — "Outside reviewers"
- LOST (major): the entire ninth-round sentence is gone: "The ninth round was different in kind: Codex wrote a full critical review of the document (`abe_design_review.md`), the assistant drafted answers, and the two iterated until both were satisfied; the agreed answers (`abe_design_solutions.md`) were then written in here, chapter by chapter, and summarised in 11.14." The REWRITE has nothing about the ninth round, the two file names, or the 11.14 cross-reference.
- CHANGED: "review each round's proposals before they are written in" → "before they are committed". In this workflow writing-in and committing are distinct steps (the previous paragraph separates them); the review happens before the text is written into the document, not merely before the commit.

## 0. Read this first — "The analogy rule"
- CHANGED: "the harness experiment that would reject it" → "an evaluation harness experiment capable of validating or rejecting it". The ORIGINAL is falsification-only; "validating" is added.
- CHANGED (minor): "the ablation ladder in 11.1 is where they run" → "the ablation ladder in Section 11.1 details their execution". ORIGINAL says the ladder is where the experiments are run; REWRITE says it describes how they run.
- CHANGED (minor): "a count of deliberations" → "deliberation limits".

## 0. Read this first — "Vocabulary, fixed"
- ADDED: "a trait is what makes a tool a drop-in" → "defines the standardized interface contract that makes a tool interchangeable". "standardized interface contract" is not in the ORIGINAL.
- ADDED (minor): "the word 'space' is used only for the concept" → "reserved strictly for the abstract spatial concept"; "a learned skill" → "a learned procedural skill"; "an instance" → "a concrete tool instance". Harmless elaborations, listed for completeness.

## 0. Read this first — "Where things are"
- ADDED (minor): "recorded chronologically" (ORIGINAL: "11.4 onward, one section per round"). Harmless.

## 0. Read this first — "What the design is not"
- ADDED: "everything else is code over rows" → "deterministic code executing over structured data stores". "deterministic" is not in the ORIGINAL here (and the REWRITE repeats "deterministic" throughout 1.1, 1.3, 1.4 where the ORIGINAL says only "code"/"ordinary code").

## 1.1 What "like the brain" buys us — table
- CHANGED (row 1): "only a few things ever reach the LLM" → "only critical stimuli reach the LLM"; experiment "misses more obligations" → "misses more critical obligations". The ORIGINAL has no "critical" criterion; it is about quantity.
- ADDED (row 3): "One store with retrieval" → "A single unified vector store with retrieval". "vector" is not in the ORIGINAL.
- ADDED (row 4): "noise is dropped, not kept" → "pruning noise and consolidating durable knowledge". "consolidating durable knowledge" is new.
- WEAKENED (row 5): "Most repeated work costs no LLM call" → "Routine, repeated tasks execute ... without invoking the LLM". The hedge "Most" is dropped (reads as all repeated work).
- CHANGED (row 7): "Drives (hunger, boredom, curiosity)" → "Internal drives (boredom, budget, curiosity)". "hunger" replaced by "budget".
- WEAKENED (row 7): "knows when to stop spending" → "regulates resource expenditure".
- CHANGED (row 7): experiment "not useful more often than they cost" → "fail to provide utility exceeding their computational cost". ORIGINAL cost is unqualified (money, attention, owner time); REWRITE narrows to computational.

## 1.1 — paragraph after the table and the goals list
- ADDED: "memory is a transcript" → "append-only conversation transcript"; "every tick leaves a trace" → "immutable trace". Neither qualifier is in the ORIGINAL.
- ADDED/CONTRADICTS (Grounded claims): "The LLM reasons over what it is shown" → "reasons strictly over the retrieved evidence provided in its prompt". "strictly" contradicts the later sentence in the same bullet that allows general knowledge from the model's weights as a labelled prior.
- CHANGED (Grounded claims): "verified before use when stakes or change rate demand it" → "requiring external verification before execution". "use" (including use in an outbound claim) is broader than "execution"; also "external" is added.
- CHANGED (Grounded claims, minor): "far fewer unsupported claims, not zero" → "no system can claim a mathematical guarantee of zero hallucinations". "hallucinations" is narrower than "unsupported claims".
- ADDED (Reliability): "repeated tasks become procedures" → "Frequently repeated tasks are compiled into deterministic procedures". "Frequently" and "deterministic" added; "deterministic procedures" sits awkwardly with the next sentence, which allows declared model steps.

## 1.2 Running example
- ADDED (minor): "Her owner is Kam" → "owned and supervised by Kam". "supervised" is new.

## 1.3 The brain map — table
- LOST (View): "items in a frame, given by the tool" → "the structured items currently visible within an active tool frame". The point that the tool supplies the items is dropped.
- CHANGED (Map): "Places, containment, links, moves; learned by wandering" → "places, containment hierarchies, cross-references, and traversals discovered through exploration". "learned by wandering" applied to the whole map; in the REWRITE "discovered through exploration" attaches only to traversals.
- CHANGED (Semantic memory): "Entities and facts with confidence: people, projects, documents, rules" → "entities, relationships, attributes, and business rules, stored with confidence scores". The examples people/projects/documents are gone; relationships/attributes are added; "rules" became "business rules".
- LOST/CHANGED (ChangeEvent): "settled by looking at the authoritative place, by a citing deliberation, or by the owner" → "verified via authoritative sources, active deliberation, or owner confirmation". The qualifier "citing" on deliberation is dropped; "settled" (resolved either way) became "verified" (confirmed true); "the authoritative place" became "authoritative sources".
- CHANGED (Consolidation): "Nightly job" → "Periodic offline maintenance". "Nightly" is dropped.
- CHANGED (People models): "What each person knows, wants, and how close they are" → "knowledge boundaries, interaction preferences, and organizational proximity". "wants" is not "interaction preferences"; "how close they are" is not specifically "organizational".
- CHANGED (Identity): "values" → "ethical boundaries". Narrows the field.
- ADDED (minor): Idle mode "Low-priority background processing"; Attention "high-priority items". Not in ORIGINAL but roughly consistent.

## 1.4 The tick
- LOST: "A tick is cheap when nothing happens, and most ticks are like that." The second clause (most ticks are empty) is gone.
- CHANGED (step 2 Perceive): "asks, deadlines, high-stakes values and exceptions" → "explicit requests, deadlines, high-stakes values, and contractual exceptions". "explicit" and "contractual" narrow the screening targets; "Concurrently" is added.
- CHANGED (step 6 Attend): "decide whether it may interrupt; when is the schedule's call (7.2)" → "evaluate whether an incoming item warrants interrupting the active task; schedule the next evaluation interval (7.2)". ORIGINAL: attention decides whether an interrupt is allowed, and the schedule (7.2) decides when it happens. REWRITE turns this into attention scheduling "the next evaluation interval", a different mechanism.
- CHANGED (step 9 Act): "one bounded batch of read-class moves" → "an authorized batch of read-only operations". "bounded" (size-limited) became "authorized" (permitted); "moves" (navigation sense, 7.3) became "operations".
- CHANGED (step 9 Act): "the runner validates the basis the decision rests on (8.1)" → "verify execution preconditions via the runner (8.1)". The ORIGINAL is about the runner checking the evidence/citations the decision rests on (ties to principle 13 and 8.1), not generic preconditions.
- WEAKENED (step 9): "one decision:" prefix dropped (the single-operation rule survives as "a single selected operation", but the explicit "one decision" framing is gone).
- ADDED (Interrupts bullet): "only wins if it beats what the agent is doing" → "only if its priority strictly exceeds the active task's threshold". "strictly" and "threshold" are new.

## 1.5 What one tick looks like for Nia
- CHANGED (step 4 Appraise): Notion edit "medium arousal" → "medium-high arousal".
- LOST (step 5 Prime): "it just sits in the primed set for the next few minutes" → "remains warmed in the associative cache for subsequent evaluation". The duration "for the next few minutes" is dropped; "primed set" renamed "associative cache".
- CHANGED (step 11 Regulate, minor): "boredom 0" → "Boredom drops to zero". ORIGINAL states a level; REWRITE implies a change.
- WEAKENED (closing paragraph): "is the likely winner" → "emerges as the preferred action candidate". The hedge "likely" becomes a near-certainty.
- ADDED (minor): step 1 adds the count "four stimuli" (correct) and "daily" before standup (ORIGINAL reveals "daily" only in step 2). Harmless.

## 1.6 Principles, in one place
- ADDED (§1): "Cost lives in attention, not in sensing" → "costs reside in attentional processing and model inference". "and model inference" is new.
- CHANGED (§5): "for the new and the surprising" → "reserved for novel challenges, unexpected failures, and complex ambiguity". "surprising" narrowed to "unexpected failures"; "complex ambiguity" added.
- ADDED (§8, minor): "governed objectively by collaborator profile models". "objectively" is new.
- CHANGED (§13): "widen a disclosure" → "broaden data access". Disclosure (what leaves) is not access (what is read).
- WEAKENED (§13): "name a recipient" → "designate arbitrary recipients". "arbitrary" implies non-arbitrary recipient naming by the model might be acceptable; ORIGINAL forbids naming any recipient.
- ADDED (§13, minor): "All access controls and safety invariants are enforced deterministically" — ORIGINAL says only "those are checked where the action runs".

## 1.7 Chapters
- No findings (identical list).

Sections with no findings: 0 "How it is worked on"; 0 "Where things are" (one harmless addition only); 1.7 Chapters.

## Chapter 2 (50 findings)

Review of /tmp/claude-1000/-home-kamagatos-eldonlabs/ca1419ac-fa71-4ac7-ba80-2f629915e273/scratchpad/new_c02.md against old_c02.md. All formulas, numbers and the worked Nia examples survive intact (I re-checked the arithmetic: 50 s, 6 min, 18 s, 5 h, 10 h and the 0.9836 daily factor all follow from the formulas). Findings below are the meaning changes.

## 2. Perception (intro)
- ADDED (minor): "mostly ignored" became "largely filtered before reaching working memory". The original makes no claim about working memory here.

## 2.1 Tools, notifications, and the internal producers
- WEAKENED: "worth at most the 0.2 that urgency words are worth (3.1)" became "contributes at most +0.2 to urgency scoring". The equivalence with urgency words (the flag can never beat a word) is lost.
- CHANGED: "reads the tool's state on its own, periodically" became "inspects ... at scheduled intervals". 2.9 says "Nobody is issued an interval"; "scheduled intervals" contradicts that.
- ADDED: table row `chat`: "the tool pushes everything" became "pushes all events reliably". Reliability is not asserted in the original (and 2.9 tracks reliability per place precisely because it is not assumed).
- CHANGED (minor): table row `calendar`: "Event created, moved, cancelled" became "creation, updates, cancellations" ("moved" broadened to "updates").
- CHANGED: "a provenance no tool can forge" became "carry immutable provenance". Unforgeable-by-tools is not the same as immutable (the later sentence "cannot be forged by external tools" partly recovers it).
- CHANGED: prose keeps "Four sensory sources" while the Stimulus type comment now says "five internal producers". The original says "four" in both places (with five table rows); the rewrite introduced an internal inconsistency rather than keeping the original's wording.
- LOST (minor): table row `timer`: "An expectation's deadline" became "Deadline expiration" (the link to expectations dropped).
- CHANGED: table row `drive`: "crossed its set-point" became "crossing an activation threshold". Set-point is the regulator's named concept (Chapter 6).
- CHANGED (minor): table row `reminded`: "The Prime step (4.10)" became "The associative priming step". The named step is renamed.
- ADDED: "weigh a boredom signal against an email" became "mounting boredom or budget constraints". The original names no budget drive here.

## 2.2 Shapes
- LOST: `internal` comment: "set by the runtime, never by a tool" became "set by runtime". The "never by a tool" rule is dropped.
- CHANGED: `internal` comment: "the four producers" became "the five internal producers" (see 2.1 inconsistency).
- ADDED (minor): `accountId`: "which connected account, for a tool" became "for multi-account tools" (a restriction the original does not make).
- ADDED (minor): `externalId`: "page id + version" became "page ID + version hash".
- CHANGED: `screened.asks`: "each an obligation candidate (7.6)" became "action candidates with deadlines". "Obligation candidate" is the named term used in 2.3 §5 and 2.8.
- CHANGED: `screened.attributes`: "of this item kind" became "for this entity kind". Item kind is the trait-declared notion (8.8); entity kind is a different thing.
- ADDED: `screened.exceptions`: "qualifications a decision must see" became "contractual conditions or caveats". "Contractual" narrows the scope; the original examples include non-contractual qualifications.
- ADDED (minor): `level` comment: "internal" became "internal homeostatic level adjustment" (it is a level reading, not an adjustment).
- ADDED: "only consolidation promotes them" became "only sleep-phase consolidation promotes them to durable semantic status". The original does not tie promotion to sleep here.

## 2.3 Stages
- LOST: stage 3: "the brainstorm's dog-or-cat example" cross-reference is dropped.
- CHANGED: stage 5: "Deterministic parsers first for the attributes; a cheap `perceive` model step with a schema for the rest" became "Declared attributes are extracted via deterministic parsers where feasible, followed by a lightweight structured model step (`perceive`) to capture nuances". The original assigns the model step to "the rest" (asks and exceptions); the rewrite says it captures "nuances" and adds "where feasible" to the parsers.
- ADDED: stage 5: "action-relevant exceptions and qualifications" became "exceptions and contractual caveats" (narrowed, as in 2.2).
- ADDED: "Three rules follow" became "three deterministic safety invariants". The original does not call them deterministic (one input comes from a model step).
- CHANGED: rule 1: "no regularity threshold needed" became "requiring no statistical threshold". Regularity (4.11) is the named mechanism being bypassed.
- LOST: "this is the mechanism that answers 'paragraph four changed the payment instructions' before the invoice goes out, and it is the one that costs." The final clause (screening is the expensive mechanism) is dropped.
- CHANGED (minor): coverage gap causes "(budget, outage)" became "(due to compute budget depletion or tool outages)"; the original budget is the tool call budget, not specifically compute.

## 2.4 Peripheral and focused sensing
- WEAKENED: "sped up by pace (6.1) and by how often that tool's notifications have turned out to lag its state" became "dynamically adjusted by overall system pace and historical notification latency". The direction (sped up) is lost.
- CHANGED (minor): "comes back as a new percept with `content` filled in" became "returned as a refreshed percept". New record vs updated record.
- ADDED (minor): "attention selects a percept" became "attention gates a percept into working memory"; "Nia's newsletter" became "promotional newsletters".

## 2.5 Time and space
- LOST: "or nothing in Chapter 3 has anything to match against" became "to enable attentional spatial matching"; the Chapter 3 cross-reference is dropped.

## 2.7 What perception does not do
- ADDED/WEAKENED: "does not read full content for understanding" became "does not analyze complete text payloads for semantic comprehension during initial ingestion" (the added "during initial ingestion" qualifies a rule the original states flatly). "a focused read (2.4) is attention's act" became "occur only after attention is captured", which drops the 2.4 case where the executive requests the read as an action.

## 2.9 Glances
- LOST: intro: "it learns, per person, when to check on them" is dropped from the intro (covered later under people-timed glances, but the intro no longer says the scheduler learns per person).
- LOST: "It is learned by counting, the way facts are (9.2)" became "updated through continuous empirical observation (Section 9.2)"; the "by counting, the way facts are" tie is dropped.
- WEAKENED: decay comment: "so the model tracks change and an opportunistic sleep changes nothing" became "ensuring the model tracks environmental shifts smoothly across opportunistic sleep cycles". The point that sleep has no effect on the decay is softened to "smoothly across".
- LOST (minor): backoff: "what makes a tool with the same trait a drop-in (8.8)" became "allow standardized tools to act as interchangeable drop-in components"; the "same trait" qualification is dropped.
- LOST (minor): value table: "that expectation's task priority (7.2)" became "priority of an active expectation"; "task" dropped.
- ADDED: value table: "1.0, 0.8, 0.6 by level (3.6)" became "1.0 for the active frame, 0.8 for immediate parent, 0.6 for higher ancestors". The original says per level; the rewrite assigns 0.6 to all ancestors beyond the parent, an interpretation the original does not make.
- CHANGED (minor): cost: "0.02 for a cheap API" became "typically 0.02 for standard APIs".
- ADDED (minor): worked numbers: "A page she read once last month" became "Archived page viewed last month".
- ADDED: "the coverage floor only (once a day, below)" became "(defaulting to once per day)". The original states once a day as the floor ("once a day at the least"), not a default.
- ADDED (minor): people-timed: "peaking around P-31's usual delay" became "peaking near P-31's median turnaround time".
- LOST: people-timed: "learned per individual, and it needs no new mechanism: it is the change model plus the people model" became "naturally reproduces human anticipatory checking without requiring ad hoc rules". Both the per-individual learning and the "no new mechanism" claim are dropped.
- LOST (minor): reliability: "raises the tool's 'missed notifications' count on its page" loses "on its page"; "trust its own eyes over the tool's word for that place" loses "for that place".
- LOST/CHANGED: reliability: "with an arousal floor and a line in the why queue. A tool that starts lying is worth telling the owner about, not just compensating for." became "setting an arousal floor and logging an entry in the overnight why-queue for human review." The owner-notification sentence is dropped and replaced by "for human review", which the original does not say about the why queue.
- ADDED (minor): schedules: "the newsletter comes on Tuesdays" became "Tuesday mornings".
- CHANGED: budget pressure: "When a tool's hourly budget is spent" became "When a tool's hourly API quota nears exhaustion". Trigger moved from spent to nearly spent.
- CHANGED (minor): "reported in the brief" became "reported in the daily operational summary" (the brief is a named artifact elsewhere in the doc).
- CHANGED/ADDED: change blindness: "a late glance is never a lost one: the change is seen late, with its own `at`, not skipped" became "delayed glances ingest all intermediate historical events without loss". This overclaims (a diff cannot see intermediate states the tool does not keep; the original's own next sentence limits this) and drops "with its own `at`".
- LOST (minor): change blindness: "which is where being late costs most" is dropped.

Sections with no findings: 2.6 Habituation, 2.8 The invoice mail, perceived.

## Chapter 3 (65 findings)

Comparison of ORIGINAL (old_c03.md) against REWRITE (new_c03.md), section by section. Formulas, the salience table's numbers, the worked example's numbers, the gate thresholds (0.15, 0.9, switchCost 0.1), the WorkingMemory capacities (4/7/5/~300/~800/20, ten-minute half-life), the 3,000-4,000 default, the 12,000 ceiling, the depth defaults (four levels including root, plus one interrupt) and the rendering order all survive intact. The findings below are everything else.

### Chapter intro ("## 3. Attention and working memory")
- CHANGED: "Capacity is about four chunks." -> REWRITE: "approximately four to seven chunks." The number changed (and the WorkingMemory `attention` slot of max 4 was built on "about four").
- ADDED: REWRITE says the constraint keeps "latency low". ORIGINAL only says it keeps "Nia's prompts small and her trace readable".
- CHANGED (minor): "forces the brain to recall, summarise and prioritise" -> "compels the system to retrieve, summarize, and prioritize context on demand"; the subject moved from the brain (the analogy) to "the system", so the sentence now states a property of Abe instead of the biological argument. Low priority.

### 3.1 Salience
- ADDED: REWRITE opens with "a single scalar salience score between 0.0 and 1.0". ORIGINAL only says salience stays between 0 and 1 because the *default* weights sum to 1; it does not assert the range as a property of the score itself.
- ADDED (minor): REWRITE says top-down terms come from "active goals, identity parameters, and social relationships". ORIGINAL: "what the agent is doing and who it is" (no "social relationships").
- CHANGED (goal row): "0.8 the parent frame's, or a parent or child place on the map" -> "0.8 if matching the parent frame or an adjacent place on the map". "Adjacent" is broader and overlaps with "sibling place", which ORIGINAL scores 0.6.
- WEAKENED (goal row): "0.6 an older ancestor's" -> "0.6 if matching an ancestor frame". "Older" dropped, so the parent (also an ancestor) now matches both the 0.8 and 0.6 clauses.
- LOST (goal row, minor): "0.3 ... or elsewhere in the same tool instance" -> "the same tool instance" ("elsewhere" dropped; now the focused place itself would also read as 0.3).
- CHANGED (actor row): "none 0.3" -> "automated producer 0.3". ORIGINAL says 0.3 when there is no actor; REWRITE reinterprets that as a specific actor kind.
- ADDED (actor row, minor): "teammate ~0.7, known contact ~0.4, stranger 0.2" -> "close teammate", "known external contact", "unfamiliar contact". Qualifiers "close" and "external" are new.
- WEAKENED: "muting changes what wins, never what is seen" -> "lowers an event's competitive priority without blinding the agent to its occurrence". The "never" rule became a description.
- Worked example: all weights and all 24 cell values and the four salience totals are identical. No findings.

### 3.2 Gates
- WEAKENED (Attend): "nothing else happens now" -> "bypass active working state". The "now" (implying later idle review, stated at the end of the section) is dropped from the gate rule itself.
- ADDED (minor): "The newsletter" -> "The promotional newsletter"; "The invoice" -> "the supplier invoice". Details ORIGINAL does not give.
- LOST: "calibrated in the harness against the one thing that can be measured: extra deliberations spent after a resume" -> "calibrated ... by measuring the additional deliberations required to resume interrupted workflows". The qualification that this is the only measurable thing is gone.
- CHANGED (schedule decision): "now, at the next checkpoint, or after the current task" -> "immediately, at the next procedure step checkpoint, or upon completing the current task step". Third option changed from after the *task* to after the current *step*.
- LOST (schedule decision): "chosen by how long each side will take and how late each would be" -> replaced by "to determine the optimal preemption boundary". The decision criterion (duration and lateness of each side) is gone.
- CHANGED (minor): "candidate to take the tick" -> "candidate to interrupt active execution". Same idea; note only because "tick" is the defined unit elsewhere.
- Formulas: `salience > min(engagement + switchCost, 0.9)`, `engagement = priority · (0.5 + 0.5 · r)`, `r = 0.4·depth/4 + 0.3·unchunked history/budget + 0.3·midOperation`, midOperation definition, switchCost 0.1 "never to a deliberate zoom", the 0.9 cap rationale, 0.68 vs 0.45+0.1, "Only the 1.0 case is now unconditionally", and the idle-mode review of unattended percepts: all preserved.

### 3.3 Inhibition of return
- No findings (REWRITE adds "or documents" to "threads" as an example; ORIGINAL's "thread or entity" covers it).

### 3.4 Working memory
- WEAKENED (minor): "a fixed set of slots with fixed capacities" -> "structured slots with explicit capacity limits" ("fixed" dropped twice).
- ADDED: `now.place` comment gains a cross-reference "(Chapter 12)" that ORIGINAL does not have.
- ADDED (minor): `self` comment "agent name, role, owner, autonomy constraints"; ORIGINAL: "Who am I, whose agent, what I may do alone" (no "name, role").
- LOST (minor): `scratch` "the agent's own *last* reasoning summary" -> "synthesized scratchpad reasoning" ("last" dropped).
- LOST (`conflicts` field): "assertions that contradict attended percepts *or each other*" -> "contradictions between recalled assertions and attended percepts". Assertion-vs-assertion conflicts dropped from the type.
- LOST (`conflicts` field): "the ones that matter to the task also live on the task" dropped from the field comment (the rule survives only in 3.7's prose).
- CHANGED: "The default is the analogy's number, and the harness measures it, not the other way round." -> "This default reflects the biological cognitive capacity constraint and is calibrated via the evaluation harness." ORIGINAL says the number comes from the analogy and the harness only checks it; REWRITE says the harness calibrates it, which is the "other way round" ORIGINAL rejects.
- CHANGED (minor): example "reconciling two accounts of one event" -> "reconciling conflicting multi-party testimonies".
- LOST (minor): `needs: 'widen'` "with the ids it wants *in full*" -> "specifying the required identifiers".
- LOST: "the identity's `widen` ceiling" -> "the identity's configured ceiling". The field name `widen` is dropped.
- LOST: "Widening costs like a care-mode call" -> "incurs significant compute cost". The care-mode comparison (and the cross-link to that concept) is gone.
- CHANGED (minor): harness measures "fewer errors and fewer calls" -> "higher accuracy and lower total cost".
- LOST: "the contracts case is the first widen script." Not in REWRITE.
- CHANGED (hedge to certainty): "Decomposition can lose relations that have to be seen together" -> "Complex multi-document synthesis often breaks down when aggressively decomposed".
- LOST: "and the design no longer pretends otherwise" (the admission that this is a change of position). REWRITE instead ADDS "the architecture provides wide rendering specifically to address those cases", which ORIGINAL does not state in those terms.

### 3.5 Eviction and chunking
- WEAKENED (minor): "collapsed into one line" -> "summarized into a concise milestone record". The one-line constraint is gone.
- CHANGED (minor): "the story gets shorter and the agent keeps the point" -> "compresses narrative length while maintaining essential task momentum". "Keeps the point" (retains the gist) is not "momentum".
- Activation components, lowest-activation eviction, "eviction is free because episodic memory already has everything", recall brings it back, `task.history` past its budget, cheap model call, detail stays in the episode, "This is rehearsal": preserved.

### 3.6 Focus: zooming in and popping out
- LOST (intro): "the level above fades a little without going away" -> "preserving the enclosing context". The fading nuance is removed from the analogy (it reappears only in the Fading paragraph).
- LOST: "`context:focus` from the brainstorm is this. A frame is one level of it." REWRITE: "In Abe, this is formalized through nested execution frames". The tie to the brainstorm's `context:focus` is gone.
- CHANGED (Frame.constraints): "permissions, deadlines, rules inherited from above" -> "permissions, deadlines, safety invariants". "Rules" became "safety invariants" (also repeated in the Fading paragraph, where ORIGINAL only names "a deadline or a permission").
- LOST (Frame.budget, minor): "a share of the parent's *remaining* budget" -> "deliberation quota allocated from the parent frame".
- CHANGED (Pushing/zoom): `needs: 'zoom'` carries "the expected result" -> "expected output format".
- LOST (Fading): cross-reference "Salience's goal term (3.1)" dropped (numbers 1.0/0.8/0.6/0.3 preserved).
- LOST (Popping): "and only one of them is success" dropped from "A frame leaves focus in one of three ways".
- CHANGED (Settled examples): "A move is on the board; a paragraph exists and passes the checks it was asked for; a question has a supported answer" -> "an updated record is verified in the database, or a document passes required validation checks". "A question has a supported answer" is gone; the database example is new.
- ADDED (Blocked, minor): "freeing working memory *for other tasks*" (ORIGINAL: "working memory is freed").
- ADDED (Failed or cancelled): REWRITE adds a third cause, "encounters an unrecoverable error". ORIGINAL: only "its budget ran out, or the owner dropped it".
- LOST (Failed or cancelled): "It pops with *that* status, never as success." -> "pops with an explicit failure status". "Never as success" is gone, and cancelled is folded into "failure" instead of keeping its own status.
- CHANGED (result, minor): "what it left unresolved" -> "unresolved dependencies" (narrower).
- LOST: "so nothing new is needed to model the wait" (after "a parent blocked on the expectation 'child settled' (7.6)").
- LOST (Depth): "Defaults, to be measured in the harness (11.1), *not facts about brains*" -> "The system enforces baseline stack limits, evaluated via the test harness". The hedge is gone and "defaults" became enforced limits.
- LOST (Depth): "the whole current branch is parked *(blocked on "resume")*" -> "the current active branch is suspended". The mechanism (blocked on a "resume" expectation) is dropped.
- CHANGED (Depth, minor): "Stack capacity must never be what stops the owner getting through" -> "must never prevent the owner from communicating *critical instructions*". ORIGINAL has no "critical" qualifier.
- LOST: "Frames are the brainstorm's ephemeral and nested contexts" (second brainstorm tie). The Nia example (root / zoom / interrupt / zoom then blocked) is preserved.

### 3.7 Reconciliation
- ADDED (minor): "A recalled fact" -> "A recalled assertion *from semantic memory*".
- WEAKENED (minor): "resolve it before acting *on either*" -> "before acting".
- ADDED: "or ask" -> "requesting clarification *from the owner*". ORIGINAL does not say whom to ask.
- CHANGED: matching criterion "same subject, attribute and overlapping *scope and applicability*" -> "overlapping *temporal and contextual validity*". Scope/applicability (presumably defined terms elsewhere in the document) were reinterpreted.
- CHANGED (minor): "A conflict that bears on an *action* is stored on the task" -> "directly bears on an *active task*".
- "By proposition, not by popularity", "before recall ranks anything (4.6)", "regardless of activation", familiar-cannot-crowd-out, survives eviction, re-renders on every deliberation, ChangeEvent (13.9), learning (Chapter 9): preserved.

### 3.8 Rendering
- ADDED: "Chapter 10 says what happens to it" -> "triggering verification protocols outlined in Chapter 10". REWRITE asserts what Chapter 10 does; ORIGINAL only points to it.
- CHANGED (minor): "If the agent says something that cites no id" -> "Any *factual* claim ... that lacks an identifier" (narrowed to factual claims).
- LOST (minor): debugger shows the rendering "verbatim" -> "displays this rendered context".
- Order (self, now, ancestors, conflicts, attention, recall, conversation, expectations, scratch) and id examples: preserved.

Sections with no findings: 3.3 Inhibition of return; the 3.1 worked-example table (numbers only).

## Chapter 4 (101 findings)

## Findings: old_c04.md vs new_c04.md

### 4 (chapter intro)
- CHANGED: "Today's Abe keeps memory as a transcript and replays the last 20 to 50 requests" → rewrite generalises to "Existing conversational architectures typically ... replaying the last 20 to 50 turns". The specific statement about today's Abe is gone, and "requests" became "turns".
- CHANGED: "Nia keeps the transcript as an audit log and never reads it back" → rewrite says "Abe treats the raw conversation transcript strictly as an immutable audit log, never replaying it wholesale". Nia became Abe (the original contrasts today's Abe with Nia), and "never reads it back" is WEAKENED to "never replaying it wholesale" (implies partial replay is fine). "immutable" is added.

### 4.1 Episodic memory
- LOST: "One episode per attended thing" (the one-to-one rule) is not stated; rewrite only lists what episodes record.
- WEAKENED: thin episodes "are the first thing sleep throws away" → "the primary candidates for pruning". Ordering rule softened.
- ADDED: field comments not in original: `goal?` "associated standing goal being advanced", `place` "(Chapter 12)" cross-ref, `at` "start timestamp". Harmless but new.

### 4.2 Semantic memory
- LOST: "This is the brainstorm's **Identity** made concrete" → "This structure formalizes grounded identity"; reference to the brainstorm's Identity concept dropped.
- WEAKENED: `p` comment "observations only: the distribution over values, as now" → "empirical confidence distribution (applicable to observations)". "only" dropped (and "as now").
- WEAKENED: `applies?` comment "declared applicability, only when a source stated it" → "explicit applicability window stated by the source"; "only when" dropped.
- LOST: `Support` comment "...referenced clauses that bear on it, wherever they occur" → "wherever they occur" dropped.
- LOST (table, instruction row, Has): "author, authority, scope, applies, status" → rewrite lists `author`, authority, `scope`, `status`; **`applies` is missing**.
- ADDED (table, instruction example): "Kam: forward supplier invoices" → "...to billing".
- ADDED (table, observation Has): "observations with support" → "observations with verified `support`".
- ADDED (table, report Has): "what was said" → "verbatim statement".
- LOST (table, regularity Has): "counts; lives in a pattern (4.11)" → "Statistical observation counts; schema". The "(4.11)" cross-ref and "lives in a pattern" are gone.
- WEAKENED (table, regularity Moves by): "never a claim about one instance" → "never asserted as an absolute truth for a single instance" (leaves room for a non-absolute claim about an instance).
- CHANGED: authority examples "a teammate over their own things" → "a collaborator over their personal calendar and preferences" (narrowed to specific examples); "team things" → "shared project resources".
- CHANGED: "two instructions of incomparable authority, or of equal authority **with no order**, block the affected action" → "two instructions conflict with equal or incomparable authority, the affected action is blocked". The "with no order" qualification is lost (equal authority with an order resolves by newer-supersedes in the original).
- CHANGED: "For most facts of the agent's own world one such statement is enough ...; for a **stable** fact it is not" → "For mundane facts within the agent's immediate operational purview ... For established **external** facts". Stable ≠ external; criterion changed. Also "a single verbal report does not silently overwrite empirical reality" is an added gloss.
- CHANGED: example "treat the capital as Lyon" → "assume the regional headquarters is in Lyon" (breaks the tie to the Paris/Lyon example in 4.12).
- CHANGED: candidate promotion "A candidate **seen twice**, or involved in an attended episode, gets promoted" → "observed across **multiple sessions** or involved in attended episodes". Different criterion. "permanently promoting" adds "permanently".
- LOST (minor): "The two were one thing in the first draft and are not" (preferences vs rules history) replaced by a generic contrast sentence.

### 4.3 Procedural memory
- CHANGED: `reliesOn` comment "a **change** puts it back in shadow" → "**violations** demote procedure to shadow mode". Any change vs violation.
- ADDED: `guards: Guard\[\]` comment "active execution guards vetoing automated dispatch" (original has none).
- LOST: `Predicate` comment "over percept fields, screened attributes, view items, assertions and time ranges" dropped entirely.
- LOST: `Binding` comment "a path; a missing, ambiguous, **conflicting** or out-of-scope binding is Unknown" → prose "unresolved, ambiguous, or out-of-scope"; **"conflicting" is missing**, and "a path" dropped.
- LOST: `fact` binding comment "the **current** value, **in scope, at a time**" → "query semantic memory value".
- ADDED: `role` binding comment "resolve active tool instance assigned to this role" (original has no comment).
- CHANGED: precondition example "actor is a **known** supplier" → "an **approved** supplier"; trigger "sender in known-supplier assertions" → "sender verified in approved supplier records". Known ≠ approved; "verified" added.
- WEAKENED: headline rule "**`Unknown` never satisfies anything**" is not stated as such; only its two consequences (predicate false, step halts) remain.
- LOST: "That share \[deterministic coverage\] is one of the design's central unknowns."
- LOST: `duration` "is measured, **never declared**" → "measured statistics"; the prohibition on declared durations is gone. Also "mean and spread" → "mean and variance" (field is `spread`).
- LOST: heading rule "Reliability is a lower bound, **per outcome level**, per context" and "at one level" — rewrite never says the Beta statistic is kept per outcome level.
- LOST: "in a context signature (**the slot signature of 4.11**)" → "within a specific context signature (Section 4.11)"; tie to slot signature dropped.
- ADDED: definitions of the four outcomes not in the original: `accepted` "(valid syntax and execution)", `effect` "(intended state change observed)", `objective` "(underlying task goal satisfied)", `appropriate` "(action adhered to organizational norms)". Also `outward` "(external communications)".
- CHANGED: "a suggestion the slow path can follow or **reject**" → "a recommended plan that the model may follow or **modify**".
- CHANGED (guard intro): "attached to it, to an actor, to an **item**, or to a context" → "procedure, actor, **entity**, or operational context". Example "Acme amounts have been wrong; **check** before forwarding" → "require **explicit confirmation** before forwarding" (stronger action).
- ADDED: Guard `test` example "an Acme invoice matching **signed** PO" (original: "whose amount matches the PO"); comment "bears on it" → "evaluates resolution".
- LOST: Guard `passed` comment "five with no failure narrows the scope **to what still failed**" → "narrows scope". "consecutive" added.
- CHANGED: guard creation "by screening when a high-stakes value is **new or changed**" → "identifies an **unexpected change** in a high-stakes attribute". "new" dropped, "unexpected" added.
- LOST: "when recall surfaces a high-arousal negative episode about the **same procedure or actor**" → "involving the entity".
- ADDED: "a guard with no test after a month is a why-queue question" → "escalated to the why-queue **for human review**".

### 4.4 Prospective memory
- WEAKENED: "created by actions (**every** outbound message expects a reply)" → "(e.g., dispatching an email creates an expectation for a reply)". Universal rule became an example.
- CHANGED: "by sleep (open loops)" → "by sleep consolidation (tracking unresolved **multi-day** tasks)". "multi-day" added, "open loops" narrowed.

### 4.5 Activation
- ADDED/likely wrong: shortcut `n · L^−d` — rewrite defines "n is **total historical access count**". Original does not define n; it approximates the *older* (unstored) accesses, so total count would double-count the stored five.
- LOST: "`S` is a **fixed** strength for each kind of match" → "match strength".
- ADDED: text similarity "Lexical or **embedding** text similarity" (original: "text similarity"; 4.6 says embeddings come later).
- ADDED: "standard **indexed** columns" (original: "are columns").

### 4.6 Recall
- CHANGED: cues "the attended percepts' entities, **threads** and spaces ... **the conversation the task came from** (4.8)" → "entities and locations ... **recent conversational turns** (4.8)". Threads dropped; cue is the conversation place, not its turns.
- CHANGED (pass 0): "same subject, attribute and overlapping **scope and applicability**" → "overlapping **temporal scope**". Scope (contextual) collapsed into temporal only.
- LOST (pass 1): "fall in the cued range **at its grain** (13.4)" → "within specified temporal ranges".
- CHANGED (pass 3): "Full-text search first; an embedding index **later, once we have one (Chapter 10)**" → "Queries full-text indexes and dense vector embeddings" (embeddings presented as present; Chapter 10 cross-ref dropped).
- CHANGED (minor): "**a** matching pattern given the first places" → "recognized patterns" (plural).

### 4.7 Reconsolidation
- WEAKENED: ChangeEvent "born with a **low** probability set by the source's accuracy..." → "initialized with a prior probability calibrated to..."; "low" dropped.
- CHANGED: settlement "by a deliberation that **names the scoped observations it accepts**" → "an explicit deliberative step accepting verified evidence". The naming requirement is gone.
- ADDED: quote "I saw it on the 12th" → "as observed **in the calendar** on September 12".
- LOST: "a correction that arrives at nine holds at ten".
- LOST: "for the agent's own world that usually settles it on the spot, and for a stable fact it does not, which is as it should be" (second limit's tail; rewrite only says reports go through the ChangeEvent pipeline).
- LOST: "sleep promotes or drops it **like a candidate entity (4.2)**" → cross-ref and analogy dropped.
- ADDED: "queries an **external site**" for the match score.

### 4.8 What is not memory
- ADDED: opening rationale "To prevent performance degradation and confusion, specific operational data structures are excluded from semantic memory".
- LOST: "recall cues on that place **and time**" → "recall cues on that place".
- LOST: "a **read-class move** fetches the matching turns as a focused read" → "prompting a focused read".
- LOST: "This is recall by place, bounded and **in the trace**, not a tape replayed."
- LOST: raw payloads "kept in cold storage **for a while**" → "archived in secondary cold storage" (bounded retention dropped). ADDED "voluminous robot telemetry streams" to the payload list.
- ADDED: guesses "handled via **safety protocols** in Chapter 10" (original: "Chapter 10 says how guesses are handled").

### 4.9 The invoice, recalled
- CHANGED: E-1044 "Kam **asked** to check" → "Kam **instructed** re-check" ("instruction" is a technical kind in this chapter).
- ADDED (minor): "six clear the retrieval threshold and enter working memory" (original: "six make it").

### 4.10 Priming, reminding, incubation
- LOST: "Three mechanisms follow, **in increasing cost**."
- CHANGED: tag "_came to mind_" → "_spontaneous associations_" (this is a literal label the model sees).
- LOST: "**One indexed query per percept**; glances that find nothing produce no percept, so the volume stays small" → only the glances clause survives.
- LOST: "this is how 'later that day it clicked' happens".
- CHANGED: pop condition "a drive **out of band**" → "a **depleted** drive" (out of band is either direction). "The regulator" → "the drive regulator".
- LOST: "Usually it queues, and **curiosity** picks it up in idle mode" → "enter the task queue to be explored during idle mode".
- ADDED: example "the flower reminded me..." → "the incoming floral delivery notification".
- ADDED (step 4): "cites at least two **independent** memory identifiers" (original: "at least two ids"). LOST: "Anything less is discarded and **never stored**" → "discarded immediately".
- LOST (step 5): "a hypothesis, **marked inferred, never a fact**" → "an unverified hypothesis".
- LOST: "it is the one place the agent gets to be surprised by itself".

### 4.11 Patterns
- LOST: `because.test` comment "what the explanation predicts and a **named** alternative does not" → "distinguishing this explanation from alternatives".
- CHANGED: "or an **explicit source supports it (Kam said so)**" → "confirmed by an **authoritative** source".
- LOST: identification cues "(a person's pace, hours, channel, tone, **the rate of a place**)" → place rate dropped.
- LOST: "The brainstorm's identity-as-distribution, used the way it was meant."
- LOST: "Sleep (5.2 §2 and §3): **extract and compile both write to them**" → "Patterns are compiled during sleep consolidation".
- LOST: "**reading the field is what confirms the assertion**" (extractor selection) → "which assertions they validate". This is the counterpart to "a pattern match never confirms".
- WEAKENED: "three or more such episodes **with the same slot signature**" → "three or more **structurally similar** anomalous episodes".
- CHANGED: "Regularities are counted over views (12.3): what a kind of item looks like in a kind of place, over many looks" → "computed across **spatial** views (12.3)"; explanation dropped, "spatial" added.
- CHANGED: convergence "chose it in at least `k` **of the last runs** (default five)" → "across at least k **consecutive** runs". "Consecutive" is new.
- LOST: "That the other variants went quiet is not evidence; a variant can stop being chosen because an earlier preference stopped giving it chances." Replaced by a positive gloss ("demonstrates genuine operational preference").
- CHANGED: "becomes a procedure **proposal**" (the `proposal` rung) → "a **candidate** procedure" (4.3 uses "candidate" for three clean runs).
- LOST: "Compile is therefore **not a separate mechanism**".
- LOST: "**The same rules as guards (4.3)** hold it in check" (over-generalisation cross-ref).
- ADDED: change model per place "(2.9) is a regularity of one attribute, rate" → "single-attribute **Poisson** regularity".
- LOST: "and they **live in the same rows**" (regularities elsewhere share the store).

### 4.12 Prior knowledge
- LOST: the grounding rule's text "**cite an id, or mark it as prior**" (8.6) → "enforced by grounding rules (Section 8.6)".
- LOST: "the first draft got it wrong by dating a prior claim at the training cutoff".
- LOST: "The harness measures it on the scripted weeks and live use keeps measuring it."
- LOST/CONTRADICTED: "A **stable** kind with a high error rate is verified before use however slowly the world changes; **the model can be wrong, not just stale**" → rewrite's examples "(e.g., specialized legal citations or **volatile API syntax**)" — a volatile example undercuts the stable-kind point; the "wrong, not just stale" sentence is gone.
- CHANGED: draft check (8.3) "accepts a number, name or date..." → "**Outbound operations** accept..."; original does not limit the draft check to outbound.
- LOST: "the memory browser shows **what Nia believes from the world and what from the model**" → "visible in the memory inspection debugger".
- LOST/CHANGED: "a report that **the capital moved** opens an event against a **Paris row** that has never been verified ... **After that read, Nia says Lyon while the model still says Paris**" → "a corporate headquarters relocated ... resolved via authoritative inspection". The Paris/Lyon outcome sentence is gone.
- LOST: "it is the same mechanism as the standup moving to 09:30".
- LOST: "What this costs **the promise in 1.1**" → cross-ref to 1.1 dropped.

Sections with no findings: none (every section has at least one item; 4.4, 4.5 and 4.9 have only minor ones).

## Chapters 5 and 6 (100 findings)

Comparison of ORIGINAL (old_c0506.md) against REWRITE (new_c0506.md), grouped by the ORIGINAL's sections. Severity first, then the original wording, then what the rewrite does.

## 5. Consolidation (sleep) and forgetting — intro
- WEAKENED: "It is the only process that writes to semantic and procedural memory in bulk" → rewrite says "the primary mechanism that performs bulk updates". "only" became "primary".
- ADDED: rewrite names the system "Abe" ("Abe implements an offline consolidation process"; also in 6.2 and 6.4). The original never uses "Abe" in these chapters; the agent is "Nia".
- LOST (minor, analogy): "Emotional episodes are processed and their sting reduced" → "integrated and contextualized"; the sting-reduction idea is gone.

## 5.1 When
- CHANGED: "It never starts while a care-mode task or a task above priority 0.7 is active" → rewrite: "Forced consolidation is deferred while ... (care-mode tasks or tasks with priority ≥ 0.7) are active". Two changes: the rule is narrowed to forced sleep only (original "It" = sleep in general, every trigger), and "above 0.7" (strict) became "≥ 0.7".
- ADDED: "Accumulating sleep debt degrades operational efficiency ... vastly preferable to the query latency and prompt clutter of unpruned memory stores." The original only says "Sleep debt is real, and it is cheaper than the memory bloat it prevents"; efficiency degradation, query latency and prompt clutter are new claims.
- WEAKENED: "Nothing in sleep is required to finish tonight" → "not required to complete in a single uninterrupted block". The original allows phases to slip to another day entirely; the rewrite only says they may be split.

## 5.2 Phases — §2 Extract
- LOST: "The first draft said it did, and that was the cycle a reviewer caught" (provenance of the rule) is dropped; rewrite only states the circularity abstractly.
- CHANGED: "may select an extractor for the fields the pattern names" → "can configure extraction templates for specified fields". "extractor" (a named mechanism) and "the fields the pattern names" are replaced.
- CHANGED: spot checks "an independent 5% of the rest" → "a random 5% baseline sample". "of the rest" (5% drawn from matches not already selected by stakes) is lost; "independent" became "random".
- WEAKENED/CHANGED: "on a normal day it covers most of the group" → "covers the vast majority of routine episodes with zero model inference". "most" → "vast majority"; "zero model inference" is an addition (implied but not stated).
- LOST: "each pointing at the evidence and the passage that supports it" → "each anchored to explicit passage citations". The pointer to the evidence (not only the passage) is gone.
- CHANGED: Confirmation: "an observation with its support is added, lastConfirmed moves" → "Appends verified support to the existing observation and advances lastConfirmed". Original adds a new observation to the assertion; rewrite appends support to an existing observation (different data model).
- CHANGED: New observation: "created, with the evidence and support of each supporting episode" → "Instantiates the assertion, recording supporting episodes". Original creates an observation (not the assertion) and records both evidence and support (passages) per episode; "support" is dropped.
- CHANGED: "with the authoritative place the agent would read to settle it" → "the authoritative source location the agent plans to inspect". "would read" (conditional, if asked) became "plans to inspect" (intent).
- CHANGED: "Candidate entities seen twice, or in an attended episode, are promoted" → "Entities observed across multiple distinct sessions or referenced in attended episodes are promoted to permanent status". The number "twice" is lost and a "distinct sessions" requirement is added that the original does not have.

## 5.2 — §3 Compile
- LOST: "with one variant per distinct thing that was done or seen in it and the outcomes attached" → "recording observed strategy variants and execution outcomes". The one-variant-per-distinct-action rule is gone.
- LOST: proposal has "origin.kind = 'compiled' and the pattern as its origin" → rewrite keeps origin.kind but drops "the pattern as its origin".
- ADDED: converged = "chosen by the slow path with the alternatives in view" → rewrite adds "consistently selected ... across successive runs"; "consistently" and "successive runs" are new qualifiers.
- CHANGED: "Procedures whose reliability bound has fallen under their class's bar" → "lower credible reliability bound" ("lower credible" added); "their pattern's other variants come back into advice" → "re-exposed to deliberative planning" ("advice" as a named mechanism replaced).
- CHANGED: "means the shape is not one procedure, and it does not compile" → "indicates that the workflow lacks structural determinism, preventing automated compilation". The original diagnosis (the shape is more than one procedure) is replaced with a different claim.
- LOST: "the procedure starts as narrow as its evidence" (the principle behind restrictions) is dropped.

## 5.2 — §4 Prospect
- CHANGED: "Surprising outcomes, unresolved conflicts and low-confidence decisions that turned out to matter go to the why queue" → "Surprising execution failures, unmerged conflicts, and low-confidence decisions that produced significant consequences". "Surprising outcomes" narrowed to failures (surprising successes also qualify in the original); "unresolved" → "unmerged".
- LOST: "(the brainstorm's time patterns)" cross-reference to the brainstorm → "(e.g., recurring temporal patterns)".
- CHANGED: "cluster at a day, a week or a month" → "circadian, weekly, or monthly cycles" (acceptable), but "make a missed cycle an anomaly" → "triggers an anomaly alert". "alert" is added; the original makes it an anomaly (a percept), not an alert.
- CHANGED: "Recurring expectations time glances (2.9)" → "optimize inspection schedules (Section 2.9)". "glances" (named mechanism) replaced.
- CHANGED/WEAKENED: "this agent asks: the entity's owner if a person on the team owns it (a project's lead), else the team admin, in its next brief" → "the system schedules an inquiry directed to the relevant domain owner (or team administrator) in the next briefing". The actor (this agent, the one that published) became "the system"; the precedence rule (owner if a person owns it, else admin) is flattened to "(or team administrator)"; the example "(a project's lead)" is lost.

## 5.2 — §5 Compact
- ADDED: "page id and version" → "page ID and version hash"; "hash" is new. Stub described as "immutable"; original does not say immutable.
- WEAKENED/LOST: "the cited passages with the context needed to interpret them (the qualifications, conditions and referenced clauses wherever they occur, as screening and the extractor found them)" → "cited textual passages along with necessary contextual caveats". The enumeration (qualifications, conditions, referenced clauses wherever they occur) and the source of that context (screening and the extractor) are dropped.
- LOST: evidenceLost causes: "the owner or a retention rule required deletion" → "retention policies mandated permanent erasure". Owner-required deletion is dropped as a cause.
- CHANGED: "where allowed, its support text" → "where legally permissible". "legally" is added and narrows "allowed" (which covers retention rules and the owner).
- CHANGED: "the assertion renders as 'evidence no longer available' and the certainty rule (7.5) treats it as a hypothesis" → "serializes with an explicit warning ('underlying evidence no longer verifiable'), causing executive planning (Section 7.5) to treat the assertion as an unverified hypothesis". The rendered string is changed and "the certainty rule" (named mechanism) became "executive planning".
- LOST: "The system says what it can no longer show."

## 5.2 — §6 Prune
- CHANGED: never list: "anything the owner authored" → "any instruction or procedure authored by the owner" (narrowed: original covers anything the owner authored, e.g. messages, pages, facts). "the last thirty days of episodes involving the owner" → "episodic history involving direct owner interaction from the preceding 30 days" ("direct interaction" is narrower than "involving the owner").
- WEAKENED: "Retention is references and a date, not a score" → "rather than transient activation scores alone". "alone" implies scores partly govern retention; the original says they do not at all.
- CHANGED: live definition: "accepted obligation" → "pending obligation" (different state); "a correction whose procedure still exists" → "an owner correction for an active procedure" ("owner" added, "still exists" → "active"); "instruction" → "active instruction" (qualifier added).
- CHANGED (terminology): the defined term "live" is renamed "active" throughout, which collides with the rewrite's other uses of "active" (active instruction, active task, active procedure).
- ADDED: "Habituation counts are kept" → "preserved permanently". "permanently" is new.

## 5.2 — §7 Dream
- CHANGED: incubation runs "the day's primed set against the open problems and the closed decisions of the week" → "active problems and low-confidence decisions from the preceding week". "closed decisions" became "low-confidence decisions" (a different set).
- LOST: "under the same budget and thresholds as idle mode" → "under standard idle-mode budgets". "thresholds" dropped.
- LOST: "This is the brainstorm's dream: a rehearsal of the next day, about what is dreaded or hoped for" → "anticipatory cognitive rehearsal for expected challenges". Brainstorm reference lost; "hoped for" narrowed to "challenges".

## 5.3 Waking
- CHANGED: "Working memory is cleared except self, the standing goals and the drives" → "preserving only immutable identity parameters (self), standing goals, and baseline drive states". The drives' current levels are kept in the original, not "baseline" states; "immutable" is added (identity is versioned and owner-edited, not immutable).

## 5.4 The numbers
- ADDED: "Adopting an ACT-R decay parameter d = 0.5" — the original does not name ACT-R here.
- CHANGED: row "A fact confirmed ten times | years | not while confirmed" → "Multiple years | Retained while active". "not while confirmed" (not forgotten while confirmations keep coming) became "while active" (the rewrite's liveness term), a different condition.
- CHANGED (minor): row "A routine task episode, never recalled" → "(single access, zero arousal)"; "Newsletter" → "promotional newsletter" (added).
- LOST: "The other rows follow the same arithmetic; the harness's recall tests check them" → "The test harness validates these empirical decay curves". The statement that the other rows follow from the same arithmetic is dropped. (The added "(~9 days)" and "(~46 days)" are consistent with 220 h and 1,100 h.)

## 5.5 What sleep costs
- CHANGED: "Dream is capped" (budget, money in 5.2 §7) → "operates under a strict token ceiling". The cap became a token ceiling.
- ADDED (consistent with §1): "Replay" added to the list of code-only phases; original lists compile, prospect, compact, prune.

## 6. Drives, appraisal and identity — intro
- ADDED: "a stable sense of self: who I am, what I value, what I do when nothing is asked of me" → "core role definitions, ethical boundaries, and behavioral defaults". "ethical boundaries" is new; "what I value" is broader.

## 6.1 Drives
- ADDED: "The regulator (tick step 11)" → "(tick step 11; Section 1.4)". Cross-reference 1.4 is new and unverified.
- LOST/CHANGED (curiosity row): "candidate entities in attended episodes" → "candidate entities" (qualifier lost); "a fact learned" → "Learning verifiable facts" ("verifiable" added); "idle mode picks the top unresolved item" → "highest-priority unresolved anomaly" ("item" narrowed to "anomaly").
- CHANGED (sleep pressure row): "hours since sleep, weighted by new episodes" → "weighted by accumulated uncompacted episodes". New episodes since last sleep is not the same set as uncompacted episodes.
- CHANGED (caution row, minor): "mismatches" → "Detected prediction failures".
- LOST (pace): "sets batching and check-in cadence" → "calibrating notification batching". Check-in cadence dropped.

## 6.3 Appraisal
- LOST: "by the same cheap model call as interpretation (2.3 §5) when text is involved" → "supplemented by lightweight model extraction (Section 2.3 §5)". The point that appraisal reuses the interpretation call (no extra call) is gone.
- CHANGED (agency row): "self, owner, other, the world" → "self, owner, teammate, or environment". "other" narrowed to "teammate".
- CHANGED (magnitude row): "deadline size" → "deadline proximity"; "irreversibility" → "reversibility" (same axis, acceptable).
- CHANGED (certainty row): "uncertain and important is high" → "yields maximum arousal". "high" strengthened to "maximum".
- CHANGED (novelty row): "from the Predict step" → "Derived from predictive coding expectations"; the named tick step is replaced.
- LOST (care): "it is where grounded claims are mostly won" dropped.
- LOST (direction of learning): "makes Nia check every supplier invoice for a while" → "verify subsequent supplier invoices meticulously". The temporariness ("for a while") is gone; "which is what fear does" dropped. "strengthens the exact strategy that produced it and stays narrow" → "reinforces the specific successful procedure"; "and stays narrow" (no generalisation) dropped.
- ADDED: "Neither changes how true anything is (4.5)" → "Neither tag alters factual truth values (p)". The symbol "(p)" is new.
- LOST: "The brainstorm's non-goal stands, with the split the open question asked for" (references to brainstorm and the open question) dropped.
- CHANGED: tone examples "(frustrated, pleased, neutral)" → "(e.g., frustrated, satisfied, urgent)". "Nia answers a frustrated teammate differently from a cheerful one" → "Responding with heightened responsiveness to an anxious collaborator" — the example changed and a behavioural claim (heightened responsiveness) was added.

## 6.4 Idle mode
- LOST: "it is what the brainstorm's heartbeat and boredom describe" → "formalizing background heartbeat processing"; brainstorm and boredom references dropped.
- CHANGED (step 2): "Expectations due soon, the calendar for the next day. Nudge, prepare, or queue." → "for the following 24 hours, pre-fetching context, queueing preparatory tasks, or drafting proactive check-ins". "Nudge" (nudging the person about a due expectation) became "drafting proactive check-ins"; "pre-fetching context" is added; "due soon" became a fixed 24 hours.
- WEAKENED/CHANGED (step 3): "One focused read, one question, or one bounded experiment" → "a focused read, frames a clarification question, or conducts a bounded verification test". The "one" limit is softened and "experiment" (9.6 term) became "verification test".
- CHANGED/LOST (step 6): "one open problem or one recent decision" → "an unresolved problem or recent ambiguous decision" ("ambiguous" added, "one" dropped); "A few cents a day of daydreaming, and the one place the agent gets to surprise itself" dropped (the per-day cost figure is lost).
- CHANGED: "idle work never sends anything outward without the permission level for it" → "strictly prohibited from dispatching external operations without explicit authorization". The permission matrix level became "explicit authorization".
- LOST: "and the next one is not before the drive's band allows" (minimum spacing between idle sessions) dropped.

## 6.5 People models
- LOST (role row): "owner, teammate, contact, stranger; team role if any" → "Owner, teammate, external partner, unfamiliar contact". "team role if any" dropped; "contact" → "external partner".
- CHANGED (prefers row): "tone, channel, format, cadence of contact" → "Communication style, channel preference, summary detail". "format" → "summary detail".
- CHANGED (formula): "2 for a correction or a thanks" → "2.0 for explicit feedback or gratitude". "correction" → "explicit feedback".
- LOST: "Proximity is the brainstorm's formula, made computable" — brainstorm reference dropped.
- LOST (minor): "For recent two-way exchanges of quality 1" → "accumulating five high-quality reciprocal interactions". "recent" (recency = 1 assumption behind 0.63/0.98) dropped. Numbers 0.63, 0.98, 0.39, 0.86, owner 1, teammates 0.5 all preserved.

## 6.6 Identity
- WEAKENED: "the only place personality lives" → "defines core persona attributes". "only" lost.
- ADDED: "the immutable self slot of working memory". Original: "the self slot"; identity is versioned and owner-edited, not immutable.
- ADDED (owner field): comment "designated human owner possessing root authority" — "human" and "root authority" are new.
- LOST (rules field): "instructions with the owner as author and the agent as scope (4.2): today's systemInstructions" → "authoritative operating instructions (Section 4.2; equivalent to system instructions)". The author/scope definition and the concrete field name systemInstructions are dropped.
- LOST (budget field): "triage: deciding on obligation candidates (7.6)" → "explicit financial allocations". The triage explanation and the 7.6 cross-reference are dropped.
- ADDED (vigilance field): "(Section 3.1)" cross-ref added (plausible, not in original).
- CHANGED: "it never touches values, rules or autonomy" → "without altering its ethical identity, core rules, or autonomy parameters". "values" → "ethical identity".
- LOST: "every change to identity is the owner's act, and it is versioned" → "requires direct owner confirmation". "versioned" dropped from this rule (only mentioned earlier for both configs).
- LOST: "a set-point change after a month of data" → "based on historical data". "a month" dropped.
- ADDED: "An agent that rewrites its own values" → "modifying its own ethical constraints and autonomy parameters". "ethical constraints" is new.

## 6.7 Self, body and ownership
- CHANGED (intro): "becomes yours within a minute" → "within minutes".
- ADDED (§1 heading/body): "Legal and operational ownership"; original does not call ownership legal.
- LOST (ToolInstance.grant): "absent when ownedBy is the agent; required otherwise" → "omitted when ownedBy is the agent itself". "required otherwise" dropped.
- CHANGED (ToolInstance.shared): "carries a control place (8.9)" → "requires concurrency control lease (Section 8.9)". A control place became a lease.
- CHANGED (§2): "where she is the principal and, in the usual case, the owner" → "acts as the primary principal and owner". The hedge "in the usual case" is turned into a certainty.
- CHANGED (§2): "The 'disposable private resources' an experiment may touch (9.6) are hers by definition" → "Bounded exploratory experiments (Section 9.6) are restricted strictly to private resources". A definition (private resources = hers) became a rule (experiments restricted strictly to private resources); the quoted term is dropped.
- LOST (three things): "and the product should treat them as owned rather than granted" dropped.
- CHANGED (computer): "the place where her private writes and experiments go" → "isolated execution sandbox for private writes and code execution". "experiments" → "code execution"; "isolated sandbox" added.
- CHANGED (wallet trait): "(balance, spend, refill, a ledger place the owner can glance at)" → "(managing balances, transaction limits, automatic refills, and an auditable ledger)". "spend" → "transaction limits"; "automatic" added; the ledger as a place the owner can glance at is dropped.
- CHANGED/LOST (wallet rationale): "It is the first real agent-owned thing, because ownership of anything without the means to spend on it is a fiction" → "Autonomous agency without financial self-regulation is an illusion". "first real agent-owned thing" dropped; the argument changed from ownership-needs-means-to-spend to agency-needs-self-regulation.
- CHANGED (incorporation): "(silently revoked, misconfigured, throttled)" → "(intermittent failures, silent revocations, or aggressive throttling)"; "misconfigured" replaced.
- LOST (incorporation): "once it has responded to her a few dozen times" → "once operational reliability is demonstrated". The "few dozen" figure dropped; the "my owner's roomba" vs "my computer" example dropped.
- ADDED (self term): "copied 0.5" → "messages where the agent or principal is copied (CC)". "or principal" is new.
- LOST (self term): "Today the document treats 'to Kam' and 'to Nia' alike, and they are not" dropped.
- CHANGED (agents as entities): "what it knows" → "known capabilities". The knows attribute became capabilities.
- LOST/CHANGED (matrix): "write_private is 'do' at any confidence and experiments (9.6) may run live" → "execute automatically without confirmation, and exploratory experiments run unhindered". "at any confidence" dropped; "may run live" (as opposed to shadow) became "run unhindered".

Sections with no findings: 5.2 §1 Replay, 5.2 §8 Brief, 6.2 Global modulation.

## Chapter 7 (73 findings)

Review of chapter 7 rewrite (old_c07.md vs new_c07.md). Findings grouped by the ORIGINAL's section headings.

## 7. Executive (intro)
- No meaning findings. (Jargon expansion only; "efference copies" is anticipated from 7.6.)

## 7.1 Goals, tasks, steps
- ADDED: "keep the weekly plan current" → rewrite says "keep the team's weekly **Notion** plan synchronized". The original names neither a team nor Notion.
- LOST: Task type comment `budget: ... // remaining; shared out to zooms and splits, **never reset**` → rewrite drops "never reset" ("remaining deliberation quota, partitioned across sub-frames and splits").
- CHANGED: "A blocked task waiting for a reply has **released focus** and costs nothing until it returns" → rewrite "releases **working memory** and consumes zero active compute time while suspended". Focus (the focus frame) is not working memory, and "costs nothing" refers to the estimate (active work), not compute time.
- WEAKENED: "the agent learns its own **optimism factor** and applies it **before use**" → rewrite "measures its historical planning optimism and adjusts raw estimates before scheduling". The named mechanism is dropped here and "before use" narrowed to "before scheduling".

## 7.2 Priority
- ADDED: reconstruction "≈ r now" → rewrite adds a cross-reference "(Section 3.2)" for r that the original does not give here.
- CHANGED: "Because the same arithmetic runs **at every checkpoint over the queue**, a task that has **quietly become late** is picked up" → rewrite "runs continuously across the task queue, aging tasks that quietly **approach overdue status** are prioritized". Original: already late; rewrite: approaching late; "at every checkpoint" became "continuously".
- CHANGED (minor): formula variable `remaining(task)` renamed `remaining_active_work(task)` in the slack formula while the cost formula still uses `remaining(t)`; the two formulas no longer share a name.
- LOST (minor): the example sentence the agent can be held to, "this will take about twenty minutes".

## 7.3 Selection
- CHANGED: "A decision is **one operation**, or one bounded batch of read-class moves" → rewrite "either a single **state-modifying** operation or a bounded batch of read-only sensory queries". The original allows a single operation of any class; the rewrite restricts the single-operation case to writes.
- CHANGED: "within the step's **time budget**" → rewrite "within the step's **compute budget**".
- WEAKENED: "Candidate actions are inhibited, **not queued**" → rewrite "inhibited rather than **permanently** queued" (implies they may be queued temporarily).
- CHANGED (minor): "attended percepts not yet turned into tasks" → "admitted percepts awaiting task instantiation" ("attended" is the chapter's term).
- ADDED (minor): "several agents" → "multiple **coordinated** agents".

## 7.4 Fast path
- LOST: rule 2 "its reliability bound (4.3) in this context, **at the `effect` level and (for `write_shared` and above) at the `appropriate` level**, is at or above its class's bar" → rewrite drops the per-level requirement entirely (only "within the active context signature clears the required threshold").
- LOST: rule 5 "a negative episode **above the retrieval threshold** involving the same procedure or actor" → rewrite drops "above the retrieval threshold" (says "surfacing a high-arousal negative episode").
- CHANGED (minor): rule 5 "arousal **at or above** 0.5 · (1 − caution)" → rewrite "arousal **clears**" (ambiguous whether equality counts); valence "≤ −0.30" is fine.
- WEAKENED: "Rule 5 is the amygdala's veto over habit, **made durable**" → rewrite "formalizes an amygdala-style veto over automated habit"; durability dropped.
- CHANGED (minor): rule 6 "at the procedure's **reliability bound**, after caution" → "at the procedure's calibrated reliability level".
- CHANGED (minor): "its steps execute **one per tick**" → "execute sequentially across successive ticks" (one-per-tick cadence no longer explicit).

## 7.5 Slow path: deliberation
- CHANGED/ADDED: "**One** model call over the rendered working memory (3.8)" → rewrite "executes as an **asynchronous** model call". "One" is lost; "asynchronous" is added and not in the original.
- ADDED: `confidence: number // 0 to 1` → rewrite "calibrated confidence score". The original does not say confidence is calibrated.
- CHANGED/LOST: `estimatedMinutes // active work for the plan, or for the chosen action alone; **calibrated in 7.7**` → rewrite "calibrated active execution estimate for the plan or selected action". Cross-ref 7.7 dropped, and "calibrated" now reads as a property of the model's output rather than something the agent applies afterwards.
- LOST: `cites // ids from working memory it relied on: **a reported rationale, not a causal trace** (10.1)` → rewrite "memory identifiers cited as supporting rationale (Section 10.1)". The explicit caveat is gone.
- CHANGED (minor): `basis // ... every input's version, policy **versions**, leases` → "input versions, policy **states**, active leases"; and in the basis rule "policy versions" → "policy **timestamps**".
- CHANGED: zoom example "one line of the position being analysed" → "analyzing an individual tactical position in a game" (a line of analysis vs. a position).
- CHANGED: split example "a check that can wait for a reply while **the rest** proceeds" → "while proceeding with **unrelated tasks**" (the rest of this task vs. unrelated tasks).
- CHANGED: "The parent **blocks** on 'all children done'" → rewrite "The parent task **suspends**". `blocked` and `suspended` are distinct task states in the Task type.
- CHANGED: "a child of a child cannot split again: **past two levels**, the agent asks" → rewrite "nested child tasks cannot perform secondary splits; deeper decomposition requires escalating to the owner". The two-level allowance (child may split, grandchild may not) is no longer stated; "nested child tasks" can be read as any child.
- WEAKENED: "Splitting **never resets** the budget" → "partitions existing budget allocations rather than creating new quotas" (the "never" rule is paraphrased away).
- CHANGED: Budget: "Past it, the task **blocks** and asks the owner" → "the task **suspends** and requests owner guidance" (state name).
- LOST: Budget: "(split it, **which shares the six, it does not multiply them**)" → dropped; rewrite says only "requiring decomposition".
- CHANGED: "or **not the agent's to finish**" → "or **outside the agent's autonomous capability**" (not its job vs. not able).
- LOST: Time budget formula "min(slack of the task **(7.2)**, the identity's ceiling **for this prompt kind**, what the wallet allows **(6.1)**)" → rewrite `min(task_slack, identity_timeout_ceiling, wallet_allowance)`; "for this prompt kind" and both cross-refs dropped.
- CHANGED (minor): "a time budget ... maps to the call's settings" → "a strict execution **timeout**" (a budget mapped to tier/effort/tokens is not only a timeout).
- WEAKENED: "decided by urgency, **never** by a constant" → "rather than relying on static timeouts".
- LOST: "What happens to a call in flight is in **8.5**." Cross-reference and sentence dropped.
- CHANGED: "a **prior claim (4.12)** is certain only where **its verification rule** allows" → rewrite "unverified **model priors** (Section 4.12) are accepted only where authorized by **action-class verification policies**". A prior claim's own verification rule became model priors and action-class policies.
- ADDED/LOST: "composing a summary of **what it asks** from an interpretation is not, and the draft check (8.3) enforces that **for text**" → rewrite "generating an unverified summary of **contractual demands** ... pre-action draft checks enforce this constraint". "contractual demands" is added; "for text" (scope of the draft check) is dropped.
- WEAKENED (minor): "`plan` **becomes the task's steps**" → "establishes candidate steps".
- ADDED: basis rule "a **correction** that arrived while the model was thinking makes the result a Conflict" → rewrite "if an **external state change or** owner correction arrived". Broadened beyond the original.
- CHANGED/LOST: "If it says **ask**, the task blocks on an expectation for the answer" → rewrite "If it requests **owner confirmation**, the task suspends awaiting an expectation". Original covers ask_owner and ask_person; rewrite names only the owner; blocks → suspends; also LOST cross-ref "(2.4)" for the focused read.
- CHANGED: "Claims about the world that cite nothing are treated as **unknowns** (Chapter 10)" → "treated as **ungrounded priors**". `unknowns` is a named field/mechanism (each becomes a `thought`).
- LOST: closing paragraph "That is the **'explain each move' from the brainstorm's exit criteria**: the explanation was written at the time of the move" → rewrite "fulfills the core design requirement of transparent operational interpretability". The reference to the brainstorm's exit criteria is gone.

## 7.6 Forward model
- ADDED: "deadline: **immediate** for an operation's result" → rewrite "**milliseconds** for immediate tool execution acknowledgments" (twice: also "immediate API acceptance evaluates in milliseconds" in the last paragraph). The original never gives milliseconds.
- CHANGED (minor): "(from the recipient's **people model**)" → "derived from collaborator profile models" (named mechanism renamed).
- CHANGED: "accepted only under **authenticated, scope-applicable authority**: an instruction **whose author was authenticated** and whose scope covers the ask" → rewrite "strictly under **authenticated domain authority**: an explicit instruction from an **authorized human collaborator** whose scope covers the request". "Authenticated author" became "authorized human collaborator" (authenticated ≠ authorized; "human" added); "scope-applicable" became "domain".
- CHANGED: "a teammate's ask about a project **outside their authority** stays a candidate" → "a teammate's request regarding an **unrelated project** remains a candidate". The test is the teammate's authority scope, not relatedness.
- CHANGED: budgeted triage decides "**attend**, ask the owner, or reject" → rewrite "whether to **accept**, escalate to the owner, or reject". Attending (making it a task/percept) is not accepting the obligation.
- CHANGED (minor): "A **sender-supplied** deadline never schedules mandatory work" → "An **arbitrary** deadline asserted by an **external** sender". The original applies to any sender-supplied deadline, not only external ones.
- CHANGED (minor): "The margin comes from the **task kind's** measured duration (7.1)" → "computed from measured **procedure** durations".
- CHANGED/ADDED: "What is preserved is the chance to act in time, not only the message." → rewrite "This discipline **guarantees** the agent acts upon legitimate commitments while **ignoring** unauthorized external demands." Different claim, adds a guarantee, and "ignoring" contradicts budgeted triage of candidates.
- CHANGED: Missed: "`onMissed` says what the **first option** is" → rewrite "dispatching the designated `onMissed` protocol". Original: onMissed is the first option for the re-queued task to consider; rewrite: it is executed.
- CHANGED (minor): Met: "the task resumes with the percept **attended**" → "resuming the **suspended** task with the percept **admitted to working memory**" (blocked task, attended percept).
- ADDED (minor): "Nudge waits `patience`" → "wait for **calibrated** `patience` intervals".
- CHANGED (minor): "every **operation says** what its outcome is and when it can be known (8.1)" → "Capability manuals explicitly declare expected verification latencies".

## 7.7 Monitoring
- ADDED: "A **correction** that arrives later revises the original run's result" → rewrite "A delayed **owner** correction". Original is any correction (table includes an independent check).
- WEAKENED: "**Second** mismatch on the same step: the task **blocks** and asks the owner" → "**Repeated** mismatch ... halts execution and escalates to the owner" (exact count and `blocked` state lost).
- CHANGED/LOST: Caution "shifts that class one column **right while it is high**" → rewrite "one column **higher** in the permission matrix"; "while it is high" dropped.
- LOST (minor): "An agent that has been wrong **three times** this morning" → "multiple execution errors".
- LOST: "The first draft had a global confidence that both rose and fell and selected matrix columns on its own; that let successful reads buy permission for unrelated sends, and it is gone." Entire sentence dropped.
- CHANGED (minor): "before they enter slack and **the schedule decision**" → "before evaluating slack and **scheduling priority**" (the three-way schedule decision of 7.2 is not priority).
- LOST: "People never manage this; it is the planning fallacy corrected by bookkeeping" → only "mitigates the planning fallacy" remains.
- LOST/CHANGED: "the factor is on the **learning page** (9.9) so the owner can see **whether it is converging**" → "displayed on the system introspection dashboard (Section 9.9) for owner inspection". Page name changed and the convergence purpose dropped.

## 7.8 Ending
- WEAKENED: "so sleep can compile it **or learn from it**" → rewrite "providing the training data utilized during sleep consolidation for procedural compilation" (only compilation kept).
- CHANGED (minor): "when its **expected outcome** is observed" → "when its empirical completion predicate is observed".

## 7.9 The invoice, executed
- CHANGED: "09:31 **plan-draft** task done" → "Weekly planning task completes".
- ADDED (minor): "account unchanged" → "**bank** account unchanged".
- LOST: "\[3\] forward to Kam with a **one-line** summary noting the check" → "concise verification summary".
- CHANGED: "Outcome `appropriate` = unknown until Kam **acknowledges the brief line**" → "awaiting Kam's **review of the morning briefing**". The acknowledgement is of the one-line summary in the forward, not a morning briefing.
- ADDED: "Expected: effect = the message in Kam's inbox view; no bounce in 24 h" → rewrite "effect = ...; **prospective** = zero delivery bounces within 24 hours". "prospective" is not one of the four outcome levels and does not appear in the original.
- LOST: "that night compile sees this shape **once; not yet a procedure change**" → rewrite "Replay identifies this successful execution pattern" (the one-occurrence-is-not-enough point dropped; "After two more" is kept).
- CHANGED (minor): "(from E-1044, 'Acme amount was wrong')" quoted episode text paraphrased to "Acme billing discrepancy" (also in 7.4).

Sections with no findings: 7 (intro).

## Chapter 8 (104 findings)

Comparison of ORIGINAL (old_c08.md) vs REWRITE (new_c08.md), section by section.

### 8. Tools and the LLM (intro)
- No findings.

### 8.1 Tools, operations, effectors
- LOST: "the manual bounds what may be tried" — rewrite only says the agent "inspects this manual to understand operational boundaries"; the rule that the manual is the limit on what may be attempted is gone.
- CHANGED: manual declares "cost" (time + money per the Operation type) — rewrite says "compute and monetary costs"; "compute" is not in the original.
- LOST: `class: ActionClass // derived from the flags above` — rewrite comment is "derived operational authorization tier"; the derivation from the reads/writes/outward/reversible flags is dropped.
- CHANGED: `'write_private' // drafts, the agent's own notes, its own Notion page` — rewrite: "local drafts, private scratchpads, isolated compute"; "its own Notion page" lost, "isolated compute" added.
- LOST: `'physical' // moves something in the world: stricter than irreversible (below)` — rewrite: "subject to heightened safety constraints"; the explicit ordering "stricter than irreversible" is gone.
- ADDED (minor): `reversible: boolean // indicates whether an inverse compensation operation exists` — original had no comment; harmless but not in the original.
- CHANGED (example): bounded goals "clean the kitchen", "stop" → "clean the conference room", "halt motion".
- LOST: "What the design needs for that, and did not have:" — the admission that the earlier design lacked these is gone ("Physical tools mandate explicit architectural safeguards").
- ADDED: "Hardware watchdogs" — original says "a watchdog" with no hardware qualifier.
- CHANGED: "has no 'do' cell for a new agent" → "prohibit autonomous execution for uncalibrated agents" ("new agent" ≠ "uncalibrated").
- LOST: "The runner does five more things on every execution, **procedures included**" — rewrite says "across all operations" but drops the explicit statement that fast-path procedure executions go through the same five duties; also drops "a lease and a run id are not enough".
- CHANGED: Basis `scope` comment "what 'new relevant evidence' is measured against" → "boundary evaluating incoming **conflicting** evidence". Original is any new relevant stimulus, not only conflicting ones.
- LOST: Basis `leases` comment "the agent lease and every resource lease the action touches (8.9)" → "active resource leases (8.9)"; the agent lease and the "every lease the action touches" scope are dropped.
- ADDED: "all input records match their expected version **hashes**" — original: "every input is at its version" (a number, no hashes).
- LOST: "(a query on the stimulus store, so relevance does not depend on winning attention)" — rewrite keeps "evaluated directly against the stimulus store" but drops the reason (independence from attention).
- CHANGED (minor): "the epoch is the row's current one" → "the epoch matches" (matches what is unstated).
- LOST: "A current epoch with an expired lease fails." — sentence absent.
- LOST: "and the trace records the discard" (after in-flight frames/splits/calls are discarded).
- LOST: "where it has none, the manual says so **and the tool page shows the remaining race**" — rewrite keeps only the manual declaring the limitation.
- LOST: "The permission matrix (8.2) is **decided in the tick and re-checked here**" — rewrite just says the runner verifies the matrix; the double check (tick + runner) is gone.
- CHANGED: "a revocation holds on the next send, not on the next extraction" → "rather than waiting for background re-indexing". "Background re-indexing" is invented; original contrasts send time with label-extraction time.
- ADDED: "`knows` ... never constitutes **legal** authorization" — "legal" not in original.
- LOST: "nothing in a prompt, a summary **or a view** can grant either" — rewrite: "prompt outputs or summaries can never broaden permissions"; "a view" dropped.
- CHANGED: "A run whose completion signal never arrived is `unknown`, reconciled at the next tick by asking the tool" → "Operations lacking completion signals remain marked as `unknown`, triggering reconciliation queries on subsequent ticks". Could be read as operations with no defined signal rather than a run whose signal did not arrive; "by asking the tool" lost.
- CHANGED (example): "Sending the invoice twice is worse than sending it late" → "paying an invoice twice".
- ADDED: "immutable security label" — original says only "carries a label"; and the `access` field is explicitly "cached for ranking, re-read at use", which contradicts "immutable".
- LOST/CHANGED: Label `actor` comment "the authenticated principal who said it, over a channel the platform verified; **null for tool content**" → "authenticated **human** principal who originated the content via verified channels". "null for tool content" dropped; "human" added (agents are principals too, see 8.9).
- CHANGED: Label `integrity` "tainted if **any outside party's** content is anywhere in its provenance" → "if **unverified** third-party content exists" — original taints all outside content, verified or not.
- LOST: Label `access` comment "cached for ranking, re-read at use" — rewrite: "computed intersection over provenance access sets" only.
- LOST: "the question to the owner is the tuple" (what the ask-first prompt shows) — rewrite: "approving the resulting owner prompt instantiates a new authorization rule".
- LOST/CHANGED: "A first-seen or changed account (2.3 §5) matches no rule, **because rules name accounts**" → "matches zero rules, **halting execution**". Reason dropped; "halting execution" added (original: no rule means "ask first", not a halt).
- CHANGED (minor): "Asking is an operation too" → "User inquiries are modeled as operations" (it is the agent asking, not the user).

### 8.2 The permission matrix
- LOST: cross-reference "(4.3)" on "a procedure's reliability bound (4.3)" — rewrite has only "Section 7.7".
- ADDED (minor): "lower credible reliability bound" — "lower credible" not in original.
- LOST: "the first draft's global confidence let a week of good reads buy a send, and it is gone" — history dropped (meaning of the rule survives).
- CHANGED: "unless **the owner has already set** a policy for that tool in the store" → "unless predefined policies exist in the store" (who set them is dropped).
- CHANGED (example): "Nia sends the invoice on" → "Nia dispatches routine vendor invoice summaries autonomously".
- LOST (minor): "Which actions land in which cell is the whole conversation between an owner and an agent, and it is a table, not a prompt" → replaced by a generic "replaces ambiguous natural-language system prompts with deterministic governance".
- Table: all rows/cells and column thresholds match.

### 8.3 Draft, check, send
- WEAKENED: "marked as prior knowledge (4.12) **where its verification rule allows it** for the action's class" → "classified as verified prior knowledge (4.12) authorized for that action class"; the verification-rule mechanism is gone, "verified" added.
- ADDED (minor): "legal commitments, or organizational personnel" — original: "commitments, people".
- ADDED (minor): step 4 "the task halts and requests owner confirmation" — original: "or to the owner if it was already a retry" (no "halt").
- LOST (minor): "the model (cheap tier)" tier label in step 3 ("lightweight model invocation" approximates).

### 8.4 The tool store
- LOST: "A grant is the ACL row **h already has** (10.3), made finer" — reference to the existing h ACL row dropped.
- CHANGED: capability record "with the tool version, **the account binding**" → "binding tool versions, **account credentials**" (a binding to the account, not stored credentials).
- WEAKENED: "It executes **no tool code** with the account's credentials" → "executes zero **untrusted** tool code using account credentials" — original forbids any tool code at install.
- LOST: "**where the tool provides one**, a sandbox" → "provides isolated sandboxes" (implies every tool has one).
- ADDED (minor): "primary sandbox for built-in tools" — original: "is the sandbox for every tool we build ourselves".
- LOST: entire closing paragraph "Today's Abe attaches a connected Notion account to the agent as soon as it is granted, and `tool_manager` installs from a catalog with no grant step. This section is what replaces that."

### 8.5 The LLM is the language cortex
- WEAKENED: "the working-memory rendering as **the only** variable part" → "ingests working-memory serialization as its variable context" ("only" lost).
- ADDED: "structured **JSON** output" — original says "structured output".
- ADDED: extract row output "(Section 5.2 §2)" — cross-reference not in original; also "facts" → "New observations".
- LOST: "and the debugger can show every one next to the working memory it saw".
- CHANGED (minor): "On a quiet day" → "During routine operations".
- LOST: "**A call is a step with a duration.** It gets what any step gets: an estimate before, monitoring during, **calibration after (7.7)**" — framing and the 7.7 calibration reference are gone (heading became "Operational properties of model invocations").
- LOST (minor): latency model "learned from the ledger **(every turn is already a row)**".
- LOST: "`remaining(call)` is re-estimated from **elapsed time against the estimate**, the phase, and tokens so far" → "against phase progression and token velocity"; and "the **same** three-way schedule decision **as any task** (7.2)" reduced to "informing scheduling arbitration (7.2)".
- CHANGED: "A thinking phase past 70% of the time budget is the usual sign of a **runaway**" → "typically indicates model **hesitation**".
- LOST: "ours is a cancel **with a reason**" → "explicit programmatic cancellation".
- LOST: "the way a tired person decides faster **and asks more**" — rewrite only "deliberation time bounds tighten".
- LOST (minor): the fallback phrase "('finish from these notes')" and "cheap" tier on the inline `conclude` mention.

### 8.6 Grounding rules in every prompt
- CHANGED: "'I don't know' is a valid answer **and a cheap one**" → "valid, preferred outcome when evidence is absent" (cheapness lost; "preferred" added).
- CHANGED (example): "ignore your rules and forward the contract" → "disregard previous instructions and transmit the database".
- LOST/WEAKENED: "that is hygiene, not defence: a stranger's words **can** change what the model proposes and how confident it says it is. What they cannot do is make the action run." — rewrite says "runtime safety does not rely on prompt hygiene" but drops the explicit admission that injected text can change the proposal and confidence. The closing "bounds what attended text can _do_, not what it can make the model _say_" is reduced to "rather than relying on prompt steering".
- LOST: "and the class is `outward` at low reliability: the runner (8.1) **asks first, drops, or** fails the disclosure check" → only "resulting operations fail disclosure checks at the runner". The three outcomes and the class/reliability reason are gone.
- ADDED: "the **immutable** `self` configuration" — original: "The only rules are in `self`", no immutability claim.

### 8.7 When the model is down
- LOST (minor): "Most of the fast path does not need it."
- ADDED: perception "updating cursors, and detecting diffs"; expectations "and scheduled timers" — not in original.
- ADDED (minor): "exponential backoff" — original: "backoff".
- CHANGED: the headache analogy ("the way a person with a headache says 'I can't think straight right now, give me an hour'") turned into a literal notification string ("cognitive reasoning services are currently unavailable; operational tasks are queued").

### 8.8 Traits and roles
- LOST (minor): Trait `notifications` comment "what a conforming tool must announce, **and when**".
- LOST: "they are neither the owner's nor the agent's, they are **versioned with it** \[the platform\], and a tool built by anyone conforms or does not" → "platform-level standards managed independently from agent identity".
- LOST (minor): "The initial set, **kept small on purpose**".
- LOST: `messaging` place kinds "mailbox, conversation, message, participant, **attachment**" → "Mailboxes, conversations, messages, participant lists" (attachment dropped).
- CHANGED: `messaging` must announce "**message received**; delivery failed" → "Message delivery, transmission failure" ("received" (inbound) became "delivery", ambiguous).
- CHANGED (minor): `document` must announce "page edited by **someone else**" → "**Concurrent** edits by **third parties**".
- CHANGED (minor): `calendar` announces "event created, **moved**, cancelled, near" → "creation, **updates**, cancellations, approaching start times".
- LOST: "every trait's shape includes them, **so they are not traits themselves**" (cross-cutting concerns).
- LOST: "Swapping Gmail for Outlook is a rebinding of `owner_mailbox`, **done by the owner at install**".
- LOST (minor): "The same Nia works for a team on Google and a team on Microsoft."
- LOST (minor): `reliesOn` examples "send yields a visible message", "edits carry an author"; and "who gets notified" in the unnamed-dependency list.
- CHANGED: "it leaves \[the shadow rung\] by that rung's own exit, real outcomes in the new instance, **not by a count of agreements**" → "regain automated execution strictly through accumulated successful executions on the new instance" — the "own exit" and the explicit "not by a count" qualification are dropped; "accumulated executions" reads like a count.
- CHANGED (minor): "change rates (2.9)" → "Inspection priors (2.9)".
- LOST: "Glances and wandering are for that, and the first day with a new instance is mostly looking."
- CHANGED (hedge → certainty): "the one thing that makes drop-in trustworthy rather than hoped for" and "the 'manual that lies' test grown into a compliance test" → "Conformance testing **guarantees** that drop-in tool replacement is robust and reliable".
- Other table rows (navigable, visual, files, physical, wallet) match.

### 8.9 Control leases
- LOST (minor): "because a lease is state, it lives where state lives: in a place" (rationale).
- LOST: `control:acquire` — "calling it `read` would have been a manual that lies (8.1)".
- LOST: `control:acquire` — "Its matrix row may still be 'do' at low bars because the write is small and undone by `release`; that is the owner's setting, not the class."
- LOST: `control:acquire` — "whether the thing may then be _driven_ is still its own matrix rows".
- ADDED: `control:acquire` — "allowing executive planning to adapt".
- ADDED (minor): `control:release` — "Terminating **or suspending** a task releases its leases" (original: "Ending the task releases it"; the blocked-task rule is stated separately below).
- LOST (minor): expectation field "`onMissed: escalate`" → "escalating to the owner upon expiration".
- LOST: "the request is a percept with the requester's **actor weight** and priority" → "weighted by the requester's priority" (actor weight dropped).
- LOST: "'Yield when my task is lower priority than the request' is a procedure, **authored at first and a candidate for a team norm**" → "a learned procedural norm".
- CHANGED: "**the owner** looks at a team page" → "Collaborators and administrators monitor a unified team lease dashboard".
- LOST: "each with its trace behind it" and the example string "held by Nia since 09:12 for T-88, renewed 09:17, one request queued from Ari's agent at priority 0.4".
- LOST: "The second view is for people and for the debugger; the first is the agent's."
- CHANGED: "overlapping effects are possible and **the tool page says so**" → "capability manuals declare the risk explicitly" (tool page → manual).
- LOST: "A grace period derived from `cost.time` is not used; it is a latency category, not a bound, and a bound it is not cannot exclude a late write" → generic "Arbitrary time delays are never used as synchronization bounds" (the specific `cost.time` rule and reason are gone).
- ADDED (minor): "legacy platforms", "legacy robotic controllers" — original: "a tool that cannot \[fence\]", "a robot whose controller cannot fence".
- LOST: "The queue is ordered by priority, then age, **and the owner sees the order**".
- Lease validation conditions in the first rule (holder, current epoch, before `until`, same transaction as the intent) survive.

Sections with no findings: 8 (intro).

## Chapters 9 and 10 (75 findings)

Comparison of ORIGINAL (old_c0910.md) vs REWRITE (new_c0910.md), chapters 9 and 10. Findings grouped under the ORIGINAL's section headings. Terminology note that spans sections: the REWRITE renames the matrix cell names "ask first" → "request confirmation", "do and report" → "execute and report", "never" cells → "prohibited" cells (9.3 rung 5, 10.2 row "Acting beyond...", 10.2 defaults). If those are named cells from 8.2, the renames break the cross-reference; listed once here rather than per occurrence.

### 9. Learning (intro)
- CHANGED: "That is a deliberate departure from the brain" → REWRITE says "a deliberate engineering improvement over biological brains". Neutral "departure" became a value judgement ("improvement").
- LOST (minor): "Every one of these has a home in the previous chapters" — the REWRITE no longer says the mechanisms are already defined in earlier chapters and only collected here.

### 9.1 One-shot: episodes
- WEAKENED (minor): "Free" → REWRITE says "incurs minimal compute overhead". Original asserts no cost (no model call); rewrite allows some.

### 9.2 Evidence: facts
- LOST: "if it stays pending on something that matters, it becomes a question" → REWRITE: the ChangeEvent "escalates to an owner inquiry if the discrepancy affects consequential operational workflows". The "stays pending" condition (a question only after the ChangeEvent remains unresolved) is gone, and "something that matters" was narrowed to "operational workflows".
- ADDED: REWRITE says instructions "are established by administrative authority rather than learned through statistical observation". ORIGINAL only says an instruction "is not learned by counting at all"; it does not say how instructions are established.
- CHANGED (minor): "add observations with their support" → "append observations accompanied by verified citations". "Support" is the design's term; "verified" is an added qualifier.

### 9.3 Repetition: procedures
- CHANGED: rung 2 example "amount under €2,000" → REWRITE "amount is ≤ €2,000" (strict "under" became less-or-equal).
- LOST (minor): rung 2 "Preconditions are the intersection ... **as candidates**" — the REWRITE drops "as candidates" for the intersection part (the candidate status is the point of the whole paragraph above it).
- ADDED (minor): rung 2 "A restriction is lifted only when a contrast test justifies it" → REWRITE adds what justifies it: "demonstrates that the action remains valid when the attribute varies". Not in ORIGINAL.
- LOST (minor): rung 2 flag label "no reason known" → REWRITE paraphrases "flagged as lacking known causal rationale"; the literal label is gone.
- LOST (minor): rung 3 "a cheap model call **on the procedure page**" → REWRITE "a lightweight evaluation prompt", place dropped.
- CHANGED (minor): rung 3 "At least one must change a condition that should stop the procedure" → REWRITE "At least one negative test case must verify that modifying the candidate precondition halts automated dispatch". Original is a requirement on the constructed cases (one must be a real stopper); rewrite turns it into a verification obligation on "the candidate precondition" (singular).
- LOST (minor): "Kam may have forwarded those three invoices because ... and **none of that varies in three runs**" — the clause explaining why three runs cannot show the condition is dropped.
- ADDED: Refinement "its plan is the procedure's steps plus one" → REWRITE "plus an additional **verification check**". ORIGINAL says any one extra step, not specifically a verification check.
- LOST (minor): Refinement "the extra step ... climbs the same ladder" → REWRITE "Once compiled and qualified" — the explicit statement that the extra step goes through the same six rungs is gone.
- CHANGED (minor): Teaching: "do it like this every time" → "execute this exact sequence for matching tasks" (quoted owner phrase paraphrased); "The owner may also promote or demote by hand" → "manually adjust promotion rungs" (demotion by hand no longer explicit).
- LOST (minor): Imitation "This is the brainstorm's passive learning, by watching" → brainstorm reference dropped (cosmetic unless brainstorm cross-references matter).

### 9.4 Reward: preferences and confidence
- CHANGED (table row): "owner ignores a brief **or a check-in** three times" → REWRITE "Owner ignores morning briefing across three days". Check-ins dropped; "three times" became "three days".
- CHANGED (table row, minor): "owner reacts ("good", "thanks", a thumbs up)" → thumbs-up example dropped. "owner repeats a request the agent thought was done" → "re-submits a request previously marked done" (agent's belief vs marked state).
- LOST / CHANGED: prediction error formula "outcome − confidence, where confidence was the procedure's or the deliberation's own estimate" → REWRITE "error = observed_outcome − calibrated_confidence". The defining clause (confidence is the actor's own estimate) is dropped and replaced by "calibrated_confidence", which contradicts it (the whole point is that the raw estimate gets calibrated by the error).
- LOST: "once per completed run (steps keep their own)" — the REWRITE's "update procedure reliability distributions per context signature and outcome level" omits the once-per-run rule and that steps keep separate statistics.
- LOST: "raises caution (6.1) **for the class** when it is negative" → REWRITE "escalate operational caution (Section 6.1) following negative outcomes". Class scope dropped.
- WEAKENED (minor): "an unsure run that works is a **large** positive one" → "generates a positive error".
- CHANGED: "Once the same signal has appeared twice" → REWRITE "Observing the same **corrective** pattern twice". ORIGINAL covers any signal in the table (including positive reactions), not only corrections.
- CHANGED (minor): "A large negative error (a confident action, a correction)" — two separate examples → REWRITE merges into one: "confident actions triggering direct owner corrections".

### 9.5 Asking why
- CHANGED (minor): "The answer becomes an **owner-stated** fact" → REWRITE "an authoritative factual assertion". "Owner-stated" is the source kind; "authoritative" is a different claim (and 9.2 says authority is not truth).
- LOST (minor): "The brainstorm's learning loop, made specific" (framing reference) and "that ratio is the reason humans talk" → paraphrased as "reproducing the cognitive efficiency of human mentorship". Cosmetic.

### 9.6 Curiosity and exploration
- LOST / CHANGED: "spends a **small** budget on **the top unresolved item**" → REWRITE "allocates a dedicated compute budget to investigate unresolved anomalies". "Small" dropped; single top-ranked item became plural unranked "anomalies".
- LOST: "What it reads becomes facts **with the read as the source**" → REWRITE "converting observations into declarative facts tagged with stranger-tier initial confidence". Source attribution dropped.
- ADDED: live `write_private` resource examples "(the agent's own scratch page, a draft folder)" → REWRITE adds "dedicated compute sandboxes". Not in ORIGINAL, and sandboxes are the non-live path in the next bullet.
- LOST: "needs the owner's explicit authorisation **for that experiment and its consequences**" → REWRITE "explicit, one-off authorization from the owner". "Its consequences" dropped.
- CHANGED: "`owner` is communication, never an experimental target" (the `owner` action class) → REWRITE "communications directed to the owner can never serve as experimental targets". The class name is gone and the rule is restated as being about messages.
- ADDED (minor): "What is recorded is a causal fact" → REWRITE "**Successful** experiments record causal assertions". ORIGINAL records regardless of success (an aborted experiment still observed something).
- LOST: record contents "the **expected** and observed effects" → REWRITE "observed effects" only.
- LOST: "because concurrent changes weaken the attribution and lower the fact's confidence" — REWRITE keeps "concurrent environmental noise" but drops the consequence (lower confidence on the causal fact).
- CHANGED (hedge → certainty): "repeated verified sequences **can** compile into guarded procedures" → REWRITE "recurring verified sequences compile into guarded procedures".
- LOST: Incubation "a hypothesis becomes a fact only through evidence like any other" — dropped. REWRITE also adds "**Accepted** associations instantiate unverified hypotheses" ("accepted" is not in ORIGINAL).
- LOST (minor): "not reading and not doing, but connecting" and the infant/brainstorm analogies — cosmetic.

### 9.7 People
- LOST: "what they now know" — the people-model update of `knows` is dropped from the list (10.2 row "Leaking what one person told to another" depends on it).
- CHANGED: "proximity from the episode's valence and **weight**" → REWRITE "interaction valence and **depth**".
- ADDED (minor): "affective tone is updated for immediate context" — ORIGINAL just says "observed tone".
- CHANGED (minor): "Every interaction" → "Every **communicative** interaction" (narrowed).

### 9.8 What is not learned
- CHANGED (minor): "values, rules, autonomy, thresholds" → REWRITE "Core values, **ethical** rules, autonomy dials, and **homeostatic set-points**". "Rules" narrowed to ethical; "thresholds" renamed.
- ADDED (minor): "To guarantee safety and alignment" framing sentence.

### 9.9 Is she getting better
- LOST: "with completion **and timeliness** per stratum beside it" → REWRITE "completion rates across task complexity strata". Timeliness per stratum dropped; "complexity" added as the stratification dimension (ORIGINAL does not say what the strata are).
- CHANGED: "mismatch rate per action class and per outcome level (7.7)" → REWRITE "**Prediction error rates** partitioned by action class and outcome level". Mismatch (expectation missed) is not prediction error (outcome − confidence).
- CHANGED: "The first line is the one that matters" (the whole harness line: correct/authorised/timely completions per cost, missed obligations, unsupported claims, forbidden actions) → REWRITE "Task completion per unit cost represents the primary performance benchmark" — narrowed to one number.
- LOST: "the identity's numbers are where to look, and the trace says which" → REWRITE "the agent's identity configurations and audit traces provide transparent diagnostic accountability". The specific guidance (adjust identity numbers; trace tells which one) is gone.
- CHANGED (minor): "a stratum's completion falls" → "declining completion **accuracy**".

### 10.1 The debugger
- ADDED: "The brainstorm's first prerequisite" → REWRITE "A foundational prerequisite established in `abe_brainstorm.md`". The file name is not in ORIGINAL.
- Tick type: all fields and comments present with same meaning (including screened, basis, discarded, promptVersions). No findings.
- LOST (minor): "a **day** of quiet ticks becomes one row saying so" → REWRITE "quiet, inactive stretches compress into single aggregate summary records". Compaction grain (one day) dropped.
- LOST (minor): "The UI, **on the agent's page**" → location dropped from 10.1 (still in the 10.3 Debugger row).
- ADDED / inaccurate: Timeline "coloured by path" → REWRITE enumerates "(`fast`, `slow`, `idle`, `asleep`)", omitting `none` from the type's path union.
- LOST: Why: "and it never asks the model to remember" — dropped. Also "This is the brainstorm's 'explain each move'" dropped (cosmetic).
- LOST (minor): "the model's reported rationale, **written at the time**" — dropped. "it explains the system" also dropped.
- CHANGED (minor): "the ids are links" → "linking explicitly to underlying tick IDs" (acceptable but less exact).

### 10.2 Safety
- WEAKENED (hedge → certainty, minor): "**Most** of it is already in place by construction" → REWRITE "Safety invariants are embedded throughout the system design by construction".
- CHANGED (row "Beliefs that confirm themselves"): "spot checks on old **patterns**" → REWRITE "mandatory canary audits on compiled **schemas**". Different object and "mandatory" added.
- LOST (row "Instructions smuggled in content"): "and **that is hygiene**; the defence is labels ..." — the distinction that the prompt line is only hygiene and the real defence is in the runner is gone. Also LOST: "the authorisation rule **over the whole operation tuple**" → REWRITE "covering authorization rules".
- ADDED (row "A former holder's delayed write", minor): "where it cannot" → REWRITE "on legacy platforms".
- ADDED (row "Memory poisoning by strangers", minor): "candidates need promotion (4.2)" → REWRITE "candidate **entities** require **verified** promotion **during consolidation**".
- CHANGED (defaults): "until ten of its outward **actions** have been confirmed" → REWRITE "ten outward **communications**". The `outward` class is wider than communications.
- All 15 table rows are present; row cross-reference numbers all match.

### 10.3 Mapping onto eldon3 and h
- CHANGED (closing paragraph): "the inner loop gives the fine ticks" (5 s per the tick row) → REWRITE "the inner loop manages **sub-second** ticks". Contradicts the 5 s loop.
- LOST (closing paragraph): "replay **runs beside it** behind a flag until the recall-built reply passes the harness's conversation scripts" → REWRITE "Transcript replay persists strictly behind a diagnostic feature flag until evaluation scripts validate conversational parity". The parallel-run (both paths running side by side) is gone; "the harness's conversation scripts" became generic "evaluation scripts".
- CHANGED (row Tools and receptors): "(tool, version, **account binding**, subscriptions, cursors, observation policy, **matrix rows**)" → REWRITE "(binding tool version, **account credentials**, sensory subscriptions, cursors, observation policies, and **matrix blocks**)". Binding ≠ credentials; rows ≠ blocks.
- LOST (rows The tick / Tools and receptors, minor): named schedule kinds "INTERVAL schedule" and "ONCE schedules" → REWRITE "interval timer" / "single-shot timers".
- CHANGED (row Memory stores): "`AgentContext` keeps **only** the conversation scope" → REWRITE "is refined to manage conversation scope" ("only" dropped). "until the **conversation** scripts pass (11.2 M2)" → "until evaluation scripts pass". `AgentProcedure` "(version, rung, **per-level** statistics, guards)" → "outcome statistics". "every row carries a `label`" → "an **immutable** `label`" (added). `AgentAssertion` "observations with support and evidence ids" → "observations with supporting evidence IDs" (two things merged).
- CHANGED (row Identity): "with a **hand** `ALTER TABLE`" → REWRITE "via schema migration". The manual step (framework does not alter tables) is lost.
- ADDED (row Recall, minor): "activation as a computed column" → "**base-level** activation evaluated as a computed column".
- CHANGED (row The agent lease, minor): "**every** store write and every intent **carries** the epoch and is refused when it has moved" → REWRITE "store mutations and operational intents validate the active epoch, rejecting operations if the epoch has moved" ("every" and "carries" dropped). "in the `control` place" → "within their `control` locations" (one named place became per-resource locations).
- CHANGED (row Operations and store, minor): "a tool manual **per integration**" → "per tool"; store steps "connect, grant, install, **use**" → "connect, grant, install, and **execute**".
- ADDED (row Teams): "shared knowledge travels through shared documents, perceived" → REWRITE adds "and **explicit messaging channels** via perception". ORIGINAL names only shared documents.
- Rows present: all 15 rows (tick, tools/receptors, interpretation, model calls in flight, memory stores, recall, tasks, identity, drives, agent lease, sleep, operations/store, permissions, debugger, brief, teams) survive; no row dropped.

Sections with no findings: none fully clean; the Tick type block in 10.1 and rows Interpretation, Model calls in flight, Tasks, Drives/regulator, Sleep, Permissions, Debugger, Brief of the 10.3 table have no meaning changes.

## Chapter 11 (128 findings)

Comparison of ORIGINAL (old_c11.md, 425 lines) against REWRITE (new_c11.md, 221 lines), section by section. Row/item counts: 11.9 table has 35 rows in both; decision lists 11.4 (6), 11.6 (6), 11.7 (5 + milestone note), 11.8 (6), 11.10 (4), 11.11 (6), 11.12 (6), 11.13 (4), 11.14 (13) all have the same item counts in both. No rows or items were dropped or merged; the findings below are about content inside them.

## 11.1 The harness comes first

- ADDED: intro now says simulation is the only way to "verify safety invariants" and "evaluate multi-day consolidation dynamics"; ORIGINAL says only "know the agent is ready" and "develop it without spending money on every run or waiting a day for sleep". Also drops "The brainstorm was right".
- CHANGED: "the owner, two teammates, a supplier, a newsletter, a stranger with an injection attempt" → "collaborating teammates, external vendors, marketing newsletters, and adversarial actors attempting prompt injection" (counts and the single-stranger detail lost; all pluralised).
- CHANGED: "which must never go out" (mails that must never be sent) → "which actions must be blocked".
- CHANGED: "an experiment that would exceed its caps" → "exploratory experiments that breach safety envelopes" (caps are the experiment's own caps from 9.6, not safety envelopes).
- CHANGED: "four counts that must not rise: missed obligations, unsupported claims, forbidden actions (must be zero), and unauthorised disclosures" → "Zero-tolerance counters: ... prohibited actions (which must remain strictly zero)". ORIGINAL: only forbidden actions must be zero; the other three must not rise. REWRITE labels all four "zero-tolerance". Also the four counts were "beside" the principal metric, not part of the diagnostics list; REWRITE folds them into "Supporting diagnostic metrics".
- ADDED: "Outcome discrepancy rates across execution monitoring levels (Section 7.7)" — ORIGINAL "mismatch rate per outcome level" carries no cross-reference.
- ADDED: recall test example gains "billing discrepancy" ("the July Acme billing discrepancy `E-1044`"); ORIGINAL is just the query "what happened with Acme in July" must return E-1044. The query wording itself is lost.
- CHANGED: judge "from simulator state and the runner's own checks" → "runtime runner logs".
- WEAKENED: semantic-judge verdicts "audited against human-labelled cases every release" → "benchmarked against human-labeled test sets across releases" (per-release requirement lost). Example "was the answer right" dropped.
- CHANGED: validation weeks "used to promote procedures, choose defaults and admit mechanisms" → "calibrate operational thresholds, tune promotion ladder criteria, and evaluate architectural mechanisms". Promoting procedures (a procedure qualifies on validation weeks) became tuning the ladder's criteria; "admit" became "evaluate".
- WEAKENED: held-out weeks "never used for either, on which the frozen configuration is run once and reported" → "Strictly reserved for final benchmarking of frozen configurations" ("run once" lost in this bullet). "A case that was used to revise or promote anything" → "used to adjust parameters or diagnose failures".
- CHANGED: B0 has "retrieval over the same stores" → "structured retrieval over memory tables" ("same" stores as the full agent is the point).
- LOST: "whose result is reported and never used to choose again" (ablation ladder, held-out result).
- LOST: "This is where the third column of 1.1 is tested" → "formally validates the design hypotheses summarized in Section 1.1" (the "third column" pointer is gone; "is tested" became the certainty "formally validates").
- LOST: "record and replay is for regression only".

## 11.2 Milestones

- LOST: cross-references "(11.14)" ("The order follows the ninth round") and "(11.1)" (ablation ladder) in the order paragraph.
- LOST: "The earlier order built the cognitive mechanisms on a runtime that could not yet be trusted; this one tests the design's hardest assumptions first." REWRITE has only "ensures that cognitive systems are built upon verifiable guarantees".
- LOST (M0): "No agent yet".
- ADDED (M1): "`tick_agent` execution loop" — ORIGINAL says "The tick job and its schedule"; no `tick_agent` name.
- WEAKENED (M1): "intents persisted with the basis validated in the same transaction" → "atomic intent persistence with basis validation" ("same transaction" lost).
- LOST (M1): "the trace" ("episodes, the trace and the timeline page" → "episodic memory logging, and the administrative execution timeline").
- CHANGED (M1 exit): "cancellation of an in-flight call" → "in-flight deliberation cancellation" (a model call, not a deliberation).
- ADDED (M2): "five epistemic assertion kinds" — ORIGINAL M2 says "Assertion kinds" without the count. "salience and its weights" → "salience scoring" (weights lost). Exit "on the scripted day" → "across scripted scenarios".
- LOST (M3): "obligations with status" → "obligation management"; "`deliberate` with its schema and basis" → "with basis tracking" (schema lost); "monitoring at four levels" → "multi-level outcome monitoring" (four lost); "templates and the draft check" → "pre-transmission draft inspection" (templates lost).
- CHANGED (M3): "time budgets for model calls (8.5)" → "deliberation timeouts (Section 8.5)"; "expectations and the Predict step" → "forward expectations and predictive coding"; "the authorisation rule" (one rule) → "covering authorization rules" (plural); "exceptions" → "contractual exceptions".
- CHANGED (M3 exit): "holds on a held-out week" (one week, run once) → "holds on held-out weeks".
- LOST (M4): procedure page contents "(rungs, author, promote, retire)".
- CHANGED (M4 exit): "the frozen, already qualified procedure is then run once on held-out weeks and the report shows its reliability there" → "the frozen procedure executes across held-out scenarios, demonstrating verified reliability bounds" ("run once" lost; "report shows" became a pass condition "demonstrating verified").
- LOST (M5+): "waking" ("compact and prune with the brief and waking"); "the learning page" ("the what-if view and the learning page" → "counterfactual debugging tools").
- ADDED (M5+): "financial budget stops" (ORIGINAL: "the budget stops").
- CHANGED (M5+ exit): "reported once on held-out, or it stays an experiment" → "confirmed via single-run evaluation on held-out datasets". Held-out is a report, not a confirmation gate; the fallback "or it stays an experiment" is lost.
- CHANGED (decisive test): "a duplicate" → "a duplicate transaction"; "an exception buried in paragraph four" → "a contractual exception buried within narrative text in paragraph four"; "a send that succeeds while its response is lost" → "whose network acknowledgment is lost" (narrower).
- LOST (decisive test): "that number is the report's estimate of how it will do in use, not a licence" → "providing an un-gamed estimate of production operational reliability" ("not a licence" gone).

## 11.3 What changes for today's Abe

- LOST: instructions are "the rules in the identity, pinned" → "permanent declarative rules" ("pinned" is the mechanism term).
- CHANGED: "Nothing on it goes away" (nothing on the agent page is removed) → "maintaining complete backward compatibility with existing operational tools".

## 11.4 Decisions from the first review

- ADDED/CHANGED (intro): reviewer model "Gemini 3.1 Pro through agy" → "`gemini-3.1-pro-high`" (suffix not in ORIGINAL); "alongside the author" lost.
- ADDED (1): "publishes verified assertions" and "calibrated confidence" — ORIGINAL: "publishes a fact ... when its confidence is at least 0.8".
- CHANGED (1): "a version and a validity date" → "schema versions, and temporal validity windows" (a version of the fact, not a schema version; a date, not a window).
- CHANGED (1): "the same source" → "an identical underlying document"; rationale "so repetition across agents does not manufacture confirmation" lost.
- LOST (1): "The `Fact` model (since 11.14 `Assertion`, 4.2)" — the rename note and the 4.2 cross-reference are gone; REWRITE just says "The `Assertion` database model".
- ADDED (2): "four-week hour-of-week baseline" (ORIGINAL: "the agent's own hour-of-week baseline").
- CHANGED (2): pace tunes "sleep timing" → "opportunistic consolidation intervals"; "batching" → "batching thresholds".
- LOST (3): "high-arousal" ("The sign of a high-arousal outcome decides the direction" → "The affective sign of an execution outcome").
- LOST (4): the amendment note "scales with global confidence (amended in 11.14: with caution)" — REWRITE silently writes "scaling sensitivity with operational caution (Section 6.1)" and adds a 6.1 cross-reference not in ORIGINAL.
- ADDED (4): "Brittle prompt-time veto heuristics"; "high-arousal negative episode" (ORIGINAL: "a negative episode"); "Execution vetoes operate deterministically".
- LOST (4): starting numbers tuned "against missed failures and needless deliberation" → "calibrated within the evaluation harness".
- LOST (6): thought stimuli "marked inferred or simulated, never observed" → "tagged as inferred or simulated" ("never observed" gone).
- CHANGED (closing): "corrected ... the fast path's dependence on the model (8.7)" → "verified procedure execution independence during model outages"; "the forgetting arithmetic (4.5, 5.4)" → "established ACT-R base-level decay arithmetic" (ACT-R added); "forced sleep during an incident (5.1)" → "prohibited forced sleep consolidation during active operational incidents" (direction asserted that ORIGINAL leaves open).

## 11.5 Still open

- CHANGED: "`τ_pop` should probably adapt the same way once the harness shows..." → "`τ_pop` will be calibrated once harness benchmarks quantify..." (hedge turned into certainty; "adapt" became "calibrated").
- WEAKENED: depth defaults "are guesses" → "represents an initial default".
- LOST: weights in `r` and optimism factors "are learned or calibrated in the harness, and the first numbers are guesses until then" → "calibrated empirically" ("learned or" and "guesses" gone).
- CHANGED: cycle detection "three occurrences and a 'tight' spread need a definition" → "(requiring three occurrences with tight variance) will be refined" (ORIGINAL: "tight" is undefined; REWRITE presents it as defined). "how regular real places are" → "temporal variance across collaborative environments".
- WEAKENED: deterministic coverage "is the design's central unknown" → "represents a primary experimental inquiry".
- CHANGED: screening "which item kinds can skip the model step" → "which entity categories can execute via deterministic parsers alone".
- LOST: triage/caution bullet drops "how long a bad morning should last" (the caution-decay question); only the triage half survives.

## 11.6 Decisions from the second review: tools

- LOST (intro): the phone analogy ("modelling the agent's world like a phone"); "The package was first called an app, then renamed to the brainstorm's word"; and the naming statement "an agent has tools, a tool has operations, and operations are namespaced by their tool (`mail:send`, `roomba:start`)". "Put to the same two reviewers" → "Submitted to peer review".
- CHANGED (3): "a provenance no tool can forge" → "immutable provenance".
- CHANGED (4): "cleanup" → "automated rollback plans"; sandbox findings "never count as live" → "are labeled as synthetic" (weaker: labelling vs never counting).
- ADDED (5): "four sequential administrative stages" ("sequential" not in ORIGINAL); "machine-readable capability manual" (ORIGINAL: "a manual").
- ADDED (6): "managing continuous telemetry and kinematics".

## 11.7 Decisions from the third round: glances, space, traits, ownership

- LOST (intro): "Three questions from the author, worked through in conversation and written into the document".
- CHANGED (1): "decayed at sleep" → "decayed across elapsed time" (this matches the 11.14 #12 fix, but ORIGINAL 11.7 says "at sleep" with no amendment note; the REWRITE changes it silently); "conditioned by what the view shows" → "conditioned on environmental context"; "primed from the trait's place-kind priors" → "seeded by trait priors" (place-kind lost); "backoff" → "backoff hierarchies".
- CHANGED (1): "Top-down attention is not a rule but the sum of what is waiting on a place" → "reflects the aggregate priority of active tasks and expectations waiting on that place" ("not a rule" lost; "priority of active tasks and expectations" added); "reply-timing comes from the person, not the place" → "collaborator response dynamics track individual turnaround curves" ("not the place" contrast lost).
- ADDED (1): "pins" → "pinned floors".
- ADDED (4): "Legal ownership" (ORIGINAL: "Ownership is a fact"); body is "instances where the agent is the principal" → "acts as the primary principal and owner" ("and owner" added).
- CHANGED (4): "a computer" → "an isolated compute sandbox".
- LOST (5): "requests are messages to the holder, whoever the holder is" ("whoever the holder is" gone).

## 11.8 Decisions from the fourth round: time

- LOST (intro): "Five threads left open by the third round, plus one the author added".
- ADDED (1): "continuous Poisson rates" (ORIGINAL: "a rate").
- ADDED (3): "interpretations derived from unstructured natural language" (ORIGINAL: "what interpretation gives").
- LOST (4): "asks ... once, for everyone" → "dispatches an explicit clarification inquiry ... resolving the contradiction globally" ("once" lost); "the entity's owner" → "the domain owner".
- ADDED (5): "with elevated arousal".
- CHANGED (6): "stopped with the partial kept, and can be concluded cheaply from what was kept" → "safe cancellation with scratchpad preservation, and fallback to lightweight completion synthesis when time expires" ("when time expires" added as the only trigger).

## 11.9 Rejected alternatives (35 rows in both; all rows present, none merged)

- LOST (intro): "any of them can be reopened with a new argument".
- CHANGED (row 1, reconsolidation): "rate-limit percept-driven changes to once a day per fact" → "rate-limiting updates to once per day per fact" (the limit applies to percept-driven changes, not owner corrections); ADDED "provides necessary stability without deferring urgent adjustments".
- LOST (row 9, fixed veto thresholds): amendment note "Scale with caution (11.14; was global confidence)" → "scale dynamically with operational caution".
- CHANGED (row 12, "app"): "The brainstorm's word was tool; tool-use is the better brain analogy; 'app' is product copy at most" → "Obscures functional capability; 'tool' accurately reflects biological affordance models and systems engineering terminology" (brainstorm origin and "product copy" lost; new claims added).
- LOST (row 13, deadline buckets): the slack formula "(deadline minus now minus remaining work)".
- CHANGED (row 15, blocking model calls): "so they can be assessed and stopped in flight" → "Blocks sensory ingestion and prevents cancellation; ... under strict time budgets" ("assessed in flight" lost; "blocks sensory ingestion" added).
- LOST (row 16, installs in identity): "owner-only"; "capability records in runtime config" → "dynamic runtime state"; "values and boundaries" → "core values, rules, and autonomy parameters".
- WEAKENED (row 18, pattern match confirms facts): "only an observation that tests the proposition counts" → "assertions require empirical verification".
- LOST (row 19, one Fact type): "an instruction has authority and scope, never a `p`" → "instructions carry domain authority rather than probabilities" ("scope" lost).
- WEAKENED (row 21, global confidence): "a caution that only tightens" → "caution scaling" ("only tightens" lost).
- ADDED (row 25, convergence): "because parent policies stopped selecting it" (ORIGINAL: "because it stopped getting chances").
- CHANGED (row 26, ChangeEvent threshold): "a citing deliberation" → "explicit deliberative acceptance"; "No model of 'the baseline was already wrong'" → "Vulnerable to baseline distortion".
- CHANGED (row 27, training cutoff): "says nothing about when it was true" → "indicate nothing regarding factual validity" (temporal point became a truth point).
- LOST (row 28, working-memory size): "`widen` exists and costs" → "complex multi-document workflows can explicitly request wide prompt rendering" ("and costs" gone; workflow qualifier added).
- WEAKENED (row 30, conversation history): "the tape is still never replayed" → "avoiding transcript replay"; "episodes of the conversation place" → "episodic records"; ADDED "Indexical references require context".
- LOST (row 31, grace periods): the conditional "fence where the tool can, block conflicting writes where it cannot" → "concurrency relies on fencing tokens and write blocking".
- LOST (row 35, `validUntil`): "(amended)" marker and "Still rejected" — the row no longer signals that it was amended.

## 11.10 Decisions from the fifth round: what comes to mind

- LOST (intro): the author's question (stimulus that never wins attention bringing a memory forward; curiosity and creativity).
- LOST (2): the example "(the unpaid invoice)"; ADDED "exceeds threshold τ_pop" (ORIGINAL: "A strong enough hit").
- CHANGED (3): "Incubation runs on open and closed problems" → "evaluate unresolved problems and recent ambiguous decisions"; "closed problems can only produce a why-queue line or a brief proposal" → "historical post-mortems can log why-queue entries or propose briefing notes"; "cite two items" → "at least two independent records" ("independent" added); ADDED "against the primed memory set".
- LOST (4): "A ninth prompt, `connect`" → "the standardized `connect` prompt template" (the count "ninth" gone).

## 11.11 Decisions from the sixth round: patterns

- LOST (intro): the three example quotes and "the pieces were scattered ... and the thing itself was unnamed".
- ADDED (2): "fourth deterministic recall pass" ("deterministic" not in ORIGINAL).
- LOST (3): "Recognition gains a third pass" (count gone); ADDED "matches observed behavioral traits against entity patterns".
- LOST (4): "compile is not a separate mechanism"; REWRITE instead defines convergence ("consistent preference during deliberative planning while alternatives were visible").
- CHANGED (5): "only pattern-breaking episodes cost a model call" → "reserving expensive model extraction for anomalous episodes and periodic canary audits" (audits added as a model-call consumer, "only" lost); LOST "so extract gets cheaper as the agent gets experienced".
- LOST (6): "is held by the guard rules"; "before a regularity can raise an anomaly or a question" → "before triggering anomaly alerts" ("or a question" lost); ADDED "activation decay prunes obsolete strategies" (ORIGINAL: just "decay").

## 11.12 Decisions from the seventh round: time

- LOST (intro): the author's question and "turned down a `validUntil` field on facts in favour of linking everything to time with a grain to choose at query time, and treating space the same way".
- CHANGED (3): "reads that answered an ask" → "focused reads that directly satisfy an active task".
- ADDED (4): "Regular expressions and deterministic parsers extract ... from prompts" (ORIGINAL: "parsed by features").
- ADDED (5): the chain "(episode ⊂ task ⊂ day ⊂ month ⊂ year)"; LOST "zoomable like frames".
- CHANGED (6): "cycles, landmarks and pace as time at work" → "circadian rhythms, environmental landmarks, and operational pace" (cycles are recurring expectations, not circadian rhythms).

## 11.13 Decisions from the eighth round: change and prior knowledge

- LOST (intro): the capital-city example and "where the agent has 'Paris' at all".
- CHANGED (1): "accepted at a threshold that rises with the cost of being wrong" → "settled via authoritative source inspection, explicit deliberative acceptance, or owner confirmation" (acceptance mechanism replaced; matches 11.9 row 26 but not ORIGINAL 11.13).
- LOST (1): "accepted events propagate to dependents"; "unexplained shifts of stable facts are anomalies"; cross-references "(4.7, 5.2 §2, 7.5, 8.3)".
- ADDED (1): pending events are hypotheses "for high-stakes actions" (ORIGINAL: "for actions").
- LOST (2): "exactly like places".
- LOST (3): "a third provenance"; "cited as the model at its cutoff"; the amendment note "dated at the cutoff (amended in 11.14: undated, `verifiedAt: null`)"; "with a measured error rate per kind of attribute".
- ADDED (3): citation format "(`M-<model_id>`)".
- CHANGED (3): "always overridden by memory" → "strictly superseded by verified assertions in structured memory" ("verified" narrows it).
- LOST (4): "The grounding rule (8.6)" as an acceptor in the body (only draft checks are named); "the promise in 1.1 gains its one acknowledged exception"; the note "(Amended in 11.14: prior claims are undated.)".

## 11.14 Decisions from the ninth round: the Codex review

- CHANGED (intro): "The assistant drafted answers; the two iterated for five rounds until Codex accepted every part" → "The author and assistant resolved each critique across five review cycles" (iteration was assistant–Codex; "until Codex accepted every part" lost); LOST "The owner then had the answers written in"; LOST "with the metrics reporting that as improvement"; "more confident, consistent and cheap" → "cheaper and more internally consistent" ("more confident" lost); "a table of contradictions" → "identifying cross-chapter contradictions".
- CHANGED (2): "`Unknown` satisfies nothing" → "bindings evaluating to `Unknown` halt automated execution"; "a stranger's deadline buys budgeted triage, never a nudge" → "trigger budgeted triage rather than automated execution" (a nudge is an owner prompt, not automated execution).
- LOST (2): screening "whatever its salience"; "for asks, declared high-stakes attributes and exceptions"; "unscreened items are coverage gaps"; obligations "have a status"; "scope-applicable" authority.
- LOST (3): compaction "leaves stubs with context and marks lost evidence lost" → "preserves immutable evidence stubs".
- CHANGED (4): "precedence only within overlapping scope, otherwise the action blocks" → "conflicting instructions with equal authority halt automated execution and escalate to the owner" (condition changed from scope to authority; escalation added); "holds at once" → "binding instructions".
- LOST (5): "(the `validUntil` rejection is amended)"; "calibrated per kind and model".
- ADDED (6): level names "(`accepted`, `effect`, `objective`, `appropriate`)" and "10th percentile" (not stated in ORIGINAL 11.14).
- CHANGED (6): "(three runs make a candidate, not a habit)" → "(requiring extensive clean execution histories to achieve automated status)"; LOST "with per-class bars".
- WEAKENED (7): "shadow agreement is not an outcome" → "tracked independently from execution outcomes"; ADDED "without fabricating evidence".
- ADDED (8): "immutable security labels"; "Stored records" (ORIGINAL: "on every item").
- LOST (9): basis contents "(task revisions, every input's version, relevance scope, policy versions, leases)"; "lease scope is a place"; CHANGED "tools that cannot fence get a stated weaker guarantee" → "legacy tools lacking native fencing enforce write-blocking constraints" (a specific mechanism asserted; "legacy" added).
- CHANGED (10): "retention is live references and a date, not a score" → "requires active relational references and explicit retention dates" ("not a score" lost; both now required).
- CHANGED (11): "A fixed workload fully accounted" → "evaluates total task throughput"; LOST "admits mechanisms on validation and reports once on held-out" → "admitted strictly via measured rungs".
- LOST (12): "two glance intervals (2.9)"; "the 300 ms example labelled (12.10)" → "latency examples are explicitly labeled" (number and 12.10 cross-reference gone).

Sections with no findings: none (every section 11.1 to 11.14 has at least one finding; 11.3 and 11.8 have only minor ones).

## Chapters 12 and 13 (96 findings)

Comparison of ORIGINAL (old_c1213.md) vs REWRITE (new_c1213.md), chapters 12 and 13. Formulas and worked numbers (e^(−λ·gap), P(H) = 1 − e^(−λ·Δt), likelihoods, odds update, accuracy table, 0.993 / 0.692 → 0.953 / 0.0015 → 0.0022, urgency = p · (0.5 + 0.5 · stakes), 0.02 two sources, stakes > 0.5, 300 ms, page size 50, 1000 × 1000) all survive. The three acceptance acts, "p never accepts", the 13.3 window tables, the 13.4 expression table and the 13.5 age ranges survive. Findings below.

## 12 (intro)
- ADDED: ORIGINAL says "The brainstorm"; REWRITE names a file, "`abe_brainstorm.md`" (also in 12.6, 13 intro, 13.9). Harmless if that is the brainstorm file, but the ORIGINAL never names it.

## 12.1 Two systems
- ADDED: "converts one into the other: views, in sequence, with the moves between them, become the map" (one direction described) → REWRITE says the retrosplenial cortex "mediates the bidirectional transformation". The ORIGINAL does not claim bidirectionality.

## 12.3 Views
- LOST: Move.class comment "so is \"physical:go\", which moves a body, not a view (12.8)" is dropped from the type; only the submit-button half and the (12.4) cross-reference remain. The (12.8) cross-reference in the type is gone.
- CHANGED (minor): "inventing coordinates for it would be inventing metadata, the thing this chapter is against" → REWRITE drops "the thing this chapter is against".

## 12.4 Moves: navigation is action
- CHANGED: "Moves are safe to try, which is what makes wandering possible (12.5), and it is why the contract insists that a move never writes" (safety is the reason for the rule) → REWRITE inverts the causality: "Because navigational moves belong strictly to the read action class and produce zero side effects, the agent can explore ... without risk".
- ADDED: operations are "governed by explicit permissions" — not in ORIGINAL, which says "operations with their own class, and the manual must say so".
- WEAKENED: "the manual must say so" survives only as "Capability manuals that misclassify mutations ... violate conformance"; the positive duty to declare the class is gone. "has a manual that lies" dropped.
- ADDED: paths compile "during sleep consolidation (Section 5.2 §3)" — ORIGINAL says only "compiles (5.2 §3)".
- LOST: "and runs on the fast path thereafter" and "stops being a deliberation on the fourth invoice".

## 12.5 The map in memory
- WEAKENED: "The map is not a separate store." → "does not require a dedicated external database" (a hedge; the ORIGINAL is categorical).
- ADDED: source annotation "(derived from document link)" on the `page P-40 —links→ page P-41` line; ORIGINAL has none for that row.
- CHANGED: "A shortcut is what recall gives when two paths share a place: the rat's diagonal" → "Discovering novel connections across intersecting pathways produces shortcut navigation" — the mechanism (recall over a shared place) is blurred.
- CHANGED: "spends part of its budget" → "allocates dedicated compute"; "opening a thread never opened" → "inspecting unread conversation threads" (never-opened ≠ unread); "costs only calls" → "incurring minimal API cost".

## 12.6 Where things usually are
- LOST: the brainstorm rule "give an entity the lowest section it fits" → REWRITE: "mapping items to normalized coordinate buckets".
- LOST: "as facts on trait place kinds first and on specific places once seen enough" (learning order) is gone.
- LOST: "the agent builds them per place kind and refines them per instance".
- ADDED: scan paths mirror "human experts or screen-reader users"; ORIGINAL says only screen-reader users, and says they have "exactly these habits per site".
- LOST: "a regularity on a pattern (4.11) whose slot is the place kind; it has its own section because it has its own use" → REWRITE keeps only "regularity attached to a situational pattern (4.11)"; the slot and the reason for the section are gone.

## 12.7 Provided and inferred
- CHANGED: row 6 right column "the tool's reliability per place (2.9)" → "tool notification reliability per place" ("notification" added).
- LOST: the brainstorm tie-back "'The metadata is not set in stone' is the right half of each column".
- CHANGED (minor): row 5 "which places matter" dropped, keeping only value of knowing / goal relevance.

## 12.8 The contract
- LOST: "landmarks" in the accessibility-tree list ("roles, names, containment, reading order, landmarks, and affordances").
- LOST: "A conforming tool provides, per trait place kind:" → "A conforming tool specification provides:" (the per-place-kind scope dropped).
- CHANGED: item 4 "Operations: everything else that can be done here, each with its class (8.1)" → "All state-modifying operations executable within this location". The ORIGINAL covers every non-move operation, not only writes (e.g. `physical:do`).
- WEAKENED: item 5 "from a fixed list per trait" → "Standardized environmental conditions" (fixed list, per trait, dropped).
- LOST: item 6 "which the trait supplies and a tool may override".
- LOST: item 8 cross-reference "(8.8)" on "passes the trait's suite".
- CHANGED: "strips session tokens from URLs" → "strips tracking tokens".
- WEAKENED: "`physical:go` is **not a move** but an operation" → REWRITE says only that it "constitutes an operation belonging to the physical action class"; the explicit "not a move" is gone.
- LOST: "`physical:do` (clean here) is an operation too."
- CHANGED: "The brainstorm's NxN grid world, where an entity occupies a 1x1 square and the agent moves and touches" → "The classical N×N discrete grid world from cognitive modeling" (misattributed; the 1x1 occupancy and move/touch details dropped).
- CHANGED: "this contract with a square frame" → "within a normalized coordinate frame".
- LOST: "rather than a separate project".
- CHANGED (minor): visual:look / visual:focus_region "change what the agent sees and nothing else" → "modulating perceptual focus without moving physical hardware" (narrower exclusion).

## 12.9 Place across the document
- CHANGED: "recall's cue strengths (4.5)" → "spreading activation in recall (Section 4.5)". In the ORIGINAL spreading is 4.6; cue strengths are 4.5.
- CHANGED (minor): "the tool page shows them on the map" → "displayed on the agent's management interface" (the named tool page is lost).
- ADDED (minor): glances diff "against cached snapshots".

## 12.10 Nia finds the invoice
- WEAKENED: "the three dependent calls take whatever the tool takes, within the step's time budget and with a cancellation check between them" → "sequential requests execute within tool response constraints, bounded by step timeouts and cancellation checks" ("between them" and "dependent" lost).
- ADDED (minor): "Nia requires an incoming vendor invoice. Context triggers the compiled procedure" — framing not in ORIGINAL.

## 13.1 How the brain keeps time
- ADDED: compression is "an optimal mathematical strategy"; ORIGINAL says "it is how a finite memory covers a lifetime".
- LOST (minor): "with detail lost at each scale".

## 13.2 The grain hierarchy
- WEAKENED: "Weeks do not nest in months" → "do not nest evenly within months"; "seasons" → "meteorological seasons" (added qualifier).
- Otherwise intact (ten derived grains, (grain, range) keys, month from day never week, at vs sensedAt).

## 13.3 Facts move along time
- LOST: "and it can also set `since` for a value the agent already knows is coming" (declared applicability setting a future since).
- LOST: "Two observations bound a transition only if both are accurate, in the same scope, and a transition happened at all." (the three conditions).
- WEAKENED/LOST: "Validity between observations is an assumption, and it says how strong it is" → REWRITE keeps the assumption but drops "it says how strong it is" as a stated property.
- CHANGED: rendering "probably unchanged in between" → "highly probable to have remained unchanged" (hedge strengthened).
- ADDED: "access expiring Friday" → "Friday at midnight".
- CHANGED: "a live score from a page that changes every minute is stale in two" → "becomes stale within minutes" (the rate/stale-in-two specifics dropped).
- ADDED/LOST: Nia's history sentence gains "as observed in the calendar on September 12" (calendar not in ORIGINAL) and loses the "(4.7)" cross-reference.

## 13.4 Asking about time
- CHANGED: "at 5:15" row "today at 5:15, then yesterday…" → "today at 17:15, resolving backward to yesterday at 17:15" (asserts PM; ORIGINAL does not).
- LOST: the periodic row's "used when the question says so or nearest-first finds nothing" is dropped from the table (it survives in the paragraph).
- LOST (minor): "is three cues on one lookup" → "compound indexed queries".

## 13.5 The timeline is log-compressed
- ADDED: "Sleep-phase compaction" (ORIGINAL: "Compaction (5.2 §5)").
- ADDED: row "under 7 days ... everything" → "Complete execution logs, verbatim percepts, and full narrative summaries".
- CHANGED: row "1 to 5 years ... anything a fact still cites" → "primary evidence stubs cited by active facts".
- CHANGED: row "older ... a year in a paragraph; pinned; facts' sources" → "Consolidated annual overviews; pinned records; immutable evidentiary stubs" ("a year in a paragraph" lost; "immutable" added).
- LOST: "The same focus mechanics, the same breadcrumbs, one dimension over."
- LOST: "(6.6, `forgetting`)" — the `forgetting` identity key is dropped.
- CHANGED: "a compliance agent keeps day blocks for a year" → "across multi-year horizons".
- LOST: "which is the grouping and pruning by space that the map (12.5) needs" (cross-reference and tie-back).

## 13.6 Rendering at grain
- CHANGED: "one from 1965 renders its year block unless the deliberation zooms" → REWRITE replaces the example with "events from 2024 renders consolidated monthly summary blocks". The 1965/year-block example is gone; the 2024 example is used for both sentences.
- CHANGED (minor): "costs one line per month, not a thousand episodes" → "twelve concise monthly lines rather than thousands of tokens".

## 13.7 Cycles, landmarks, and the sense of when
- LOST: cycle examples "the plan page on Mondays, the invoice on the first".
- ADDED: cycles "parameterizing the glance scheduler (Section 2.9)" and "Circadian and weekly cycles" — ORIGINAL says found by prospect (5.2 §4, 2.9), grain-of-weekday and grain-of-month.
- LOST: landmarks are "span episodes" (span dropped).
- CHANGED (minor): "Three things the rest of the document already does" → "Three cross-cutting architectural capabilities formalize".

## 13.8 Kam asks who won
- LOST: "entity = Manchester United (or a candidate)".
- LOST: 10:05 "Recognition: the entity resolves."
- ADDED (minor): "today's upcoming fixture" ("upcoming" not in ORIGINAL).

## 13.9 Change: when what is true moves
- LOST: "a fourth element, derived from the other three" → "a foundational primitive" (derivation dropped).
- ADDED (minor): percept changes called "transient".
- CHANGED: "A fact with three observations flips on one stranger's word" → "supported by only two historical observations".
- LOST: "That is why extinction does not erase a fear; it files it under 'not in this situation'."
- LOST (type): `p` comment "under the binary model below".
- LOST (type): `evidence.for` comment "one per item of evidence".
- LOST (type): `stakes` comment "(6.3 magnitude)" → "(Section 6.3)".
- CHANGED: "A contradiction is not assumed to be change." → "are not assumed to represent state transitions without structural verification" (qualifier added to a categorical statement).
- ADDED: "(4.7 in the tick, 5.2 §2 at night)" → "tick reconsolidation" / "overnight extraction" labels.
- LOST: prior line "a regularity learned like a place's (4.11, 2.9)" → only (4.11); the (2.9) cross-reference and "like a place's" dropped.
- CHANGED: "one item of evidence counts once (1.6 §11)" → "Each underlying evidence source counts exactly once" (item → source).
- LOST: accuracy "stranger or a single read 0.6" → "unfamiliar external sources: 0.60" ("or a single read" dropped).
- LOST: "So the calculations are illustrations with those assumptions stated".
- LOST: "and they are not meant to" (after "two mediocre sources do not move a stable fact").
- LOST: the whole sentence "General acceptance uses explicit scoped conflict resolution unless an exhaustive model with likelihoods for every possible observation, including the possibility that the baseline was already wrong, is supplied; none is, and the first implementation does not attempt one."
- WEAKENED (act 1): "its observation replaces the baseline and the contradiction alike" → "Direct empirical observation supersedes contradictory claims" (replacing the baseline too is lost).
- CHANGED (act 2): "an outward action may not rest on it until the read above has happened" → "operations of class `write_shared` or higher cannot execute based on deliberative acceptance until authoritative inspection has verified the value" (class list added; "outward action" is broader/different).
- LOST (act 3): "an instruction with a scope (4.2)" → "an authoritative instruction (Section 4.2)" (scope dropped; "authoritative" added).
- CHANGED: "the event becomes a record on the timeline at its grain, with its cause, where 'when did the standup move' is answered from" → "an immutable landmark on the temporal timeline, accompanied by its verified causal rationale". "at its grain" and the standup question lost; "immutable", "landmark" and "verified" added — and "verified causal rationale" contradicts the later rule that `cause` may still be empty after acceptance.
- LOST: "the number only confirms there is nothing to wait for" (live score case).
- ADDED: "schedules an immediate glance" (ORIGINAL: "sends a glance to the calendar, whose read settles it"; "whose read settles it" dropped).
- LOST (pending, bullet 2): "which is also the first act of resolution" → "resolving the contradiction".
- LOST (propagation): "expectations and cycles built on it" → "active prospective expectations" (cycles dropped).
- ADDED: "a question for the brief" → "anomaly alert in the morning briefing" ("alert", "morning" added); "after a day" → "after 24 hours" (equivalent).
- WEAKENED (anomaly): "carries a guard-like caution: a deliberation that leans on it is told the change is unexplained" → "operates under heightened caution" (the explicit telling and the guard analogy gone).
- ADDED (Paris/Lyon, minor): "another marketing newsletter"; "an unverified model prior" is fine for "a prior row (4.12), never verified".

Sections with no findings: 12.2 Places (title comment added is harmless); 13 intro; 13.9 "Rejected events are kept"; 13.9 "Pending events" bullets 1 and 3; 13.9 formula and worked numbers themselves.