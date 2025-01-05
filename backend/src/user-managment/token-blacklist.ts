// token-blacklist.ts

const tokenBlacklist = new Set<string>();

export const blacklistToken = (token: string): void => {
  tokenBlacklist.add(token);
};

export const isTokenBlacklisted = (token: string): boolean => {
  return tokenBlacklist.has(token);
};
