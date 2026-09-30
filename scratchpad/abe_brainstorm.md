# Abe brainstorm (consolidated)

Merged from `agent.md`, `agent_ideas.md` and `business_ideas.md`. Same ideas, grouped by theme, duplicates folded. Items
marked _(open)_ are questions or unfinished sections from the originals.

---

## 1. What Abe is

Abe (Artificial Brain Engine) replicates a few brain functions: memory, reasoning, language, vision, hearing. Not the
whole brain.

### Goals

- **Intelligence:** reasons like a human.
- **No hallucination.**
- **Reliability:** follows orders precisely.
- **Debuggability:** every step of a decision can be inspected.
- **Performance:** runs on an average CPU (e.g. iPhone X). Memory lookups under 50ms.

### Non-goals

- Consciousness.
- Showing emotions. It must understand them. _(open: many decisions are emotional, so we can't ignore them fully.)_

### Bet

Mimicking the brain gives a model that learns better than the incumbents. Today OpenAI, Anthropic, Meta and Google all
do the same thing: pre-train a transformer on internet text, then fine-tune with RLHF.

### Prerequisites

- **Debugger:** a visualizer of the agent's learning and decision process. Needed for trial and error.
- **Benchmark:** ARC (Abstraction and Reasoning Corpus). Target 100%, like a slightly above-average human.
- **Simulated world:** the only way to test the agent before the real world does (like Waymo). Simulated user prompts
  too.

---

## 2. Universal concepts

The world has three base elements, **Entities**, **Time** and **Space**, and one derived element, **Change**.

### Entity

The brain's abstraction of a "thing" (tree, person, apple). Attributes shared by all instances (trees have a color,
size, shape). Often a hierarchy of entities (head → eyes + nose + ears + mouth).

```javascript
{ id: 123, shape: getShape([1, 3], [4, 5]), color: getColor("#ababab"), size: getSize(10) }
```

- Two entities with the same attributes are the same entity.
- An entity with extra attributes is a subset of the entity with the shared ones: `{shape: Circle, radius: 5}` is a
  subset of `{shape: Circle}` and of `{radius: 5}`.
- A **ContextualEntity** is an entity in a given context (a tree in a forest, a person sitting). Its attributes depend
  on the sense: visual entities have a shape, auditory ones an intensity.

### Identity

The identity of an entity or instance is the probability of each attribute taking each value.

```text
Apple { color: { red: 0.3, red_yellow: 0.3, yellow: 0.2, green: 0.2 } }   // the entity
Apple { color: { red: 0.9, red_yellow: 0.1 } }                            // an instance from a bag of red apples
```

Instance probabilities sharpen with each encounter (after many meetings you know someone's eye color). Entity
probabilities depend on context (a person from West Africa is probably dark-skinned).

### Change and Action

A Change is the modification of a ContextualEntity's state over time and space. An Action is a recognizable pattern of
Changes, and can be a sequence of Actions.

- An apple falls → Apple moves from A to B over 1s.
- Someone walks → Step + Step + Step.

Recognized actions update the context (we see the sitting movement, we mark the person as seated). Knowledge also gives
predictions:

```javascript
getPredictions(currentContext, knowledge)
// [{ probability: .9, outcome: GLASS_BREAK }, { probability: .1, outcome: GLASS_DOESNT_BREAK }]
```

### Space

A 2D plane or 3D Euclidean space. The brain drops to 2D when 3D adds nothing (a chessboard). Space is split into
sections; an entity gets the lowest fitting section as its position (e.g. bottom-left).

### Time

_(open: section is WIP.)_ Time patterns matter for planning: detecting cycles (day, year, seasons) lets us build
realistic future contexts.

### Anomaly, Thoughts

_(open: headings only in the original.)_

---

## 3. Context

A Context is the agent's constantly updated description of the world: where am I, what time is it, what is around me,
who, doing what.

```text
{Current Context} + {Event} + {Knowledge / Inference} = {New Context}
```

Each event should yield the most information at the least cost: reuse the existing context, then infer from knowledge
(simple physics, usual human heights...).

### Shape

Entities with attributes, actions, spatial relations, nested entities (a cat with a long tail, a tree with missing
leaves), plus metadata: environment attributes and several views of time (morning/afternoon, weekday, time, date).
Changes are recorded as frames: initial state, current state, list of changes.

### Kinds of context

- **Current / Real context:** here and now, bound to the agent's real space and time. The first thing the agent builds
  at boot.
- **Secondary / Imaginary context:** a fabricated space and time. Comes from Memory (replay), Stories (book, TV) or the
  Planner (playing out scenarios). Always linked to the real context. Sight and hearing are special: they can describe
  secondary contexts too.
- **Main vs Ephemeral:** the main context is the big picture; ephemeral ones focus on one activity (chess, a movie).
- Contexts nest: Real (playing a video game) → Imaginary (the game world) → Imaginary (a puzzle in the game).

### Focus tool

A `context:focus` tool lets the agent narrow its objective to one task while staying aware of the bigger picture.

### Reconciliation

When updating the context, contradictions in the world view must be settled, not kept side by side.

### Buffers: building a context over several events

One event rarely identifies everything. Example:

- **t=0**, blindfold off: image of a tall thing and a small thing. Tall thing is a tree (knowledge graph filter). Small
  thing has legs, 10:1 size ratio, 5:1 aspect: probably an animal, dog or cat. Assumptions: we're outdoors. Predictions:
  the tree won't move; none for the small thing.
- **t=1**, image + sound: tree confirmed. Small thing moved 1cm, shows a tail, and the sound says dog. Predict it will
  be 1 unit further next frame.

---

## 4. Perception

Senses turn stimuli into signals (transduction): photons for sight, air vibrations for hearing, molecules for smell,
pressure/temperature/pain for touch. A receptor extracts entities and entity actions from the stimulus.

In the simulation, stimuli are text, GPS location, weather... The sensor component starts with written language, then
microphone, camera, thermometer (computer vision, speech recognition).

---

## 5. Memory and knowledge

- A **Memory** is a context over space and time: how we got from M0 to Mn. Old contexts become memories.
- **Knowledge** is the set of facts learned over time. A Knowledge points to several memories across time and space.
- **Knowledge creation** runs after memories are created: scan the new memories for patterns, link them to similar
  memories or to entities.
- **Memory compacting** merges memories into blocks to speed access and save space. Details get dropped, links to
  knowledge break, and knowledge with no memory left is destroyed.
- **Trimming:** memory is pruned during sleep so lookups stay under 50ms. Old-enough information is forgotten (recently
  used information is fast to recall, unused fades). Forgotten items could be picked up by other agents.

### Knowledge DB

On meeting an entity, query the DB by observed attributes. Unknown → insert attributes plus a link to the current
context.

A candidate index is a recursive tree keyed by `attribute_value`:

```javascript
{ color_red: { nodes: { size_medium: { nodes: { shape_square: { isLeaf: true, entity: "xyz" } } } } } }
```

### Sleep and dreams _(open)_

- Sleep merges short-term memory into the long-term tree. Does sleep decide how deep each node lands, or does every
  related signal re-prioritize it (each time my sport is on TV I'm nudged to buy Olympics tickets)?
- Dreams: a small simulation to prepare for tomorrow, about something feared or hoped for.
- Human-like forgetting means an agent great at algebra could later be great at piano and rusty at algebra.

---

## 6. Learning

- **Causality (impact) learning:** relationship between actions and their effects.
- **Attribute learning:** the values an entity's attribute can take.
- **Passive** (observation) vs **active** (try to reproduce the effect).
- **Ask why:** after interactions, the agent asks why the user refused or recommended something, or why two similar
  interactions ended differently.
- **Model of the interlocutor:** assumptions about what the other party knows, rooted in past interactions.
- **Explicit patterns:** maybe teach patterns directly instead of labels (an 8 is two stacked closed loops).
- **Diversity / multi-agent:** the agent deliberately ignores most observations. Queue the "useless" ones and spin up
  other agents to learn from them. The sum of agents knows more than any one.

---

## 7. Motivation and drives

Three motivations: avoid bad outcomes, want good outcomes, emotions. Danger is learned: a situation that can lead to a
bad outcome.

Drives listed for the agent: language, curiosity, taste, reward system, fighting boredom, increasing the owner's
satisfaction.

**Proximity score** (attachment to someone): `sum(quality * recency * duration)` over interactions. _(open:
InteractionQuality undefined.)_

**Heartbeat:** a loop every 10 min per agent. If idle, boredom kicks in: the agent does something unprompted, in line
with its identity (a security agent reads security blogs, browses security accounts on x.com). _(open: where to store
last activity, `agent.last_activity`?)_

---

## 8. Architecture

Three dependent pieces: the agent, the environment, the training data and runner.

### Agent components

- **Sensor:** input → abstract representation.
- **Interpreter:** rule/routing engine. Takes probable abstract ideas about the current context, builds an
  understanding, routes to an executer.
- **Executer:** plans and runs an action.
- **Memory** and **Context**: used by all of the above.
- **Background jobs:** short-term → long-term memory; a reward/objective function used by interpreter and executer.
- **Other:** automated reasoning, decision making, kinetics/robotics, pattern recognition, generalization.

_(open: TODO schema and a state diagram of the infinite control loop.)_

### Task queue and clock

Every action goes to a prioritized list first. An internal clock ticks every second; at each tick the agent continues,
completes and picks the next highest-priority task, or reschedules because a higher-priority task arrived. New events go
to the top of the list for the next tick.

### Machine advantages

- **Run algorithms:** use cloud compute and classic algorithms when they fit (binary search).
- **Response tuning:** draft a solution, then iterate like a human writing pseudo-code, but at machine speed.

### Environment and tools

The agent lives in a simulated environment exposing tools to the real world (terminal, temperature sensor, browser). A
tool exposes atomic operations; sequences of them in a context make complex operations. Most reward functions depend on
space and time. A **core tool** gives real-time access to temperature, GPS, moment of the day.

### Virtual environment (for training)

- NxN 2D grid started before the agent; entities occupy 1x1; state exposed through an API.
- The agent uses basic functions (move up/down, touch, release, push, pull). It must face an entity first. The entity
  ignores the call or updates its state, and the agent learns the link between the call and the next frames.

---

## 9. Milestone 1: tic-tac-toe

Learn to play tic-tac-toe while laying the architecture's foundation. Simple rules let us hand-test vision, reward,
constructs, memory, reasoning and planning.

Exit criteria:

- Never loses, whoever plays and whoever starts.
- In debug mode, explains each move ("block two Xs in a row").
- Under 50ms per turn.
- Nice to have: remembers some past games, especially recent or surprising ones.

Setup: one tool, one atomic operation `move(entity, to(x, y))`. Steps: list the priors (few, high-level: self, others),
build the initial context by hand (2D space plus a goal entity), enter the loop through vision with frame 1.

---

## 10. Business ideas

- **Agent identities.** _(open: heading only.)_
- **Agent store:** Amazon for agents. Amazon's ad model breaks when agents browse and show users a shortlist.
- **API marketplace:** like composio.dev.
- **Central OAuth / API manager:** connect your apps once, manage agent access there, expose it as MCP / CLI.

---

## 11. Open questions (gathered)

- How much do emotions drive learning? Do fight-or-flight moments imprint forever? Does hope help?
- Emotions as a non-goal needs a second look (see §1).
- Time section, Anomaly, Thoughts, Agent identities: unwritten.
- Sleep depth prioritization, dreams, skill decay (see §5).
- InteractionQuality definition, where to store last activity (see §7).
- Architecture schema and control-loop diagram (see §8).

---

## 12. References

- AIMA book: https://www.amazon.com/Artificial-Intelligence-A-Modern-Approach/dp/0134610997
- Fuzzy logic: https://en.m.wikipedia.org/wiki/Fuzzy_logic
- Fuzzy agent: https://doi.org/10.1007%2F978-3-540-70812-4_15
- AGI landscape 2020: https://gcrinstitute.org/papers/055_agi-2020.pdf
- CNNs (LeCun 1995): http://www.iro.umontreal.ca/~lisa/pointeurs/handbook-convo.pdf
- Memory engrams: https://www.science.org/doi/10.1126/science.aaw4325

### Glossary

- **Agent:** perceives its environment through sensors, acts on it through actuators.
- **AGI tests:** Turing (pass as human in text), Total Turing (do everything people do in the world), Wozniak (make
  coffee in a random house), LeCun (none, humans are specialized too).
