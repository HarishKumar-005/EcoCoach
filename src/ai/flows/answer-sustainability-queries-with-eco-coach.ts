'use server';

/**
 * @fileOverview This file defines a Genkit flow that answers user queries about sustainability using an AI-powered Eco-Coach.
 *
 * - answerSustainabilityQuery - A function that takes a user query as input and returns an AI-generated response.
 * - AnswerSustainabilityQueryInput - The input type for the answerSustainabilityQuery function.
 * - AnswerSustainabilityQueryOutput - The return type for the answerSustainabilityQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerSustainabilityQueryInputSchema = z.object({
  query: z.string().describe('The user query about sustainability.'),
});
export type AnswerSustainabilityQueryInput = z.infer<
  typeof AnswerSustainabilityQueryInputSchema
>;

const AnswerSustainabilityQueryOutputSchema = z.object({
  response: z
    .string()
    .describe('The AI-generated response to the user query.'),
});
export type AnswerSustainabilityQueryOutput = z.infer<
  typeof AnswerSustainabilityQueryOutputSchema
>;

export async function answerSustainabilityQuery(
  input: AnswerSustainabilityQueryInput
): Promise<AnswerSustainabilityQueryOutput> {
  return answerSustainabilityQueryFlow(input);
}

const answerSustainabilityQueryPrompt = ai.definePrompt({
  name: 'answerSustainabilityQueryPrompt',
  input: {schema: AnswerSustainabilityQueryInputSchema},
  output: {schema: AnswerSustainabilityQueryOutputSchema},
  prompt: `You are a friendly and encouraging Eco-Coach, providing helpful information and guidance on sustainability.

  User Query: {{{query}}}`,
});

const answerSustainabilityQueryFlow = ai.defineFlow(
  {
    name: 'answerSustainabilityQueryFlow',
    inputSchema: AnswerSustainabilityQueryInputSchema,
    outputSchema: AnswerSustainabilityQueryOutputSchema,
  },
  async input => {
    const {output} = await answerSustainabilityQueryPrompt(input);
    return output!;
  }
);
