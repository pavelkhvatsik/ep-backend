export const generateExpiresInRefreshToken = () => {
  const now = new Date();
  return new Date(now.getTime() + Number(process.env.REFRESH_TOKEN_EXPIRES_IN));
};
