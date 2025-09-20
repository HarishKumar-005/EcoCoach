'use server';

/**
 * @fileOverview A personalized recommendation AI agent.
 *
 * - receivePersonalizedRecommendations - A function that generates personalized recommendations based on user data.
 * - ReceivePersonalizedRecommendationsInput - The input type for the receivePersonalizedRecommendations function.
 * - ReceivePersonalizedRecommendationsOutput - The return type for the receivePersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReceivePersonalizedRecommendationsInputSchema = z.object({
  userId: z.string().describe('The ID of the user to generate recommendations for.'),
  totalCO2e: z.number().describe('The user\'s total carbon footprint.'),
  points: z.number().describe('The user\'s current points.'),
  badges: z.array(z.string()).describe('The user\'s earned badges.'),
  actions: z.array(
    z.object({
      category: z.string(),
      description: z.string(),
      co2e: z.number(),
      timestamp: z.string(),
    })
  ).describe('The user\'s logged actions.'),
});

export type ReceivePersonalizedRecommendationsInput = z.infer<
  typeof ReceivePersonalizedRecommendationsInputSchema
>;

const ReceivePersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('A list of personalized recommendations for the user.'),
});

export type ReceivePersonalizedRecommendationsOutput = z.infer<
  typeof ReceivePersonalizedRecommendationsOutputSchema
>;

export async function receivePersonalizedRecommendations(
  input: ReceivePersonalizedRecommendationsInput
): Promise<ReceivePersonalizedRecommendationsOutput> {
  return receivePersonalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'receivePersonalizedRecommendationsPrompt',
  input: {schema: ReceivePersonalizedRecommendationsInputSchema},
  output: {schema: ReceivePersonalizedRecommendationsOutputSchema},
  prompt: `You are an AI-powered Eco-Coach that provides personalized recommendations to users on how to reduce their carbon footprint.

  Based on the following information about the user, provide 3-5 actionable recommendations for reducing their environmental impact.

  User ID: {{{userId}}}
  Total CO2e: {{{totalCO2e}}} kg
  Points: {{{points}}}
  Badges: {{#if badges}}{{#each badges}} - {{{this}}}{{/each}}{{else}}None{{/if}}
  Logged Actions:
  {{#each actions}}
  - Category: {{{category}}}, Description: {{{description}}}, CO2e: {{{co2e}}}, Timestamp: {{{timestamp}}}
  {{/each}}
  
  Focus on providing specific and practical suggestions that the user can easily implement in their daily life. Be encouraging and positive in your tone.
  Make sure the recommendations are distinct from each other and address different aspects of their lifestyle like diet, travel and energy consumption.
`,
});

const receivePersonalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'receivePersonalizedRecommendationsFlow',
    inputSchema: ReceivePersonalizedRecommendationsInputSchema,
    outputSchema: ReceivePersonalizedRecommendationsOutputSchema,
    timeout: 25000,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
