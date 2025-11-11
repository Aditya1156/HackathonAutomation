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
  limit,
  Timestamp,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Team } from '../types';

const TEAMS_COLLECTION = 'teams';

/**
 * Create a new team in Firestore
 */
export const createTeam = async (teamData: Omit<Team, 'id' | 'registeredAt'>): Promise<string> => {
  try {
    const teamWithTimestamp = {
      ...teamData,
      registeredAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, TEAMS_COLLECTION), teamWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error('Error creating team:', error);
    throw new Error('Failed to create team');
  }
};

/**
 * Get a team by ID
 */
export const getTeamById = async (teamId: string): Promise<Team | null> => {
  try {
    const docRef = doc(db, TEAMS_COLLECTION, teamId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        registeredAt: data.registeredAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      } as Team;
    }
    return null;
  } catch (error) {
    console.error('Error getting team:', error);
    throw new Error('Failed to get team');
  }
};

/**
 * Get team by GitHub username (for login)
 */
export const getTeamByGithubUsername = async (githubUsername: string): Promise<Team | null> => {
  try {
    // Check if leader has this GitHub
    const leaderQuery = query(
      collection(db, TEAMS_COLLECTION),
      where('leader.githubUrl', '==', `https://github.com/${githubUsername}`)
    );
    const leaderSnapshot = await getDocs(leaderQuery);

    if (!leaderSnapshot.empty) {
      const docSnap = leaderSnapshot.docs[0];
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        registeredAt: data.registeredAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      } as Team;
    }

    // Check if any member has this GitHub
    const memberQuery = query(
      collection(db, TEAMS_COLLECTION),
      where('members', 'array-contains', { githubUrl: `https://github.com/${githubUsername}` })
    );
    const memberSnapshot = await getDocs(memberQuery);

    if (!memberSnapshot.empty) {
      const docSnap = memberSnapshot.docs[0];
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        registeredAt: data.registeredAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      } as Team;
    }

    return null;
  } catch (error) {
    console.error('Error finding team by GitHub:', error);
    throw new Error('Failed to find team');
  }
};

/**
 * Get all teams
 */
export const getAllTeams = async (): Promise<Team[]> => {
  try {
    const q = query(collection(db, TEAMS_COLLECTION), orderBy('registeredAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        registeredAt: data.registeredAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      } as Team;
    });
  } catch (error) {
    console.error('Error getting teams:', error);
    throw new Error('Failed to get teams');
  }
};

/**
 * Get teams by track/domain
 */
export const getTeamsByTrack = async (track: string): Promise<Team[]> => {
  try {
    const q = query(
      collection(db, TEAMS_COLLECTION),
      where('track', '==', track),
      orderBy('registeredAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        registeredAt: data.registeredAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      } as Team;
    });
  } catch (error) {
    console.error('Error getting teams by track:', error);
    throw new Error('Failed to get teams by track');
  }
};

/**
 * Update team information
 */
export const updateTeam = async (teamId: string, updates: Partial<Team>): Promise<void> => {
  try {
    const docRef = doc(db, TEAMS_COLLECTION, teamId);
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };
    delete updateData.id; // Remove id from updates
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating team:', error);
    throw new Error('Failed to update team');
  }
};

/**
 * Update team status (Registered, Checked-in, Verified)
 */
export const updateTeamStatus = async (
  teamId: string,
  status: Team['status']
): Promise<void> => {
  try {
    await updateTeam(teamId, { status });
  } catch (error) {
    console.error('Error updating team status:', error);
    throw new Error('Failed to update team status');
  }
};

/**
 * Submit project for a team
 */
export const submitProject = async (
  teamId: string,
  submission: { link: string; description: string }
): Promise<void> => {
  try {
    const docRef = doc(db, TEAMS_COLLECTION, teamId);
    await updateDoc(docRef, {
      submission: {
        ...submission,
        submittedAt: new Date().toISOString(),
      },
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error submitting project:', error);
    throw new Error('Failed to submit project');
  }
};

/**
 * Delete a team
 */
export const deleteTeam = async (teamId: string): Promise<void> => {
  try {
    const docRef = doc(db, TEAMS_COLLECTION, teamId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting team:', error);
    throw new Error('Failed to delete team');
  }
};

/**
 * Check if team name already exists
 */
export const isTeamNameTaken = async (teamName: string): Promise<boolean> => {
  try {
    const q = query(
      collection(db, TEAMS_COLLECTION),
      where('name', '==', teamName),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking team name:', error);
    return false;
  }
};

/**
 * Get teams with submissions
 */
export const getTeamsWithSubmissions = async (): Promise<Team[]> => {
  try {
    const q = query(
      collection(db, TEAMS_COLLECTION),
      where('submission', '!=', null)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        registeredAt: data.registeredAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      } as Team;
    });
  } catch (error) {
    console.error('Error getting teams with submissions:', error);
    throw new Error('Failed to get teams with submissions');
  }
};
