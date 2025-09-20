import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  Timestamp,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db } from './config';
import type { EcoUser, EcoAction } from '../types';

const usersCollection = collection(db, 'users');
const actionsCollection = collection(db, 'actions');

// User Management
export async function createUser(user: User): Promise<void> {
  const userRef = doc(usersCollection, user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    const newUser: Omit<EcoUser, 'uid' | 'createdAt'> & { createdAt: Timestamp } = {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: Timestamp.now(),
      totalCO2e: 0,
      points: 0,
      badges: [],
    };
    await setDoc(userRef, newUser);
  }
}

export async function getUser(uid: string): Promise<EcoUser | null> {
  const userRef = doc(usersCollection, uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return { uid, ...userDoc.data() } as EcoUser;
  }
  return null;
}

export async function updateUser(uid: string, data: Partial<Omit<EcoUser, 'uid'>>): Promise<void> {
    const userRef = doc(usersCollection, uid);
    await updateDoc(userRef, data);
}

// Action Management
export async function addAction(action: Omit<EcoAction, 'id'>): Promise<void> {
    await addDoc(actionsCollection, action);
}

export async function getRecentActions(userId: string, count: number): Promise<EcoAction[]> {
    const q = query(actionsCollection, where("userId", "==", userId), orderBy("timestamp", "desc"), limit(count));
    const querySnapshot = await getDocs(q);
    const actions: EcoAction[] = [];
    querySnapshot.forEach((doc) => {
        actions.push({ id: doc.id, ...doc.data() } as EcoAction);
    });
    return actions;
}
