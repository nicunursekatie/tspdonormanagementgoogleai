// Impact calculation: $1000 = 760 sandwiches
export const SANDWICHES_PER_THOUSAND = 760;
export const DOLLARS_PER_SANDWICH = 1000 / SANDWICHES_PER_THOUSAND; // Approx $1.31 per sandwich

export const MOCK_DONORS_COUNT = 145; // Based on prompt context

export const INITIAL_SYSTEM_INSTRUCTION = `
You are an intelligent assistant for "The Sandwich Project" (TSP), a non-profit organization helping feed the community. 
TSP's impact metric is: $1,000 provides 760 sandwiches.
Your role is to help staff manage donor relationships, draft communications (thank you notes, appeals), and provide fundraising insights.
Tone: Grateful, professional, community-focused, and warm.
`;