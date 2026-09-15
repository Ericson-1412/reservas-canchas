import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

if (process.env.NODE_ENV !== "production") {
  loadEnv({
    path: ".env.local",
  });
}

const databaseUrl =
  process.env.DATABASE_URL_UNPOOLED ??
  process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required for Prisma."
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    url: databaseUrl,
  },
});