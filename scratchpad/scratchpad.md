## Overview

A Context is an abstract representation of objects and actions in a given space and time. A Context for the following
image looks like this:

The Current Context represents here and now from the perspective of the agent. Any Context outside of here and now is
called a Secondary Context.

## Time

- We need to be able to slice down time into meaningful chunks

## Location

## Entities

Break down the text enclosed within the resource tags (resource) into a graph of abstract entities. Here are the rules
to construct the graph:

- Don't list the nodes. Write directly the relationships.
- Only use the following node types:
    - Entity
    - Attribute
    - AttributeValue
    - Action
    - Event
    - Idea
    - CompositeAttributeType
    - CompositeAttributeValue
- The syntax for Entities is `Entity{value: "obama"}`
- The syntax for Actions is `Action{value: "eat"}`
- The syntax for AttributeType is `AttributeType{type: "race"}`
- The syntax for AttributeValue is `AttributeValue{type: "race", value: "black"}`
- The syntax for Event is `Event{date: { year: 1961, month: 8, day: 4 }}`
- The syntax for CompositeAttribute is `CompositeAttribute{attributes: [{ type: "race", type: "occupation" }]}`
- A NodeValue is always linked to a NodeType
    - For example `AttributeValue{type: "race", value: "black"} -> AttributeType{type: "race"}`
- An Entity is an abstract representation of the actual idea or object. Its value can be arbitrary, but it should be a
  short, underscore_separated, human readable identifier.
- When an Entity has a moniker used in the real world to refer to it (e.g. full name of a person), make it an
  AttributeType/AttributeValue combination.
- For example, A person name can be:
    - `AttributeType{type: "name"}`, `AttributeValue{type: "name", value: "Barack Obama"}`
    - `AttributeValue{type: "fullname", value: "Barack Obama"}` -> `AttributeType{type: "fullname"}`
    - `Entity{value: "obama"}` -> `AttributeValue{type: "fullname", value: "Barack Obama"}`
- Events link Entities and Actions to a moment in time (e.g. birth of a person).
    - For example `Event{date: { year: 1961, month: 8, day: 4 }}` -> `Action{value: "birth"}`
- `CompositeAttributeType` should always be used to combine multiple attributes. For example `american politician`
  should yield:
    - `CompositeAttributeType{attributes: [{type: "nationality"}, {type: "occupation"}]}`
    - `CompositeAttributeValue{values: [{ type: "nationality", value: "american" }, { type: "occupation", value: "politician" }]}`
    - `Entity{value: "obama"}` ->
      `CompositeAttributeValue{values: [{ type: "nationality", value: "american" }, { type: "occupation", value: "politician" }]}`
    - `AttributeValue{type: "nationality", value: "american"}` -compose->
      `CompositeAttributeValue{values: [{ type: "nationality", value: "american" }, { type: "occupation", value: "politician" }]}`
    - `AttributeValue{type: "occupation", value: "politician"}` -compose->
      `CompositeAttributeValue{values: [{ type: "nationality", value: "american" }, { type: "occupation", value: "politician" }]}`
- The output format should follow the pattern Node{attributes...} -relationship{attributes...}-> Node{attributes...}

    - Where each node-relationship-node should be on a new line

- An Action an also have Attributes linked to it. (sleep + profound, drive + fast)
- A combination Action + Attribute -> CompositeAction, which also have unique ids

## Context

For every turn we need to provide the agent a context that includes:

1. Personal context (who am I)
2. Timeline context (what few other contexts preceded the current one, by decreasing granularity)
3. Current context (What I am currently doing)

## Synapses

Each synapse is a:

```ts
interface Synapse {
    node_a: int64
    node_b: int64
    triggering_decay: int32
    connection_strength: int32
}
```

when processing tokens, each token at the time of the processing is given a maximum triggering decay (e.g 1). For every
next token processed, the triggering decay is decremented linearly.
