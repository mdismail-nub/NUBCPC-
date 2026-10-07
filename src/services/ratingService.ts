import {
  CodingProfiles,
  LevelThresholds,
  NUBPCLevel,
  PlatformAccount,
  RatingConfig,
  StudentProfile,
} from '../types';

export const DEFAULT_RATING_CONFIG: RatingConfig = {
  codeforcesWeight: 0.35,
  codechefWeight: 0.25,
  atcoderWeight: 0.20,
  leetcodeWeight: 0.20,
  baselineRating: 1000,
};

export const DEFAULT_LEVEL_THRESHOLDS: LevelThresholds = {
  newbieMax: 1199,
  pupilMax: 1399,
  specialistMax: 1599,
  expertMax: 1899,
  masterMax: 2199,
};

/**
 * Extracts verified platform ratings for a given user.
 */
export function getPlatformRatings(profiles?: CodingProfiles): {
  codeforces: number | null;
  codechef: number | null;
  leetcode: number | null;
  atcoder: number | null;
} {
  return {
    codeforces: profiles?.codeforces?.verified && profiles.codeforces.rating ? profiles.codeforces.rating : null,
    codechef: profiles?.codechef?.verified && profiles.codechef.rating ? profiles.codechef.rating : null,
    leetcode: profiles?.leetcode?.verified && profiles.leetcode.rating ? profiles.leetcode.rating : null,
    atcoder: profiles?.atcoder?.verified && profiles.atcoder.rating ? profiles.atcoder.rating : null,
  };
}

/**
 * Normalizes different competitive programming platforms into a unified scale.
 * Distinct platforms have different rating curves:
 * - Codeforces: Benchmark standard (Specialist 1400, Expert 1600, Master 1900+)
 * - CodeChef: Slightly higher baseline (starts 1400; 3-star ~1600, 4-star ~1800)
 * - LeetCode: Contest rating starts at 1500 (1800 LC ~ 1450 CF, Knight 1900+ ~ 1600 CF)
 * - AtCoder: Deflated rating scale (800 Green ~ 1300 CF, 1200 Cyan ~ 1600 CF)
 */
export function normalizeRatings(
  platform: 'codeforces' | 'codechef' | 'leetcode' | 'atcoder',
  rawRating: number
): number {
  if (!rawRating || rawRating <= 0) return 0;

  switch (platform) {
    case 'codeforces':
      return Math.round(rawRating);

    case 'codechef':
      if (rawRating < 1400) return Math.round(rawRating * 0.85);
      return Math.round(1190 + (rawRating - 1400) * 0.92);

    case 'leetcode':
      if (rawRating <= 1400) return Math.round(rawRating * 0.75);
      return Math.round(1050 + (rawRating - 1400) * 0.88);

    case 'atcoder':
      if (rawRating <= 400) return Math.round(rawRating * 1.5);
      return Math.round(600 + rawRating * 0.85);

    default:
      return Math.round(rawRating);
  }
}

/**
 * Backwards-compatibility alias for normalizeRatings
 */
export const normalizePlatformRating = normalizeRatings;

/**
 * Centralized calculation of overall NUBPC Rating.
 * Missing platforms do NOT count as zero: weights are proportionally distributed
 * across connected verified platforms, plus a small multi-platform bonus.
 */
export function calculateOverallRating(
  profiles?: CodingProfiles,
  config: RatingConfig = DEFAULT_RATING_CONFIG
): {
  overallRating: number;
  normalizedBreakdown: {
    platform: string;
    raw: number;
    normalized: number;
    effectiveWeight: number;
    contribution: number;
  }[];
  activePlatformsCount: number;
} {
  if (!profiles) {
    return {
      overallRating: config.baselineRating,
      normalizedBreakdown: [],
      activePlatformsCount: 0,
    };
  }

  const verifiedList: {
    platform: 'codeforces' | 'codechef' | 'leetcode' | 'atcoder';
    label: string;
    raw: number;
    baseWeight: number;
  }[] = [];

  if (profiles.codeforces?.verified && profiles.codeforces.rating) {
    verifiedList.push({
      platform: 'codeforces',
      label: 'Codeforces',
      raw: profiles.codeforces.rating,
      baseWeight: config.codeforcesWeight,
    });
  }

  if (profiles.codechef?.verified && profiles.codechef.rating) {
    verifiedList.push({
      platform: 'codechef',
      label: 'CodeChef',
      raw: profiles.codechef.rating,
      baseWeight: config.codechefWeight,
    });
  }

  if (profiles.leetcode?.verified && profiles.leetcode.rating) {
    verifiedList.push({
      platform: 'leetcode',
      label: 'LeetCode',
      raw: profiles.leetcode.rating,
      baseWeight: config.leetcodeWeight,
    });
  }

  if (profiles.atcoder?.verified && profiles.atcoder.rating) {
    verifiedList.push({
      platform: 'atcoder',
      label: 'AtCoder',
      raw: profiles.atcoder.rating,
      baseWeight: config.atcoderWeight,
    });
  }

  if (verifiedList.length === 0) {
    return {
      overallRating: config.baselineRating,
      normalizedBreakdown: [],
      activePlatformsCount: 0,
    };
  }

  const totalActiveBaseWeight = verifiedList.reduce((acc, curr) => acc + curr.baseWeight, 0);

  let weightedSum = 0;
  const breakdown = verifiedList.map((item) => {
    const normalized = normalizeRatings(item.platform, item.raw);
    const effectiveWeight = item.baseWeight / totalActiveBaseWeight;
    const contribution = normalized * effectiveWeight;
    weightedSum += contribution;

    return {
      platform: item.label,
      raw: item.raw,
      normalized,
      effectiveWeight: Math.round(effectiveWeight * 100) / 100,
      contribution: Math.round(contribution),
    };
  });

  const diversityBonusPercent = Math.min((verifiedList.length - 1) * 0.015, 0.045);
  const finalRating = Math.round(weightedSum * (1 + diversityBonusPercent));

  return {
    overallRating: Math.max(100, finalRating),
    normalizedBreakdown: breakdown,
    activePlatformsCount: verifiedList.length,
  };
}

/**
 * Determines NUBPC Level from Rating with configurable thresholds.
 */
export function getNUBPCLevel(
  rating: number,
  thresholds: LevelThresholds = DEFAULT_LEVEL_THRESHOLDS
): NUBPCLevel {
  if (rating <= thresholds.newbieMax) return 'Newbie';
  if (rating <= thresholds.pupilMax) return 'Pupil';
  if (rating <= thresholds.specialistMax) return 'Specialist';
  if (rating <= thresholds.expertMax) return 'Expert';
  if (rating <= thresholds.masterMax) return 'Master';
  return 'Grandmaster';
}

/**
 * Backwards-compatibility alias for getNUBPCLevel
 */
export const getLevelFromRating = getNUBPCLevel;

/**
 * Re-evaluates ratings, levels, and ranks across all students.
 */
export function updateLeaderboard(
  students: StudentProfile[],
  config: RatingConfig = DEFAULT_RATING_CONFIG,
  thresholds: LevelThresholds = DEFAULT_LEVEL_THRESHOLDS
): StudentProfile[] {
  const updated = students.map((student) => {
    const { overallRating } = calculateOverallRating(student.codingProfiles, config);
    const ratingChange = overallRating - (student.overallRating || overallRating);
    const level = getNUBPCLevel(overallRating, thresholds);

    return {
      ...student,
      overallRating,
      ratingChange,
      level,
    };
  });

  // Sort descending by overall rating
  updated.sort((a, b) => b.overallRating - a.overallRating);

  // Assign updated ranks
  return updated.map((student, idx) => ({
    ...student,
    rank: idx + 1,
  }));
}

export interface LevelMetadata {
  name: NUBPCLevel;
  textColor: string;
  bgColor: string;
  borderColor: string;
  hex: string;
  description: string;
}

export const LEVEL_METADATA: Record<NUBPCLevel, LevelMetadata> = {
  Newbie: {
    name: 'Newbie',
    textColor: 'text-slate-600',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-200',
    hex: '#64748B',
    description: 'Starting the competitive programming journey',
  },
  Pupil: {
    name: 'Pupil',
    textColor: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    hex: '#059669',
    description: 'Solid fundamentals in basics, arrays, and math',
  },
  Specialist: {
    name: 'Specialist',
    textColor: 'text-cyan-700',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    hex: '#0891B2',
    description: 'Skilled in two-pointers, binary search, and basic graph/trees',
  },
  Expert: {
    name: 'Expert',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    hex: '#2563EB',
    description: 'Strong mastery of DP, segment trees, and advanced algorithms',
  },
  Master: {
    name: 'Master',
    textColor: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    hex: '#D97706',
    description: 'Top university contender, IUPC/ICPC national qualifier',
  },
  Grandmaster: {
    name: 'Grandmaster',
    textColor: 'text-rose-700',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    hex: '#E11D48',
    description: 'Elite competitive programmer, international champion caliber',
  },
};
