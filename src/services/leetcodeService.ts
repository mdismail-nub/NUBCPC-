import { PlatformAccount } from '../types';

export const leetcodeService = {
  getProfileUrl(handle: string): string {
    return `https://leetcode.com/u/${encodeURIComponent(handle.trim())}/`;
  },

  async verifyUser(handle: string): Promise<PlatformAccount> {
    const cleanHandle = handle.trim();
    if (!cleanHandle || cleanHandle.length < 2) {
      return {
        handle: cleanHandle,
        status: 'invalid',
        verified: false,
        errorMessage: 'Invalid LeetCode handle format.',
        profileUrl: cleanHandle ? `https://leetcode.com/u/${cleanHandle}/` : undefined,
      };
    }

    await new Promise((resolve) => setTimeout(resolve, 650));

    const hash = cleanHandle.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const mockRating = 1480 + (hash % 780);
    let rank = 'Knight Candidate';
    if (mockRating >= 2150) rank = 'Guardian';
    else if (mockRating >= 1850) rank = 'Knight';

    return {
      handle: cleanHandle,
      status: 'verified',
      verified: true,
      rating: mockRating,
      maxRating: mockRating + (hash % 90),
      rank,
      profileUrl: `https://leetcode.com/u/${cleanHandle}/`,
      lastUpdated: new Date().toISOString(),
    };
  },
};
