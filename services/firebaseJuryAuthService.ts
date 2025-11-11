import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import bcrypt from 'bcryptjs';
import type { Judge } from '../types';

const JUDGES_COLLECTION = 'judges';

/**
 * Initialize default jury members (MANU SIR and CHETAN SIR)
 * Call this once to set up the judges
 */
export const initializeDefaultJudges = async (): Promise<void> => {
  try {
    const defaultJudges = [
      {
        id: 'J001',
        juryId: 'J001',
        name: 'MANU SIR',
        email: 'manu@hackathon.com',
        designation: 'Senior Jury Member',
        organization: 'Hackathon Fusion',
        expertise: ['AI/ML', 'Web Development', 'System Design'],
        assignedRounds: ['Round 1', 'Round 2', 'Final'] as const,
        password: 'Jury@123', // Will be hashed
      },
      {
        id: 'J002',
        juryId: 'J002',
        name: 'CHETAN SIR',
        email: 'chetan@hackathon.com',
        designation: 'Senior Jury Member',
        organization: 'Hackathon Fusion',
        expertise: ['Mobile Development', 'Cloud Computing', 'Security'],
        assignedRounds: ['Round 1', 'Round 2', 'Final'] as const,
        password: 'Jury@123', // Will be hashed
      },
    ];

    for (const judge of defaultJudges) {
      // Check if judge already exists
      const docRef = doc(db, JUDGES_COLLECTION, judge.id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // Hash the password
        const hashedPassword = await bcrypt.hash(judge.password, 10);

        await setDoc(docRef, {
          ...judge,
          password: hashedPassword,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        console.log(`✅ Created judge: ${judge.name} (${judge.juryId})`);
      } else {
        console.log(`ℹ️ Judge already exists: ${judge.name}`);
      }
    }
  } catch (error) {
    console.error('Error initializing judges:', error);
    throw new Error('Failed to initialize judges');
  }
};

/**
 * Create a new jury member (max 4 total)
 */
export const createJudge = async (
  judgeData: Omit<Judge, 'id' | 'password'>,
  password: string
): Promise<string> => {
  try {
    // Check if max 4 judges exist
    const allJudges = await getAllJudges();
    if (allJudges.length >= 4) {
      throw new Error('Maximum 4 jury members allowed');
    }

    // Check if juryId already exists
    const existingJudge = await getJudgeByJuryId(judgeData.juryId);
    if (existingJudge) {
      throw new Error(`Jury ID ${judgeData.juryId} already exists`);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const judgeWithPassword = {
      ...judgeData,
      id: judgeData.juryId, // Use juryId as document ID
      password: hashedPassword,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, JUDGES_COLLECTION, judgeData.juryId), judgeWithPassword);
    return judgeData.juryId;
  } catch (error) {
    console.error('Error creating judge:', error);
    throw error;
  }
};

/**
 * Authenticate a jury member with juryId and password
 */
export const authenticateJudge = async (
  juryId: string,
  password: string
): Promise<Judge | null> => {
  try {
    const judge = await getJudgeByJuryId(juryId);

    if (!judge || !judge.password) {
      return null;
    }

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, judge.password);

    if (!isPasswordValid) {
      return null;
    }

    // Return judge without password field
    const { password: _, ...judgeWithoutPassword } = judge;
    return judgeWithoutPassword as Judge;
  } catch (error) {
    console.error('Error authenticating judge:', error);
    return null;
  }
};

/**
 * Get judge by juryId
 */
export const getJudgeByJuryId = async (juryId: string): Promise<Judge | null> => {
  try {
    const docRef = doc(db, JUDGES_COLLECTION, juryId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
      } as Judge;
    }
    return null;
  } catch (error) {
    console.error('Error getting judge:', error);
    return null;
  }
};

/**
 * Get all judges (without passwords)
 */
export const getAllJudges = async (): Promise<Omit<Judge, 'password'>[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, JUDGES_COLLECTION));

    return querySnapshot.docs.map((doc) => {
      const { password, ...judgeData } = doc.data();
      return {
        id: doc.id,
        ...judgeData,
      } as Omit<Judge, 'password'>;
    });
  } catch (error) {
    console.error('Error getting judges:', error);
    throw new Error('Failed to get judges');
  }
};

/**
 * Check if a judge has already evaluated a team in a specific round
 */
export const hasJudgeEvaluatedTeam = async (
  juryId: string,
  teamId: string,
  round: string
): Promise<boolean> => {
  try {
    const q = query(
      collection(db, 'evaluations'),
      where('judgeId', '==', juryId),
      where('teamId', '==', teamId),
      where('round', '==', round)
    );

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking evaluation:', error);
    return false;
  }
};

/**
 * Verify if judge can edit an evaluation
 * (Only the judge who created it can edit)
 */
export const canJudgeEditEvaluation = (
  evaluationJudgeId: string,
  currentJudgeId: string
): boolean => {
  return evaluationJudgeId === currentJudgeId;
};
