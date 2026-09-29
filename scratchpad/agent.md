# Abe (Artificial Brain Engine)

This document proposes Abe (Artificial Brain Engine): A mechanism to artificially replicate certain aspects of brain
functions.

The brain is a vast and complex machine, and we can’t possibly cover all its functions that makes us humans. Instead, we
will limit the scope of this document to specific areas such as memory, reasoning, language, vision, and hearing.

---

## Goals

- **Intelligence:** the agent can reason like a human;
- **Hallucination:** the agent does not Hallucinate;
- **Reliability:** the agent follows orders precisely;
- **Debuggability:** we are able to see each step of the agent’s decision making process;
- **Performance:** the agent can run efficiently on an average CPU (e.g. IphoneX);

---

## Non-goals

- Consciousness is not a goal.
- The agent needs to understand human emotions, but doesn’t need to exhibit it – _(We need to carefully review this
  sentence, because many decisions we make are made based upon emotions. So we can’t just forgo that)_

---

## The existing

As of today, all big actors (OpenAI, Anthropic, Meta, and Google) are using the same technique to create their AI
models:

1. They pre-train a transformer neural network on a massive corpus of data that’s been sampled from the internet. The
   output of that training is a base model.
2. They fine tune the resulting pre-trained model based on the intended usage (e.g. codex vs gpt) using RLHF.

---

## Assumptions

- Mimicking the human brain will lead to models that can learn more effectively than the incumbents.

---

## Prerequisites

- We will probably need to do a lot of trial and error while testing various theories. For that, we will need to be able
  to visualize the learning & decision making process of our agent. We’re creating a separate visualizer (called
  debugger) for that purpose.
- We need a benchmark on intelligence. I propose we use the Abstraction and Reasoning Corpus (ARC). If we’re successful,
  our agent should get a 100% success rate as the slightly above average human would.

---

## Design

### Overview

One thing that characterizes humans is the continuous and infinite interaction cycle between our environment and our
brain through sensory inputs and motor outputs. We see a beautiful flower, we get closer to smell it. We hear our name,
and we turn around to see who’s calling. Too much light, and our pupils constrict. These interactions define our human
experience.

In the next sections of this document, we will discuss how sensory inputs are produced, how we will capture and simulate
them, and how our brain engine will process them to experience the world.

### Sensory inputs

Sight, smell, taste, touch, and hearing are the five basic human senses that help us understand the world around us. We
are equipped with organs that detect stimuli (i.e. changes in the environment) that are transformed into electrical
signals and then interpreted by our brain. This transformation process is called **transduction**.

- In the case of **vision**, the stimulus is photons (light).
- For **hearing**, the stimulus is air vibrations (sound waves).
- For **smell**, the stimulus is odor molecules.
- For **touch**, the stimuli can be pressure, temperature, or pain.

### Transduction process

The brain continuously analyzes a stream of stimuli over time to create a representation of the world at any given time.
We call this representation of the world a **Context**.

We’ll dive more into how each sensory receptor works, but for now let’s see how we go from a stream of stimuli to a
Context.

---

## Context

A Context is an abstract representation of objects and actions in a given space and time. A Context for the following
image looks like this:

```json
{
    "entities": [
        {
            "id": "123",
            "type": "entity", // type can be "entity" or "group" -> e.g. group of people
            "entity": "@cat",
            "attributes": {
                "size": {
                    "value": "@normal"
                },
                "color": {
                    "value": "@orange"
                }
            },
            "actions": [
                {
                    "action": "@sit"
                }
            ],
            "space": {
                "direction": "+left"
            },
            "entities": [
                {
                    "id": "iop",
                    "entity": "@tail",
                    "attributes": {
                        "size": "@long"
                    }
                }
            ]
        },
        {
            "id": "456",
            "entity": "rock",
            "attributes": {
                "color": {
                    "value": "@gray"
                }
            },
            "actions": [],
            "space": {
                "position": {
                    "position": "below",
                    "entities": [
                        {
                            "id": "123"
                        }
                    ]
                }
            }
        },
        {
            "id": "789",
            "entity": "tree",
            "attributes": {
                "color": {
                    "value": "@brown"
                }
            },
            "actions": [],
            "space": {
                "position": {
                    "position": "below",
                    "entities": [
                        {
                            "id": "123"
                        }
                    ]
                }
            },
            "entities": [
                {
                    "entity": "leaves",
                    "missing": true
                }
            ]
        }
    ]
}
```

The **Current Context** represents here and now from the perspective of the agent. Any Context outside of here and now
is called a **Secondary Context**.

### Current context

The current context is created by analyzing and extracting Entities and Entity actions from stimuli.

An Entity can be an object in the physical world,

Sight and hearing are two special senses because in addition to describing the Current Context, they can also describe
Secondary Contexts which happen outside of here and now.

### Linear representation of context creation

When a stimulus comes, its receptor’s job is to extract

- Sight
- Hearing

There are two types of learning:

- Causality learning
- Attribute learning

#### Causality learning

Impact learning is learning the relationship between Actions and their impacts.

#### Attribute learning

Attribute learning is learning the various values that an entity’s attribute can take.

An agent can either learn in a passive or active way:

- **Passive learning** is done through observation.
- **Active learning** is done by trying to reproduce the impact (in the case of impact learning).

---

## Events and Stimulations

In our simulation, stimulations will be either text, gps location, weather information…

### Context

A context is a constantly updating internal description of the world around us. It tries to answers questions such as:

- Where am I?
- What time is it?
- What is around me?
- Who is around me?
- What are they doing?

A Context is built based on the constant stream of Event. When an event comes in, a person tries to infer the maximum
amount of information from it in order to have the most up-to-date Context possible, while spending the least amount of
energy.

It does so by:

1. Reusing the existing Context object as much as possible.
2. Inference based on Knowledge. Knowledge is the set of internal facts that we learn over time. (e.g. Simple physics,
   general heights of humans...) and Inference is a list a possibilities based on the current Context and a person's
   Knowledge.

```text
{Current Context} + {Event} + {Knowledge / Inference} = {New Context}
```

---

## Memory

A Memory is the description of a Context over space and time.

It describes how we went from $M_0$ to $M_n$.

After a Memory is created, The Knowledge creation process kicks in. Going through all of the Memories created since the
last run and trying to find patterns in it, or linking it to other similar memories. So a Knowledge points to multiple
memories spread across time and space.

Another process that occurs is the Memory Compacting process, which consists of combining multiple Memories into blocks
of Memories.

Every time a new block is created, some details are dropped from the memories that got combined together, so some links
to Knowledges are destroyed. When a Knowledge doesn't have a link to a memory anymore, the Knowledge is destroyed.

---

## Universal concepts

The World is composed of three fundamental elements:

- Entities
- Time
- Space

And a fourth derived Element called a **Change**.

Everything we know and experience derive from those four elements.

### Entity

An Entity is the abstract representation our brain creates of "things" in the physical worlds (e.g. tree, person, apple,
rock).

It has a set of characteristics shared amongst all Instances of that entity. All trees, for example, have a general
color, size, and shape. It is most often an hierarchical combination of multiple entities (e.g. head → eyes + nose +
ears + mouth).

The abstraction of a tree might look like this:

```javascript
{
  id: 123,
  shape: getShape([1, 3], [4, 5]),
  color: getColor("#ababab"),
  size: getSize(10)
}
```

A **ContextualEntity** is the representation of an entity in a particular context.

A tree can be in a forest or in a backyard. A person can be seating or standing.

Depending on the type of stimulation (visual, auditory ...), the set of properties in a ContextualEntity might change. A
visual entity might have a shape, whereas an auditory entity might have an intensity.

### Time & Space

Time and Space are (WIP)

### Change

A Change is the modification of the state of a ContextualEntity over Time and Space.

An Action is a sequence of Changes from one or more Entities in a recognizable pattern. An Action can also be a sequence
of multiple Actions.

**Examples:**

- An apple falls → Entity Apple moves from point A to point B over 1sec.
- Someone walks → Action(Step) + Action(Step) + Action(Step)

### Identity

The Identity of an Entity or an Instance is the set of probabilities that each of their characteristics has a given
value.

For example, the Entity Apple could be:

```text
Apple {
  color: {
    "red": 0.3,
    "red_yellow": 0.3,
    "yellow": 0.2,
    "green": 0.2,
  }
}
```

If we bought a bag of red apples, the Instance of a random Apple could be:

```text
Apple {
  color: {
    "red": 0.9,
    "red_yellow": 0.1
  }
}
```

Instances have stronger probabilities as their probabilities are reinforced at every new encounter.

If for example we met someone with blue eyes, after tens of encounters with the person, we could confidently respond
“blue” if we were asked what the color of their eyes were.

For instances on the other hand, the probability distribution for various possible values of a characteristic is the
probability of one instance having the given value.

For example, if one asks to imagine a person living in west Africa, one would probably picture a black person. So the
probability of having a dark skin is very high in this context.

### Anomaly

### Thoughts

### Time patterns

One important aspect of planning is the ability to detect time patterns and cycles. A day is a cycle. A year with
repeating season is a cycle.

Detecting repeating cycles allows us to plan for future needs by creating more realistic contexts when thinking about
the future.

### What data structure can we use to identify Entities?

We could use a recursive object where each key is a combination of characteristics and values (e.g. share_triangle) and
the content contains a node property of the same type as the parent.

```typescript
Type Node = {
  isLeaf?: boolean
  entity: string
  nodes?: {
    [id: string]: Node
  }
}
```

```javascript
const node = {
  "color_red": {
    nodes: {
      "size_medium": {
        nodes: {
          "shape_square": {
            isLeaf: true,
            entity: "xyz"
          },
        }
      },
      "size_small": {
        ...
      },
      "size_big": {
        ...
      }
    }
  }
}
```

### Ephemeral Contexts

The brain keeps a Main Context (where am I, in which Space, what Time is it, who is with me, what are we doing…). It
also keeps some Ephemeral Contexts, focused on a given activity (Playing chess, watching a movie…).

### On Space

As mentioned in the main writeup about Abe, there are three universal concepts: Entities, Time, and Space.

A Space is represented exclusively by a 2D Euclidian plane or a 3D Euclidian space. The Euclidian space allows us to
move around the world. The brain reverts to representing some situations in a Euclidian plane when reasoning about it
doesn’t require all the subtleties of a 3D model.

For example when playing chess, the brain could put all the pieces of the chess board on euclidian plane, rather than a
3 dimensional space.

Setting up and maintaining the Space is an important aspect of creating either the Main Context or Ephemeral Contexts.

The first thing we do while creating the space is to divide it into sections. On a 2d plane, we’ll have the following
sections:

We attribute the value of the lowest fitting section to the position attribute of the Context.

On this picture for example, most objects would get a bottom-left position.

---

## Virtual Environment

The virtual environment is a NxN 2D space in which the agent lives. It can contain objects called entities that occupy a
1x1 square. An example of an entity is a tool.

Since the environment is independent from the agent, and the agent lives in the environment, the first thing we do when
we start the simulation is to start the environment.

The environment exposes a state that is accessible to the agent via an api.

### Entities

An Entity is the description of a physical thing using a set of attributes.

For example a ball can be described as:

```text
{
  shape: Circle
  color: Red
  radius: 5
}
```

Two entities with the same attributes are the same entities. For example, the following are the same:
`{ shape: Circle }` and `{ shape: Circle }`

Any Entity with a set of attributes + some extra ones, is a subset of the Entity with the shared attributes.

| Entity A                       | Relation       | Entity B            |
| :----------------------------- | :------------- | :------------------ |
| `{ shape: Circle, radius: 5 }` | is a subset of | `{ shape: Circle }` |

| Entity A                                          | Relation       | Entity B                           |
| :------------------------------------------------ | :------------- | :--------------------------------- |
| `{ shape: Circle, color: [Red], radius: [5-6] }`  | Are subsets of | `{ shape: Circle, radius: [5-6] }` |
| `{ shape: Circle, color: [Blue], radius: [5-6] }` |                |                                    |

A given Entity can be a subset of multiple Entities:

| Entity A                       | Relation            | Entity B            |
| :----------------------------- | :------------------ | :------------------ |
| `{ shape: Circle, radius: 5 }` | is a subset of both | `{ shape: Circle }` |
|                                |                     | `{ radius: 5 }`     |

### Context

A Context is an object that keeps track of Entities state change across space and time.

In addition to entities, a context also contains some metadata such as:

- The environment’s attributes
- Various representations of the time:
    - morning, afternoon, evening…
    - day of the week
    - time of the day
    - date

A context uses “frames” to describe changes. For example, the following context contains two frames:

```json
{
    "initialState": {
        "entities": [{ "id": "123", "position": { "x": 1, "y": 1 }, "state": {} }]
    },
    "currentState": {
        "entities": [{ "id": "123", "position": { "x": 2, "y": 2 }, "state": {} }]
    },
    "changes": [
        { "type": "entity", "position": { "x": 1, "y": 2 } },
        { "type": "entity", "position": { "x": 2, "y": 2 } }
    ]
}
```

The first thing the agent does when booting up is to create its current Context.

There are two types of contexts: **Real contexts** and **Imaginery contexts**.

- The **Real Context** is bound to the space and time in which the agent evolves.
- An **Imaginary context** is bound to a fabricated space/time.

An imaginary context can be created from Memory (replay), Stories (book, TV), or the Planner (playing out scenarios…).
Imaginary contexts are always linked to the primary Context (e.g. reading a book).

Both real and imaginary contexts are recursive, meaning that they can contain subcontext of the same types:

- Real Context -> Playing a video game
    - Sub-context 1 (imaginary context) -> the video game world
        - Sub-context 2 (imaginary context) -> a puzzle within the video game

### Knowledge DB

When the agent encounters an entity, we query the database with its observed attributes to determine whether we know it
or not. If we don’t, we add a new entry to the database with its attributes and a link to the current context.

```json
{
  "attributes": {
    "shape": "Circle",
    "color": "Red",
    "radius": 5
  },
  "context": { "..." }
}
```

### Task Queue

Every action taken by the agent is first added to a list, prioritized relatively to other actions in that list, and then
possibly executed.

The agent has an internal clock that ticks every second. At every tick, the agent decides to either continue what it’s
doing, complete the task it’s doing, and pick up the next one with the highest priority, or reschedule what it’s working
on because there’s a task with a higher priority in the list.

When a new event comes in, it’s automatically pushed to the top of the list for prioritization at the next tick.

### Interactions

The agent interacts with the entities using a set of basic functions (move up, move down, touch, release, push, pull…)

The agent needs to face an entity before it can call a function on it. When it calls a function on an entity, the entity
can either ignore the signal, or update its state.

The agent observes the relationship between calling a function on an entity, and how the state of that entity changes
during the following frames.

### Memory

After a Memory is created, The Knowledge creation process kicks in. Going through all of the Memories created since the
last run and trying to find patterns in it, linking it to other similar memories, or associating it to Entities.

Another process that occurs is the Memory Compacting process, which consists of combining multiple Memories into blocks
of Memories.

Every time a new block is created, some details are dropped from the memories that got combined together, so some links
to Knowledges are destroyed. When a Knowledge doesn't have a link to a memory anymore, the Knowledge is destroyed.

The role of Memory compacting is to optimize access to the memories and reduce the storage space it occupies.

### Actions

An action is a recognized pattern of the movement of an entity over space and time.

As an example, when we see someone making the movement to sit down at t0, we update our Context with the person being
seated based on our knowledge of the meaning of that movement.

Another example is the outcome of a glass falling from the 10th floor:

```javascript
const predictions = getPredictions(currentContext, knowledge)

// predictions
[
  { probablity: .9, outcome: GLASS_BREAK },
  { probablity: .1, outcome: GLASS_DOESNT_BREAK },
]
```

### XYZ

Humans learn over time to recognize danger and dangerous situations. A dangerous situation is a situation that can lead
to a bad outcome.

There are three motivations:

1. Avoid bad outcomes
2. Want good outcomes
3. Emotions

The proximity score determines the level of attachment and closeness we have toward someone. It’s calculated based on
the number of interactions we have with someone, the duration, the recency, and the quality of each interaction:

```javascript
const p = sum(InteractionQuality * InteractionRecency * InteractionDuration)
```

`InteractionQuality`

Old contexts become Memories.

---

## Buffers

Most times, we don't have all the information necessary to correctly identify all objects in an environment and predict
what they will do with only one event.

### Example

#### `time = 0`

- A visual stimulation is received. It's the image of a tree and a dog, and nothing else.
- We're blindfolded before the scene, so we have no pre-existing context. We are in a New Stimulation Context.
- In the parsing phase, we identify a tall object and a smaller object (Identification based on knowledge graph
  filtering).
- Based on existing knowledge, we recognize the big object as a tree. We're not yet sure about the smaller object, but
  it seems to have legs, has a 10:1 size ratio with the tree and has a width/height of 5:1.
- Based on that information we start making assumptions:
    - Based on the size of the tree, we're probably outdoors.
    - Based on various information we're able to collect, the second object is probably an animal.
    - Based on the size, it's either a dog or a cat.
- After the assumptions, we start making predictions:
    - Trees don't move, so we expect the tree to be exactly at the same place for the next event.
    - No prediction can be done for the unidentified object.

#### `time = 1`

- Two new simulations are received. An image and a sound. We already have an existing context.
- We quickly confirm the tree is still there and is still a tree.
- We focus back on the smaller object in the image. It's moved one centimeter in $\Delta t = t_1 - t_0 = 1\text{ unit}$.
- We also identify a tail and a few other details. The probability of it being a dog increases.
- Parsing the sound event confirms it's indeed a dog.
- We start the prediction phase.
- Based on the accumulated previous events, and our historical data, we predict the dog will be 1 unit away from its
  current position in the next image.

---

## 2. Entities

When a stimulation happens, we transform it into a list of contextual entities.

An Entity is the abstract representation our brain creates of "things" in the physical worlds.

An entity has a set of attributes shared amongst all instances of that entity. All trees, for example, have a general
color, a size, and a shape.

The abstraction of a tree might look like this:

```javascript
{
  id: 123,
  shape: getShape([1, 3], [4, 5]),
  color: getColor("#ababab"),
  size: getSize(10)
}
```

A ContextualEntity is the representation of an entity in a particular context.

A tree can be in a forest or in a backyard. A person can be seating or standing.

### Interactions

- Language
- Curiosity
- Taste
- Reward system
- Fighting boredom
- Increasing satisfaction of owner

---

## Testing

We need to create a simulated real-world environment in order to test the agent (Waymo does something similar to test
self-driving cars). We can simulate end-user prompts as well. This is the only way to make sure our agent is ready for
what real-world throws at it.

---

## Overview

In order to create an intelligent agent, we will need to solve a few dependent high level components:

1. **The agent’s architecture.** This is the code that will interpret and react to external events.
2. **The environment.** This is the interface through which the agent will interact with the world.
3. **The training data and the training runner.** This is how the agent will learn about the world.

### Agent’s architecture

The agent’s architecture is composed of a few main components:

- **A sensor component.** This is the perception part. It takes a set of inputs and turns it into an abstract
  representation of that input.
    - The initial part of the sensor component we will probably work on is written language.
    - After that we will expand to microphone, camera, thermometer and so on (using techniques like computer vision and
      speech recognition).
- **An interpreter.** Rule/Routing engine that takes a set of abstract ideas with various probabilities pertaining to
  the current context, create an understanding of it, and route it to the appropriate executer.
- **The executer.** Plans and executes an action based on the output of the interpreter.
- **Memory.** All previous components use the memory as part of the processes.
- **Context.** This is strongly tied to knowledge representation.
- **Other.** Automated reasoning, decision making, Movement/Kinetics/Robotics, pattern recognition and
  extrapolation/generalization.

There are other supporting components such as a background job that turns short term memory into long term ones, or a
reward/objective function that’s used by the interpreter and the executer to function.

- TODO: Add schema
- TODO: Add a state machine/diagram for the agent life (infinite control loop)

### Environment

Our agent evolves in a simulated environment which exposes tools that allow it to interact with the real world.

A tool is the means through which we exchange information with the agent. It can be a terminal, a temperature sensor, or
a browser for example.

A tool exposes atomic operations, which are the lowest level operations that can be achieved through it. Atomic
operations can be executed sequentially within a defined context to perform more complex operations.

Most complex operations will take into account space and time because (as we'll discuss further down), most reward
functions will be space and time dependent.

In order to be helpful, the agent needs to have some level of familiarity with the environment in which it evolves. The
core tool, is a tool that gives the agent real time access into some aspects of the real world such as:

- The temperature
- The GPS location
- The Moment of the day (I’ll define in detail what moment means later on, but the TL;DR is that time perception is )

---

## Milestone 1

### Goal

The goal of M1 is for our agent to learn how to play tic-tac-toe while setting up the basis of our new architecture.

**Exit criteria:**

- The agent should always play a "perfect game" (i.e. never lose) no matter who is playing against and who starts first.
- When debug mode is enabled, the agent is able to explain each move (e.g. I have to block two Xs in the same row).
- Each turn is played in less than 50ms.
- _Nice-to-have:_ the agent remembers "some" games it played in the past (especially recent ones or when something
  unexpected happens such as the opponent making unusual moves).

### Why?

The rules of Tic-tac-toe are simple enough to allow us to manually test many components of our architecture,
specifically vision, reward functions, constructs, memory, reasoning, and planning.

### Architecture

For M1, our agent only has access to the tic-tac-toe tool, and exposes only one atomic operation which is
`move(entity, to(x, y))`.

Here’s the general step-by-step process to implement M1:

1. Figure out the list of priors needed to play tic-tac-toe. The priors are few and extremely high level (such as self,
   and others)
2. Create the initial context manually (the context might only contain the 2D space, and a “goal” entity)
3. The entry point of the loop is the vision. Frame 1 is captured

---

## External literature

### On the measure of intelligence

- https://en.m.wikipedia.org/wiki/Fuzzy_logic
- AIMA book (the bible of the subject; could be use during implementation phase):
  https://www.amazon.com/Artificial-Intelligence-A-Modern-Approach/dp/0134610997

### Fuzzy Agent

- https://doi.org/10.1007%2F978-3-540-70812-4_15

### Competitive landscape (as of 2020)

- https://gcrinstitute.org/papers/055_agi-2020.pdf

### CNNs (Lecun et al. 1995)

- http://www.iro.umontreal.ca/~lisa/pointeurs/handbook-convo.pdf

### Memory Engrams

- https://www.science.org/doi/10.1126/science.aaw4325

---

## Glossary/Definitions

- **Agent:** Anything that can be viewed as perceiving its environment through sensors and acting upon that environment
  through actuators.
- **Learning rate:** TBD
- **AGI:**
    - **Turing test:** "should have to pass as human in a text conversation"
    - **Total Turing test:** "The candidate must be able to do, in the real world of objects and people, everything that
      real people can do"
    - **Wozniak test:** "can enter a random house and figure out how to make a cup of coffee"
    - **LeCunn test:** None ("no such thing because even humans are specialized")

---

## Open questions

- How crucial are emotions in terms of quality/quantity of learning? Do fight-or-flight moments make us learn deeper and
  forever? Does hope and excitement help with the quality of learning?
- If we build a human-like agent, we will end up with an agent that might have been great a algebra in the past but now
  doesn’t recall much about it and is now instead great at piano
- **Sleep:** This is where we merge short-term memory into long term-memory tree (long context window). Does sleep help
  prioritizing at what depth each information node lands on the memory tree? Or is it done a every time a related
  information node get prioritized (e.g. I wanna buy tickets for summer Olympics so I don’t wanna forget about it. Each
  time my favorite sport plays on TV it sends a weak signal to my brain to "remember" to buy Olympics tickets)?
- **Dream:** small simulation to prepare the agent for interacting with the "real world" in "the next day". It's either
  about something it fears/dreads of or something it looks/hopes for.

---

## Ideas

- **Diversity/Multi-agent architecture:** the way out agent will be designed means that it will purposefully not learn
  from the majority of observations. I suggest storing those "useless" observations in a queue and spin out new agents
  that will pick them and learn from them. This way, the sum of intelligence of all agents will be significantly larger
  than any single agent.
- **Ability to run algorithms:** contrarily to humans, computing power of machines can scale through cloud computing. I
  think we should leverage that to make agents able to run traditional algorithmics when the problem at hand could be
  solved via algos (e.g. binary search).
- **Response tuning:** humans typically start with "a" solution (e.g. software pseudo-code) and then iterate on it until
  satisfied with the result. I think that computer agents should be able to do the same, especially given their
  computing speed.
- **Memory:** we need to trim the memory tree when the agent sleeps to make sure information search-and-retrieval speed
  is within specs (i.e. <50ms). Based on that, any information that is “old-enough” will be forgotten (and could be
  grabbed by other agents?). Note that this is similar to humans who have a limited memory-capacity and so recently
  accessed information can be fetched (recalled) very fast and tend to fade-out when it has not been fetched/updated
  recently.
- Maybe we have to explicitly tech the patterns to the agent. For example in the case of number recognition, instead of
  using label, or letting it figure out the patterns, can we just explain it what the patterns are? for example an 8 is
  two closed loops on top of each others?
