'use server';

import { revalidatePath } from 'next/cache';
import {
  answerSustainabilityQuery
} from '@/ai/flows/answer-sustainability-queries-with-eco-coach';
import { calculateCO2e } from '@/ai/flows/calculate-co2e-for-logged-actions';
import {
  receivePersonalizedRecommendations
} from '@/ai/flows/receive-personalized-recommendations';
import { addAction, getRecentActions, getUser, updateUser } from '@/lib/firebase/firestore';
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

    const recentActions = await getRecentActions(userId, 10);
    const mappedActions = recentActions.map(action => ({
      category: action.category,
      description: action.description,
      co2e: action.co2e,
      timestamp: action.timestamp.toDate().toISOString(),
    }));

    const input = {
      userId: user.uid,
      totalCO2e: user.totalCO2e,
      points: user.points,
      badges: user.badges,
      actions: mappedActions,
    };

    const result = await receivePersonalizedRecommendations(input);
    return { recommendations: result.recommendations };
  } catch (error: any) {
    console.error('Error getting recommendations:', error);
    return { error: `Failed to get personalized recommendations: ${error.message}` };
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
    const co2e = 1.5;
    
    let description = '';
    switch (category) {
        case 'diet':
            description = `${(details as { servings: number }).servings} serving(s) of ${(details as { mealType: string }).mealType}`;
            break;
        case 'travel':
            description = `${(details as { distance: number }).distance} km by ${(details as { mode: string }).mode}`;
            break;
        case 'energy':
            description = `${(details as { action: string }).action}`;
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
      console.error('User not found after adding action.');
      return { success: false, error: 'User not found.' };
    }
    
    const updatedTotalCO2e = (user.totalCO2e || 0) + co2e;
    const pointsGained = Math.round(co2e * 5 + 10);
    const updatedPoints = (user.points || 0) + pointsGained;

    // Simple badge logic
    const updatedBadges = [...user.badges];
    if(updatedPoints > 1000 && !updatedBadges.includes('Eco-Hero')) updatedBadges.push('Eco-Hero');
    if(updatedPoints > 500 && !updatedBadges.includes('Green Giant')) updatedBadges.push('Green Giant');
    if(updatedPoints > 100 && !updatedBadges.includes('Seedling Starter')) updatedBadges.push('Seedling Starter');

    const userUpdateData = {
      totalCO2e: updatedTotalCO2e,
      points: updatedPoints,
      badges: updatedBadges,
    };

    await updateUser(userId, userUpdateData);
    

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Error in logEcoAction:', error);
    return { success: false, error: `Failed to log action: ${error.message}` };
  }
}
