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
export const createTeam = async (teamData: Team): Promise<string> => {
  try {
    console.log("🔧 createTeam: Starting...");
    console.log("📦 createTeam: Received teamData:", teamData);
    
    // Clean the team data to remove any non-serializable objects and undefined values
    const cleanTeamData: any = {
      id: teamData.id,
      name: teamData.name,
      track: teamData.track,
      collegeName: teamData.collegeName,
      city: teamData.city,
      projectSynopsis: teamData.projectSynopsis,
      githubRepo: teamData.githubRepo,
      qrCodeUrl: teamData.qrCodeUrl,
      accommodation: teamData.accommodation,
      status: teamData.status,
      isVerified: teamData.isVerified,
      paymentStatus: teamData.paymentStatus || 'Pending',
      registeredAt: teamData.registeredAt || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Ensure leader and members are clean objects without File references
      leader: {
        name: teamData.leader.name,
        email: teamData.leader.email,
        contactNumber: teamData.leader.contactNumber,
        tshirtSize: teamData.leader.tshirtSize,
        githubUrl: teamData.leader.githubUrl || '',
        profilePictureUrl: teamData.leader.profilePictureUrl || '',
        skills: teamData.leader.skills || [],
      },
      members: teamData.members.map(member => ({
        name: member.name,
        email: member.email,
        contactNumber: member.contactNumber,
        tshirtSize: member.tshirtSize,
        githubUrl: member.githubUrl || '',
        profilePictureUrl: member.profilePictureUrl || '',
        skills: member.skills || [],
      })),
    };

    console.log("🔍 createTeam: Checking optional fields...");
    // Add optional fields only if they exist (not undefined)
    if (teamData.password) {
      cleanTeamData.password = teamData.password;
      console.log("  ✅ Password added");
    }
    if (teamData.address && teamData.address.trim()) {
      cleanTeamData.address = teamData.address;
      console.log("  ✅ Address added");
    }
    if (teamData.institutionIdUrl) {
      cleanTeamData.institutionIdUrl = teamData.institutionIdUrl;
      console.log("  ✅ Institution ID URL added:", teamData.institutionIdUrl.substring(0, 50) + "...");
    } else {
      console.log("  ⚠️ Institution ID URL is missing!");
    }
    if (teamData.teamLogoUrl) {
      cleanTeamData.teamLogoUrl = teamData.teamLogoUrl;
      console.log("  ✅ Team Logo URL added:", teamData.teamLogoUrl.substring(0, 50) + "...");
    }
    if (teamData.submissionTicket) {
      cleanTeamData.submissionTicket = teamData.submissionTicket;
      console.log("  ✅ Submission Ticket added");
    }
    if (teamData.submission) {
      cleanTeamData.submission = teamData.submission;
      console.log("  ✅ Submission added");
    }
    
    // Remove empty strings from leader
    if (!cleanTeamData.leader.githubUrl) delete cleanTeamData.leader.githubUrl;
    if (!cleanTeamData.leader.profilePictureUrl) delete cleanTeamData.leader.profilePictureUrl;
    
    // Remove empty strings from members
    cleanTeamData.members = cleanTeamData.members.map((member: any) => {
      const cleanMember: any = { ...member };
      if (!cleanMember.githubUrl) delete cleanMember.githubUrl;
      if (!cleanMember.profilePictureUrl) delete cleanMember.profilePictureUrl;
      if (!cleanMember.skills || cleanMember.skills.length === 0) delete cleanMember.skills;
      return cleanMember;
    });
    
    // Remove empty skills array from leader if empty
    if (!cleanTeamData.leader.skills || cleanTeamData.leader.skills.length === 0) {
      delete cleanTeamData.leader.skills;
    }

    console.log("📊 createTeam: Clean team data:", cleanTeamData);
    console.log("🔢 createTeam: Leader profilePictureUrl length:", cleanTeamData.leader.profilePictureUrl?.length || 0);
    console.log("🔢 createTeam: Members with photos:", cleanTeamData.members.filter((m: any) => m.profilePictureUrl).length);
    console.log("🔢 createTeam: Institution ID URL length:", cleanTeamData.institutionIdUrl?.length || 0);
    console.log("🔢 createTeam: Team Logo URL length:", cleanTeamData.teamLogoUrl?.length || 0);

    // Use setDoc with the team's ID instead of addDoc
    console.log("💾 createTeam: Saving to Firestore with ID:", teamData.id);
    const docRef = doc(db, TEAMS_COLLECTION, teamData.id);
    
    try {
      console.log("⏳ createTeam: Starting setDoc operation...");
      await setDoc(docRef, cleanTeamData);
      console.log("✅ createTeam: setDoc completed successfully!");
    } catch (setDocError: any) {
      console.error("❌ createTeam: setDoc failed:", setDocError);
      console.error("❌ createTeam: setDoc error code:", setDocError?.code);
      console.error("❌ createTeam: setDoc error message:", setDocError?.message);
      throw setDocError;
    }
    
    console.log("✅ createTeam: Team created successfully in Firestore!");
    return teamData.id;
  } catch (error: any) {
    console.error("❌ createTeam: Error creating team:", error);
    console.error("❌ createTeam: Error code:", error?.code);
    console.error("❌ createTeam: Error message:", error?.message);
    console.error("❌ createTeam: Error details:", JSON.stringify(error, null, 2));
    throw new Error(`Failed to create team: ${error?.message || 'Unknown error'}`);
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
