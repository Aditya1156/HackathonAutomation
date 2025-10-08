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