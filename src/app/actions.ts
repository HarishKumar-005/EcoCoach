'use server';

import { revalidatePath } from 'next/cache';
import {
  answerSustainabilityQuery
} from '@/ai/flows/answer-sustainability-queries-with-eco-coach';
import { calculateCO2e } from '@/ai/flows/calculate-co2e-for-logged-actions';
import {
  receivePersonalizedRecommendations
} from '@/ai/flows/receive-personalized-recommendations';
import { addAction, getUser, updateUser } from '@/lib/firebase/firestore';
import type { ActionDetails, EcoAction, EcoUser } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';

export async function getCoachResponse(
  query: string
): Promise<{ response: string } | { error: string }> {
  if (!query) {
    return { error: 'Query cannot be empty.' };
  }
  try {
    const result = await answerSustainabilityQuery({ query });
    return { response: result.response };
  } catch (error) {
    console.error('Error getting coach response:', error);
    return { error: 'Failed to get a response from the Eco-Coach. Please try again.' };
  }
}

export async function getPersonalizedRecommendations(
  userId: string
): Promise<{ recommendations: string[] } | { error: string }> {
  try {
    const user = await getUser(userId);
    if (!user) {
      return { error: 'User not found.' };
    }

    // This is a simplified version of what might be passed.
    // In a real app, you might fetch recent actions as well.
    const input = {
      userId: user.uid,
      totalCO2e: user.totalCO2e,
      points: user.points,
      badges: user.badges,
      actions: [],
    };

    const result = await receivePersonalizedRecommendations(input);
    return { recommendations: result.recommendations };
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return { error: 'Failed to get personalized recommendations.' };
  }
}

export async function logEcoAction(
  userId: string,
  category: 'diet' | 'travel' | 'energy',
  details: ActionDetails
): Promise<{ success: boolean; error?: string }> {
  if (!userId) {
    return { success: false, error: 'User not authenticated.' };
  }

  try {
    const co2eResult = await calculateCO2e({
      category,
      details,
    });

    const co2e = co2eResult.co2e;
    const pointsGained = Math.round(co2e * 5 + 10); // Example point calculation

    let description = '';
    switch (category) {
        case 'diet':
            description = `${details.servings} serving(s) of ${details.mealType}`;
            break;
        case 'travel':
            description = `${details.distance} km by ${details.mode}`;
            break;
        case 'energy':
            description = `${details.action}`;
            break;
    }

    const newAction: Omit<EcoAction, 'id'> = {
      userId,
      category,
      description,
      co2e,
      timestamp: Timestamp.now(),
    };

    await addAction(newAction);

    const user = await getUser(userId);
    if (!user) {
      return { success: false, error: 'User not found.' };
    }
    
    const updatedTotalCO2e = (user.totalCO2e || 0) + co2e;
    const updatedPoints = (user.points || 0) + pointsGained;

    // Simple badge logic
    const updatedBadges = [...user.badges];
    if(updatedPoints > 1000 && !updatedBadges.includes('Eco-Hero')) updatedBadges.push('Eco-Hero');
    if(updatedPoints > 500 && !updatedBadges.includes('Green Giant')) updatedBadges.push('Green Giant');
    if(updatedPoints > 100 && !updatedBadges.includes('Seedling Starter')) updatedBadges.push('Seedling Starter');


    await updateUser(userId, {
      totalCO2e: updatedTotalCO2e,
      points: updatedPoints,
      badges: updatedBadges,
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error logging action:', error);
    return { success: false, error: 'Failed to log action. Please try again.' };
  }
}
