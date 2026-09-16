export const contexts = [
    {
        id: '123',
        // contains all turns ids (AiSingleTurnRequest). verbatim.
        history: [],
        // filled with:
        // 1. immediate previous context
        // 2. similar contexts (based on modality, time of the day, year, device used, ...)
        previously: {},
        turns: [
            {
                turn: {
                    question: 'how tall is barack obama?',
                    answer: "6'1"
                },

                // empty. initial turn.
                summary: ''
            },
            {
                turn: {
                    question: 'how tall is michelle obama?',
                    answer: "5'11"
                },
                summary: 'we are talking about the Obamas. User wants to know their heights'
            },
            {
                turn: {
                    question: 'how tall is emmanuel macron?',
                    answer: "5'9"
                },
                summary: 'we are talking about political personalities. User asked the heights of the obamas and macron'
            }
        ]
    },
    {
        // contains all turns. verbatim.
        history: [],
        // filled with:
        // 1. immediate previous context
        // 2. similar contexts (based on modality, time of the day, year, device used, ...)
        previously: [
            {
                id: '123',
                summary: 'talk about heights of the obamas - n min ago'
            }
        ],
        turns: [
            {
                turn: {
                    question: 'Why is the sky blue',
                    answer: 'Because ...'
                },
                context: {
                    summary: 'User '
                }
            }
        ]
    }
]
