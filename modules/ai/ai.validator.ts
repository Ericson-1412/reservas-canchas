const FORBIDDEN_KEYWORDS = [
  "INSERT",
  "UPDATE",
  "DELETE",
  "DROP",
  "ALTER",
  "TRUNCATE",
  "CREATE",
  "GRANT",
  "REVOKE",
  "COPY",
  "CALL",
  "DO",
];

const FORBIDDEN_CONTENT = [
  "passwordHash",
  "information_schema",
  "pg_catalog",
];

export function validateAiSql(sql: string): string {
  const cleanSql = sql.trim();

  if (!cleanSql) {
    throw new Error("AI_SQL_EMPTY");
  }

  const normalized = cleanSql.toUpperCase();

  if (!normalized.startsWith("SELECT ")) {
    throw new Error("AI_SQL_NOT_READ_ONLY");
  }

  // Evitamos comentarios SQL.
  if (
    cleanSql.includes("--") ||
    cleanSql.includes("/*") ||
    cleanSql.includes("*/")
  ) {
    throw new Error("AI_SQL_UNSAFE");
  }

  // Permitimos como máximo un ; al final.
  const withoutFinalSemicolon =
    cleanSql.endsWith(";")
      ? cleanSql.slice(0, -1).trim()
      : cleanSql;

  if (withoutFinalSemicolon.includes(";")) {
    throw new Error("AI_SQL_MULTIPLE_STATEMENTS");
  }

  for (const keyword of FORBIDDEN_KEYWORDS) {
    const regex = new RegExp(
      `\\b${keyword}\\b`,
      "i"
    );

    if (regex.test(withoutFinalSemicolon)) {
      throw new Error("AI_SQL_UNSAFE");
    }
  }

  for (const content of FORBIDDEN_CONTENT) {
    if (
      withoutFinalSemicolon
        .toLowerCase()
        .includes(content.toLowerCase())
    ) {
      throw new Error("AI_SQL_UNSAFE");
    }
  }

  return withoutFinalSemicolon;
}