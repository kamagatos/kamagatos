1. **Features.** This stage finds mentions, dates, amounts, URLs, reply markers, "urgent" tokens, and the language,
   using regex and parsers. Time expressions ("two weeks ago", "on Monday", "at 5:15", "in 1965", "today") become a
   **time range at a grain**, and place expressions ("in Notion", "in the Acme thread") become a **subtree of the map**.
   Both are cues for recall (13.4).

    Should we simply use a very cheap model with low latency to extract these info for a higher accuracy. Using code
    might be very brittle and error prone. e.g. different language, typos, ...

2. **Recognition.** This stage resolves entities against semantic memory. It tries identifiers first (email address,
   page id, calendar id), then names. A match fills `actor` and `entities`. When neither matches, a third pass
   identifies **by pattern** (4.11): the percept's behaviour (its pace, timing, place, style) is matched against the
   patterns of known entities, and instead of nothing the percept gets a _candidate distribution_ over actors ("moves at
   this pace, at this hour: Ari 0.6, Sam 0.3"). The distribution narrows with each further percept; this is the
   brainstorm's dog-or-cat example. Only when no pattern fits either does the percept create a new candidate entity.

    Would it be useful to also use recency as a way to detect/narrow down entities? for example, if I'm currently
    interacting with a customer, a new tick should assume the same customer to accelerate recognition, rather than
    starting from scratch.

3. This stage does source-specific parsing: ids, timestamps, headers, participants, thread ids, diffs. It is
   deterministic. It produces the `Stimulus` and the skeleton of the `Percept`.

    what happens when multiple stimuli point to the same percept? e.g. I see a mouth moving, I hear the sound of a
    voice, I know it's bob because both vision + voice match.

4. Blocks form a hierarchy keyed by time grain and place, and each grain is compacted as it ages:

    How does it work for landmark dates. For example, memories that were significant 20 years ago on Dec 2nd (e.g.
    friend got married).

5. type AssertionKind = 'instruction' | 'observation' | 'report' | 'inference' | 'regularity'

    Seems to be reductive. How many possible assertion kind are we missing?

6. **People models** (Chapter 6) are entities of kind person with a few reserved attributes: proximity, response time,
   what they know, and how they like to be addressed.

    Attributes, similar to kind should not be preset. They should be dynamically computed.

7. Perception creates candidate entities, and sleep promotes or drops them. A candidate that has been seen twice, or
   that was involved in an attended episode, gets promoted. The rest are gone in thirty days.

    The time decay should also be dynamically computed.

## Resolved

8. Knowledge Graph

    deep knowledge in a field should not empede on other kbowledge's retrieval. For example Nia, should be able to read
    a lot of marketing materials, form a lot of knowledge and episodes there, but those should cluster around each other
    and be seldom retrieved when Nia is working on a math problem for instance.

    **Answer:** `abe_design.md` 4.5 (activation and relevance as two numbers, fan-quietened cues, admission by
    relevance), 4.6 (budgeted spreading, scoped text pass, neighbourhoods, `broaden`), 11.1 (the interference test),
    11.16 (the decisions).
