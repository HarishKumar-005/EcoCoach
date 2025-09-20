import type { Timestamp } from 'firebase/firestore';

export type EcoUser = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt: Timestamp;
  totalCO2e: number;
  points: number;
  badges: string[];
};

export type EcoAction = {
  id: string;
  userId: string;
  category: 'diet' | 'travel' | 'energy';
  description: string;
  co2e: number;
  timestamp: Timestamp;
};

// This type is for the details object passed to logEcoAction
export type ActionDetails =
  | { mealType: string; servings: number }
  | { mode: string; distance: number }
  | { action: string };
