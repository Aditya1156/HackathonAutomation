import React from 'react';

export interface TeamMember {
  name: string;
  email: string;
  contactNumber: string;
  tshirtSize: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  githubUrl?: string;
  profilePictureUrl?: string;
  skills?: string[];
}

export interface Submission {
  link: string;
  description: string;
  submittedAt: string;
}

export interface Team {
  id: string;
  name: string;
  leader: TeamMember;
  members: TeamMember[];
  track: string;
  collegeName: string;
  city: string;
  address?: string;
  projectSynopsis: string;
  githubRepo: string;
  qrCodeUrl: string;
  registeredAt: string;
  accommodation: boolean;
  password?: string;
  paymentStatus?: 'Paid' | 'Pending';
  submission?: Submission;
  institutionIdUrl?: string;
  teamLogoUrl?: string;
  status: 'Registered' | 'Checked-in' | 'Verified';
  isVerified: boolean;
  submissionTicket?: string;
}

export interface Prize {
  rank: string;
  reward: string;
  icon: React.ReactNode;
}

export interface ScheduleItem {
  time: string;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Sponsor {
  name: string;
  logoUrl: string;
  tier: 'Gold' | 'Silver' | 'Bronze';
}

// Fix: Added a new `ChatMessage` interface to provide a shared type definition for chat messages.
export interface ChatMessage {
  from: 'user' | 'mentor';
  text: string;
  time: string;
}

export interface Attraction {
  name: string;
  imageUrl: string;
  shortDescription: string;
  longDescription: string;
  activities: string[];
  gettingThere: string;
}

// Judging System Types
export type JudgingRound = 'Round 1' | 'Round 2' | 'Final';

export interface JudgingCriteria {
  progress: number;      // Out of 10
  ui: number;           // Out of 10
  presentation: number; // Out of 10
  idea: number;         // Out of 10
  implementation: number; // Out of 10
}

export interface JudgeEvaluation {
  judgeId: string;
  judgeName: string;
  round: JudgingRound;
  teamId: string;
  criteria: JudgingCriteria;
  comments?: string;
  totalScore: number;    // Sum of all criteria
  evaluatedAt: string;   // ISO date string
}

export interface Judge {
  id: string;
  name: string;
  email: string;
  designation: string;
  organization: string;
  expertise: string[];
  profilePictureUrl?: string;
  assignedRounds: JudgingRound[];
  assignedTeams?: string[]; // Team IDs
}

export interface TeamScores {
  teamId: string;
  teamName: string;
  evaluations: JudgeEvaluation[];
  averageScoreByRound: {
    [key in JudgingRound]?: number;
  };
  totalAverageScore: number;
  rank?: number;
}