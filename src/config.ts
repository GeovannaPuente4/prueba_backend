const required = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
};

export const env = {
  PORT: Number(process.env.PORT) || 3000,
  JWT_SECRET: required("JWT_SECRET"),
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? "*",
};
