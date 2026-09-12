import { buildDatabaseUrl } from "@/lib/config/build-database-url";

function getEnvVariable(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;

  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }

  return value;
}

export const dbConfig = {
  host: getEnvVariable("DB_HOST", "localhost"),
  port: parseInt(getEnvVariable("DB_PORT", "5432")),
  database: getEnvVariable("DB_NAME", "reservas_canchas"),
  user: getEnvVariable("DB_USER", "postgres"),
  password: getEnvVariable("DB_PASSWORD"),
};

export const databaseUrl = buildDatabaseUrl(dbConfig);

export const authConfig = {
  accessTokenSecret: getEnvVariable("JWT_ACCESS_SECRET"),
  refreshTokenSecret: getEnvVariable("JWT_REFRESH_SECRET"),
};

export const mercadoPagoConfig = {
  accessToken: getEnvVariable(
    "MERCADO_PAGO_ACCESS_TOKEN"
  ),

  webhookSecret: getEnvVariable(
    "MERCADO_PAGO_WEBHOOK_SECRET"
  ),

  appUrl: getEnvVariable(
    "APP_URL",
    "http://localhost:3000"
  ),
};