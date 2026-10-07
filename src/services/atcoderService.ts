import { PlatformAccount } from '../types';

export const atcoderService = {
  getProfileUrl(handle: string): string {
    return `https://atcoder.jp/users/${encodeURIComponent(handle.trim())}`;
  },

  async verifyUser(handle: string): Promise<PlatformAccount> {
    const cleanHandle = handle.trim();
    if (!cleanHandle || cleanHandle.length < 2) {
      return {
        handle: cleanHandle,
        status: 'invalid',
        verified: false,
        errorMessage: 'Invalid AtCoder handle format.',
        profileUrl: cleanHandle ? `https://atcoder.jp/users/${cleanHandle}` : undefined,
      };
    }

    await new Promise((resolve) => setTimeout(resolve, 550));

    const hash = cleanHandle.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const mockRating = 600 + (hash % 950);
    let rank = 'Brown';
    if (mockRating >= 1600) rank = 'Blue';
    else if (mockRating >= 1200) rank = 'Cyan';
    else if (mockRating >= 800) rank = 'Green';

    return {
      handle: cleanHandle,
      status: 'verified',
      verified: true,
      rating: mockRating,
      maxRating: mockRating + (hash % 80),
      rank,
      profileUrl: `https://atcoder.jp/users/${cleanHandle}`,
      lastUpdated: new Date().toISOString(),
    };
  },
};
