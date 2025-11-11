import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Judge, JudgeEvaluation, JudgingRound, TeamScores } from '../types';

const JUDGES_COLLECTION = 'judges';
const EVALUATIONS_COLLECTION = 'evaluations';

// ==================== JUDGES ====================

/**
 * Create a new judge
 */
export const createJudge = async (judgeData: Omit<Judge, 'id'>): Promise<string> => {
  try {
    const judgeWithTimestamp = {
      ...judgeData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, JUDGES_COLLECTION), judgeWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error('Error creating judge:', error);
    throw new Error('Failed to create judge');
  }
};

/**
 * Get judge by ID
 */
export const getJudgeById = async (judgeId: string): Promise<Judge | null> => {
  try {
    const docRef = doc(db, JUDGES_COLLECTION, judgeId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Judge;
    }
    return null;
  } catch (error) {
    console.error('Error getting judge:', error);
    throw new Error('Failed to get judge');
  }
};

/**
 * Get all judges
 */
export const getAllJudges = async (): Promise<Judge[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, JUDGES_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Judge));
  } catch (error) {
    console.error('Error getting judges:', error);
    throw new Error('Failed to get judges');
  }
};

/**
 * Get judges by round
 */
export const getJudgesByRound = async (round: JudgingRound): Promise<Judge[]> => {
  try {
    const q = query(
      collection(db, JUDGES_COLLECTION),
      where('assignedRounds', 'array-contains', round)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Judge));
  } catch (error) {
    console.error('Error getting judges by round:', error);
    throw new Error('Failed to get judges by round');
  }
};

/**
 * Update judge information
 */
export const updateJudge = async (judgeId: string, updates: Partial<Judge>): Promise<void> => {
  try {
    const docRef = doc(db, JUDGES_COLLECTION, judgeId);
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };
    delete updateData.id;
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating judge:', error);
    throw new Error('Failed to update judge');
  }
};

/**
 * Delete a judge
 */
export const deleteJudge = async (judgeId: string): Promise<void> => {
  try {
    const docRef = doc(db, JUDGES_COLLECTION, judgeId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting judge:', error);
    throw new Error('Failed to delete judge');
  }
};

// ==================== EVALUATIONS ====================

/**
 * Submit an evaluation
 */
export const submitEvaluation = async (
  evaluation: Omit<JudgeEvaluation, 'evaluatedAt'>
): Promise<string> => {
  try {
    const evaluationWithTimestamp = {
      ...evaluation,
      evaluatedAt: new Date().toISOString(),
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, EVALUATIONS_COLLECTION), evaluationWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error('Error submitting evaluation:', error);
    throw new Error('Failed to submit evaluation');
  }
};

/**
 * Get all evaluations for a team
 */
export const getTeamEvaluations = async (teamId: string): Promise<JudgeEvaluation[]> => {
  try {
    const q = query(
      collection(db, EVALUATIONS_COLLECTION),
      where('teamId', '==', teamId),
      orderBy('evaluatedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => doc.data() as JudgeEvaluation);
  } catch (error) {
    console.error('Error getting team evaluations:', error);
    throw new Error('Failed to get team evaluations');
  }
};

/**
 * Get evaluations by round
 */
export const getEvaluationsByRound = async (round: JudgingRound): Promise<JudgeEvaluation[]> => {
  try {
    const q = query(
      collection(db, EVALUATIONS_COLLECTION),
      where('round', '==', round),
      orderBy('evaluatedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => doc.data() as JudgeEvaluation);
  } catch (error) {
    console.error('Error getting evaluations by round:', error);
    throw new Error('Failed to get evaluations by round');
  }
};

/**
 * Get evaluations for a specific team in a specific round
 */
export const getTeamRoundEvaluations = async (
  teamId: string,
  round: JudgingRound
): Promise<JudgeEvaluation[]> => {
  try {
    const q = query(
      collection(db, EVALUATIONS_COLLECTION),
      where('teamId', '==', teamId),
      where('round', '==', round)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => doc.data() as JudgeEvaluation);
  } catch (error) {
    console.error('Error getting team round evaluations:', error);
    throw new Error('Failed to get team round evaluations');
  }
};

/**
 * Get all evaluations by a specific judge
 */
export const getJudgeEvaluations = async (judgeId: string): Promise<JudgeEvaluation[]> => {
  try {
    const q = query(
      collection(db, EVALUATIONS_COLLECTION),
      where('judgeId', '==', judgeId),
      orderBy('evaluatedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => doc.data() as JudgeEvaluation);
  } catch (error) {
    console.error('Error getting judge evaluations:', error);
    throw new Error('Failed to get judge evaluations');
  }
};

/**
 * Check if a judge has already evaluated a team in a round
 */
export const hasJudgeEvaluated = async (
  judgeId: string,
  teamId: string,
  round: JudgingRound
): Promise<boolean> => {
  try {
    const q = query(
      collection(db, EVALUATIONS_COLLECTION),
      where('judgeId', '==', judgeId),
      where('teamId', '==', teamId),
      where('round', '==', round)
    );
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking if judge evaluated:', error);
    return false;
  }
};

/**
 * Get all evaluations
 */
export const getAllEvaluations = async (): Promise<JudgeEvaluation[]> => {
  try {
    const q = query(collection(db, EVALUATIONS_COLLECTION), orderBy('evaluatedAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => doc.data() as JudgeEvaluation);
  } catch (error) {
    console.error('Error getting all evaluations:', error);
    throw new Error('Failed to get all evaluations');
  }
};

/**
 * Calculate team scores with averages
 */
export const calculateTeamScores = async (
  teamId: string,
  teamName: string
): Promise<TeamScores> => {
  try {
    const evaluations = await getTeamEvaluations(teamId);

    const averageScoreByRound: { [key in JudgingRound]?: number } = {};
    const rounds: JudgingRound[] = ['Round 1', 'Round 2', 'Final'];

    rounds.forEach(round => {
      const roundEvals = evaluations.filter(e => e.round === round);
      if (roundEvals.length > 0) {
        const sum = roundEvals.reduce((acc, e) => acc + e.totalScore, 0);
        averageScoreByRound[round] = sum / roundEvals.length;
      }
    });

    const totalAverageScore =
      evaluations.length > 0
        ? evaluations.reduce((acc, e) => acc + e.totalScore, 0) / evaluations.length
        : 0;

    return {
      teamId,
      teamName,
      evaluations,
      averageScoreByRound,
      totalAverageScore,
    };
  } catch (error) {
    console.error('Error calculating team scores:', error);
    throw new Error('Failed to calculate team scores');
  }
};

/**
 * Get leaderboard for a specific round
 */
export const getLeaderboard = async (round: JudgingRound): Promise<TeamScores[]> => {
  try {
    const evaluations = await getEvaluationsByRound(round);

    // Group by team
    const teamMap = new Map<string, JudgeEvaluation[]>();
    evaluations.forEach(evaluation => {
      if (!teamMap.has(evaluation.teamId)) {
        teamMap.set(evaluation.teamId, []);
      }
      teamMap.get(evaluation.teamId)!.push(evaluation);
    });

    // Calculate scores for each team
    const teamScores: TeamScores[] = [];
    for (const [teamId, teamEvals] of teamMap.entries()) {
      if (teamEvals.length > 0) {
        const avgScore = teamEvals.reduce((acc, e) => acc + e.totalScore, 0) / teamEvals.length;
        teamScores.push({
          teamId,
          teamName: teamEvals[0].teamId, // In real app, fetch from teams collection
          evaluations: teamEvals,
          averageScoreByRound: { [round]: avgScore },
          totalAverageScore: avgScore,
        });
      }
    }

    // Sort by average score descending
    teamScores.sort((a, b) => b.totalAverageScore - a.totalAverageScore);

    // Assign ranks
    teamScores.forEach((score, index) => {
      score.rank = index + 1;
    });

    return teamScores;
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    throw new Error('Failed to get leaderboard');
  }
};

/**
 * Delete an evaluation
 */
export const deleteEvaluation = async (evaluationId: string): Promise<void> => {
  try {
    const docRef = doc(db, EVALUATIONS_COLLECTION, evaluationId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting evaluation:', error);
    throw new Error('Failed to delete evaluation');
  }
};
