import { PlatformAccount } from '../types';

export const codechefService = {
  getProfileUrl(handle: string): string {
    return `https://www.codechef.com/users/${encodeURIComponent(handle.trim())}`;
  },

  async verifyUser(handle: string): Promise<PlatformAccount> {
    const cleanHandle = handle.trim();
    if (!cleanHandle || cleanHandle.length < 2) {
      return {
        handle: cleanHandle,
        status: 'invalid',
        verified: false,
        errorMessage: 'Invalid CodeChef handle format.',
        profileUrl: cleanHandle ? `https://www.codechef.com/users/${cleanHandle}` : undefined,
      };
    }

    await new Promise((resolve) => setTimeout(resolve, 600));

    const hash = cleanHandle.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const mockRating = 1350 + (hash % 850);
    let rank = '2★';
    if (mockRating < 1400) rank = '1★';
    else if (mockRating < 1600) rank = '2★';
    else if (mockRating < 1800) rank = '3★';
    else if (mockRating < 2000) rank = '4★';
    else rank = '5★';

    return {
      handle: cleanHandle,
      status: 'verified',
      verified: true,
      rating: mockRating,
      maxRating: mockRating + (hash % 100),
      rank,
      profileUrl: `https://www.codechef.com/users/${cleanHandle}`,
      lastUpdated: new Date().toISOString(),
    };
  },
};
