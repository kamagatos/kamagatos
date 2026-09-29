- during context reconciliation:
    - Make sure there's no discrepency in the world view (agent has to settle contradicting ideas)

- we need to have assumptions about what the interlocutor knows (rooted in something, e.g. past interactions, ...)

- We also need to have a learning loop where:
    - Agent asks why after some interactions: e.g.
        - why did the user refused something, or recommended something
        - why did 2+ seemingly similar interactions result in different outcomes

## heartbeat

Run a loop every 10 min per agent. If the agent has been idle, "boredom" kicks in. Boredome is basically the agent's
tendency to do something unprompted based on its identity. For example, a security agent will spend some time reading
interesting blog posts, browse x.com's security accounts, ...

## Context

### Focus tool

The agent has a context:focus tool, that let it focus its objective on a specific task, while still being aware of the
bigger picture

## Misc

How to determine the agent's last activity? Where do we store that information? `agent.last_activity`?
