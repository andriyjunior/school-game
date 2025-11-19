import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './config';
import type { CustomTest, TestAttempt, PlayerClass } from '../types';

/**
 * Create a new custom test
 */
export const createTest = async (
  test: Omit<CustomTest, 'id' | 'createdAt'>
): Promise<string> => {
  try {
    const testRef = await addDoc(collection(db, 'customTests'), {
      ...test,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return testRef.id;
  } catch (error) {
    console.error('Error creating test:', error);
    throw error;
  }
};

/**
 * Get all custom tests, optionally filtered by player class
 */
export const getAllTests = async (
  playerClass?: PlayerClass
): Promise<CustomTest[]> => {
  try {
    const testsCollection = collection(db, 'customTests');

    // Fetch all tests without ordering (no index required)
    const querySnapshot = await getDocs(testsCollection);

    let tests = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CustomTest[];

    // Filter by playerClass in JavaScript if specified
    if (playerClass) {
      tests = tests.filter(test => test.playerClass === playerClass);
    }

    // Sort by createdAt in JavaScript (newest first)
    tests.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return bTime - aTime;
    });

    return tests;
  } catch (error) {
    console.error('Error getting tests:', error);
    throw error;
  }
};

/**
 * Get a specific test by ID
 */
export const getTestById = async (testId: string): Promise<CustomTest | null> => {
  try {
    const testRef = doc(db, 'customTests', testId);
    const testSnap = await getDoc(testRef);

    if (testSnap.exists()) {
      return {
        id: testSnap.id,
        ...testSnap.data(),
      } as CustomTest;
    }

    return null;
  } catch (error) {
    console.error('Error getting test:', error);
    throw error;
  }
};

/**
 * Update an existing test
 */
export const updateTest = async (
  testId: string,
  updates: Partial<CustomTest>
): Promise<void> => {
  try {
    const testRef = doc(db, 'customTests', testId);
    await updateDoc(testRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating test:', error);
    throw error;
  }
};

/**
 * Delete a test
 */
export const deleteTest = async (testId: string): Promise<void> => {
  try {
    const testRef = doc(db, 'customTests', testId);
    await deleteDoc(testRef);
  } catch (error) {
    console.error('Error deleting test:', error);
    throw error;
  }
};

/**
 * Save a test attempt
 */
export const saveTestAttempt = async (
  attempt: Omit<TestAttempt, 'id'>
): Promise<string> => {
  try {
    const attemptRef = await addDoc(collection(db, 'testAttempts'), {
      ...attempt,
      startedAt: attempt.startedAt || serverTimestamp(),
      completedAt: attempt.completedAt || serverTimestamp(),
    });
    return attemptRef.id;
  } catch (error) {
    console.error('Error saving test attempt:', error);
    throw error;
  }
};

/**
 * Get all test attempts for a specific player
 */
export const getPlayerTestAttempts = async (
  playerName: string
): Promise<TestAttempt[]> => {
  try {
    const attemptsCollection = collection(db, 'testAttempts');
    const q = query(
      attemptsCollection,
      where('playerName', '==', playerName),
      orderBy('completedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as TestAttempt[];
  } catch (error) {
    console.error('Error getting player test attempts:', error);
    throw error;
  }
};

/**
 * Get all attempts for a specific test
 */
export const getTestAttempts = async (testId: string): Promise<TestAttempt[]> => {
  try {
    const attemptsCollection = collection(db, 'testAttempts');
    const q = query(
      attemptsCollection,
      where('testId', '==', testId),
      orderBy('completedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as TestAttempt[];
  } catch (error) {
    console.error('Error getting test attempts:', error);
    throw error;
  }
};
