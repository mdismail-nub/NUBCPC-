export type NUBPCLevel = 'Newbie' | 'Pupil' | 'Specialist' | 'Expert' | 'Master' | 'Grandmaster';

export type VerificationStatus =
  | 'not_connected'
  | 'checking'
  | 'verified'
  | 'invalid'
  | 'temporarily_unavailable';

export interface RatingConfig {
  codeforcesWeight: number; // e.g. 0.35
  codechefWeight: number;    // e.g. 0.25
  atcoderWeight: number;     // e.g. 0.20
  leetcodeWeight: number;    // e.g. 0.20
  baselineRating: number;    // fallback base
}

export interface LevelThresholds {
  newbieMax: number;        // default 1199
  pupilMax: number;         // default 1399
  specialistMax: number;    // default 1599
  expertMax: number;        // default 1899
  masterMax: number;        // default 2199
  // 2200+ is Grandmaster
}

export interface PlatformAccount {
  handle: string;
  status?: VerificationStatus;
  verified: boolean;
  rating?: number;
  maxRating?: number;
  rank?: string;
  lastUpdated?: string;
  avatarUrl?: string;
  profileUrl?: string;
  oldRating?: number;
  errorMessage?: string;
}

export interface CodingProfiles {
  codeforces?: PlatformAccount;
  codechef?: PlatformAccount;
  leetcode?: PlatformAccount;
  atcoder?: PlatformAccount;
}

export interface RatingHistoryPoint {
  date: string;
  contestName: string;
  rating: number;
  change: number;
}

export interface ContestHistoryItem {
  id: string;
  contestId: string;
  contestName: string;
  date: string;
  rank: number;
  totalParticipants: number;
  solvedCount: number;
  totalProblems: number;
  ratingChange: number;
  performance: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'contest' | 'problem_solving' | 'milestone' | 'community';
  unlockedAt?: string;
}

export interface StudentProfile {
  id: string;
  username: string; // unique slug e.g. tanvir_ahmed
  fullName: string;
  email: string;
  studentId: string;
  department: string;
  batch: string;
  avatar: string;
  bio?: string;
  joinedDate: string;
  overallRating: number;
  ratingChange: number; // last change
  rank: number;
  level: NUBPCLevel;
  codingProfiles: CodingProfiles;
  ratingHistory: RatingHistoryPoint[];
  contestHistory: ContestHistoryItem[];
  achievements: Achievement[];
  solvedProblemsCount: number;
  isActive: boolean;
  isAdmin?: boolean;
}

export interface ContestProblem {
  id: string;
  code: string; // 'A', 'B', 'C'
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  solvedByCount: number;
}

export interface ContestStanding {
  rank: number;
  username: string;
  studentName: string;
  department: string;
  batch: string;
  solvedCount: number;
  penalty: number;
  problemStatus: Record<string, { solved: boolean; attempts: number; time?: number }>;
}

export interface Contest {
  id: string;
  title: string;
  slug: string;
  description: string;
  rules?: string;
  startTime: string; // ISO date string
  endTime?: string;
  durationMinutes: number;
  status: 'upcoming' | 'ongoing' | 'past';
  participantsCount: number;
  registeredUserIds: string[];
  platform: 'NUBPC Arena' | 'VJudge' | 'HackerRank' | 'Codeforces Group';
  problems: ContestProblem[];
  standings?: ContestStanding[];
  isPublished?: boolean;
  registrationLink?: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category:
    | 'C/C++'
    | 'Data Structures'
    | 'Algorithms'
    | 'Competitive Programming'
    | 'Problem Solving'
    | 'Git & GitHub'
    | 'Web Development'
    | 'Interview Preparation';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'Tutorial' | 'Practice Sheet' | 'Video Playlist' | 'Interactive' | 'Book / PDF' | 'Roadmap';
  link: string;
  author?: string;
  recommendedBy?: string;
  starsCount: number;
}

export interface Notice {
  id: string;
  title: string;
  category: 'Contest' | 'Workshop' | 'Announcement' | 'General' | 'Important';
  date: string;
  shortDescription: string;
  content: string;
  isPinned?: boolean;
  isPublished?: boolean;
  author: string;
  tags?: string[];
  externalUrl?: string;
}

export interface DepartmentInfo {
  code: string;
  name: string;
  headOrCoordinator?: string;
  totalStudents: number;
}

export interface CommunityStats {
  members: number;
  activeCoders: number;
  verifiedCoders: number;
  contests: number;
  resources: number;
  notices: number;
  problemsSolved: number;
}

export interface SyncLog {
  id: string;
  platform: 'Codeforces' | 'CodeChef' | 'LeetCode' | 'AtCoder' | 'All';
  triggeredBy: string;
  timestamp: string;
  status: 'success' | 'failed' | 'in_progress';
  recordsUpdated: number;
  message: string;
  studentId?: string;
  studentName?: string;
  oldRating?: number;
  newRating?: number;
  errorMessage?: string;
}
