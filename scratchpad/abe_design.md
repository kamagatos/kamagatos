# Abe: a brain-shaped autonomous agent

Design for the autonomous agent behind Abe (eldon3). The raw ideas are in `abe_brainstorm.md`; this document turns them
into something we can build. It is written chapter by chapter.

The goal: an agent that runs on its own, on behalf of a person or a team, and whose architecture follows the
organisation of the human brain as closely as is useful.

---

## 1. Frame

### 1.1 What "like the brain" buys us

We are not simulating neurons. We are copying the brain's **organisation**: which jobs it splits apart, what it keeps
small, what it does in the background, what it forgets. Each of those choices solves a problem we also have.

| Brain trait                                 | Problem it solves for us                                        |
| :------------------------------------------ | :-------------------------------------------------------------- |
| Continuous sensing, but a tiny attention    | Cheap to be always on; only a few things ever reach the LLM     |
| Working memory holds ~4 to 7 chunks         | Prompts stay small, fast, and readable in a debugger            |
| Several memory systems, not one             | Facts, events and skills need different storage and retrieval   |
| Sleep consolidates and forgets              | Memory stays fast and relevant; noise is dropped, not kept      |
| Habits run without thinking                 | Most repeated work costs no LLM call and takes milliseconds     |
| Prediction first, then surprise             | Novelty and errors are detected for free, and drive learning    |
| Drives (hunger, boredom, curiosity)         | The agent acts unprompted, and knows when to stop spending      |
| Emotion tags memories and steers attention  | Important things are remembered and handled with care           |
| Language is one region, not the whole brain | The LLM is a tool the agent uses, not the agent itself          |

The last row is the most important. In most "LLM agents" the model is the whole brain: memory is a transcript, decision
is the next token, and every step is a call. Here the LLM is the **language and reasoning cortex**. Everything else
(sensing, attention, memory, drives, action selection, monitoring) is ordinary code with ordinary data. That is how we
get the goals from the brainstorm:

- **Debuggability:** every tick leaves a trace of what was sensed, what won attention, what was recalled, what was
  decided and why. The agent explains itself from the trace, not from a fresh guess.
- **No hallucination:** facts live in memory stores with sources. The LLM reasons over what it is shown and marks what
  it does not know. Outbound claims are checked against memory before they leave.
- **Reliability:** repeated tasks become procedures. Procedures are deterministic.
- **Performance:** the fast path (habit) runs without a model. The slow path (deliberation) runs on a bounded prompt.

### 1.2 Running example

To keep the text concrete, one agent appears throughout: **Nia**, an operations agent on a three-person team. Her owner
is Kam. She has a mailbox, a calendar and a Notion workspace. Her standing job: keep Kam's inbox handled, keep the
team's weekly plan in Notion up to date, and flag anything that needs Kam.

### 1.3 The brain map

| Brain                                       | Agent component     | Job                                                                         |
| :------------------------------------------ | :------------------ | :-------------------------------------------------------------------------- |
| Senses, thalamus                            | **Perception**      | Turn raw stimuli (mail, chat, calendar, timers, drives) into percepts       |
| Salience network (insula, cingulate)        | **Attention**       | Score percepts; let a few into working memory; interrupt when needed        |
| Prefrontal cortex                           | **Working memory**  | The bounded "now": self, goal, task, attended percepts, recalled memories   |
| Hippocampus                                 | **Episodic memory** | What happened, when, with whom, how it went                                 |
| Neocortex                                   | **Semantic memory** | Entities and facts with confidence: people, projects, documents, rules      |
| Basal ganglia, cerebellum                   | **Procedures**      | Compiled skills that run without deliberation                               |
| Sleep, hippocampal replay                   | **Consolidation**   | Nightly job: extract facts, compile habits, compact, forget                 |
| Predictive coding, cerebellum               | **Expectations**    | What should happen next; surprise when it does not                         |
| Hypothalamus, interoception                 | **Drives**          | Boredom, budget, curiosity, social contact; set-points that create stimuli  |
| Amygdala, appraisal                         | **Appraisal**       | Valence and arousal on percepts; weighs attention and memory strength       |
| Prefrontal cortex, basal ganglia            | **Executive**       | Goals → tasks → steps; pick one action, inhibit the rest; monitor outcome   |
| Motor cortex, effectors                     | **Tools**           | Typed atomic operations with cost, reversibility and permission             |
| Language cortex                             | **LLM**             | Understand and produce language; deliberate over working memory            |
| Default mode network                        | **Idle mode**       | When nothing is pressing: review, plan, explore, per identity               |
| Theory of mind                              | **People models**   | What each person knows, wants, and how close they are                       |
| Sense of self                               | **Identity**        | Name, role, values, autonomy level, owner. Fixed by the owner               |

Each component gets its own chapter. Chapter 10 maps them onto eldon3 and h.

### 1.4 The tick

The agent is a loop. The brain never stops sensing; the loop never stops ticking. A tick is cheap when nothing
happens, and most ticks are like that.

```text
every tick (seconds while active, minutes while idle):

  1. Sense      collect stimuli since last tick: integrations, chat, timers, job results,
                and internal signals from drives
  2. Perceive   normalise each stimulus into a percept: entities, changes, actor, time
  3. Predict    match percepts against open expectations; mark met / missed / surprising
  4. Appraise   tag valence and arousal
  5. Attend     score salience; gate into working memory; decide whether to interrupt
  6. Recall     pull related episodes, facts, procedures and people into working memory
  7. Select     fast path: a procedure matches with confidence → run it
                slow path: deliberate with the LLM over working memory → a plan and one action
                no path: wait, or ask the owner
  8. Act        run one atomic operation; store the expected outcome
  9. Observe    compare outcome to expectation; write the episode; update procedure stats
 10. Regulate   update drives; evict from working memory; schedule the next tick
```

Sleep is not a step in the tick. It is a separate job that runs when the agent has been idle long enough or on a
schedule (Chapter 5).

Two things make this loop different from a chat loop:

- **Interrupts are decided, not automatic.** A new stimulus does not stop the current task. It gets a salience score,
  and only wins if it beats what the agent is doing (Chapter 3).
- **The LLM is optional per tick.** Steps 1 to 6 and 8 to 10 are code. Step 7 only calls the model when no procedure
  fits. A quiet day for Nia is thousands of ticks and a handful of model calls.

### 1.5 What one tick looks like for Nia

09:12. Nia is drafting the weekly plan (a task, step 3 of 6). A tick runs.

1. **Sense:** two new emails, one calendar reminder (standup in 15 min), a Notion page edit by a teammate.
2. **Perceive:** email A is from a supplier about an invoice; email B is a newsletter; the reminder is the daily
   standup; the Notion edit touched the page Nia is editing.
3. **Predict:** the standup reminder was expected (met). The Notion edit was not (surprising: someone touched the page
   she is working on). The invoice mail was expected "this week" (met, early).
4. **Appraise:** invoice mail: mild negative valence (money owed), low arousal. Notion edit: neutral, medium arousal
   (conflict risk).
5. **Attend:** Notion edit scores highest (surprise + touches the active task) and interrupts. Invoice mail enters
   working memory but does not interrupt. Newsletter scores below threshold: logged to episodic memory, not attended.
   Standup: queued as a task with a deadline.
6. **Recall:** the teammate's people model (she often edits plans directly), the page's recent history, the procedure
   "merge concurrent edits".
7. **Select:** the procedure matches with confidence 0.85: fast path. No model call.
8. **Act:** re-read the page, merge, continue the draft. Expected outcome: no conflict on save.
9. **Observe:** save succeeded. Episode written. Procedure stats: one more success.
10. **Regulate:** boredom 0, budget fine, next tick in 5 seconds.

The invoice is still in working memory. When the plan is done, the executive picks the next task, and the invoice
procedure ("forward supplier invoices to Kam with a one-line summary") is the likely winner.

### 1.6 Principles, in one place

1. **Sense everything, attend to little.** Cost lives in attention, not in sensing.
2. **Working memory is small on purpose.** If it does not fit, recall it or summarise it.
3. **Nothing is lost by inattention, only demoted.** Unattended percepts still become episodes.
4. **Facts have sources and confidence.** A fact without a supporting episode dies at the next sleep.
5. **Habits before thought.** Deliberation is for the new and the surprising.
6. **Predict, then compare.** Every action carries an expected outcome. Every expectation has a deadline.
7. **Drives make it autonomous.** No drive, no unprompted action.
8. **Understand emotion, do not perform it.** Appraisal is internal. Tone toward people comes from people models.
9. **The trace is the explanation.** "Why did you do that" is answered from the tick record.
10. **Autonomy is a dial the owner holds.** Irreversible or outward-facing actions need the identity's permission
    level, or the owner.

### 1.7 Chapters

2. Perception
3. Attention and working memory
4. Memory: episodic, semantic, procedural
5. Consolidation (sleep) and forgetting
6. Drives, appraisal and identity
7. Executive: goals, planning, action selection, monitoring
8. Tools and the LLM
9. Learning
10. Debugger, safety, and the eldon3 mapping
11. Milestones and the test harness
