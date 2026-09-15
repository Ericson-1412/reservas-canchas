import {
    generateAnswerWithAi,
    generateSqlWithAi,
} from "@/modules/ai/ai.gateway";
import { aiRepository } from "@/modules/ai/ai.repository";
import { validateAiSql } from "@/modules/ai/ai.validator";

function normalizeValue(
    value: unknown
): unknown {
    if (typeof value === "bigint") {
        return Number(value);
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    if (
        value !== null &&
        typeof value === "object" &&
        "toNumber" in value &&
        typeof value.toNumber === "function"
    ) {
        return value.toNumber();
    }

    return value;
}

function normalizeRows(
    rows: unknown[]
): Record<string, unknown>[] {
    return rows.map((row) => {
        if (
            !row ||
            typeof row !== "object" ||
            Array.isArray(row)
        ) {
            return {
                value: normalizeValue(row),
            };
        }

        return Object.fromEntries(
            Object.entries(row).map(
                ([key, value]) => [
                    key,
                    normalizeValue(value),
                ]
            )
        );
    });
}

export const aiService = {
    async executeQuery(question: string) {
        const cleanQuestion =
            question.trim();

        if (!cleanQuestion) {
            throw new Error(
                "QUESTION_REQUIRED"
            );
        }

        if (cleanQuestion.length > 500) {
            throw new Error(
                "QUESTION_TOO_LONG"
            );
        }

        const generated =
            await generateSqlWithAi(
                cleanQuestion
            );

        const safeSql =
            validateAiSql(
                generated.sql
            );

        const rows =
            await aiRepository.executeReadOnlyQuery(
                safeSql
            );

        const results =
            normalizeRows(rows);

        const answer =
            await generateAnswerWithAi(
                cleanQuestion,
                results
            );

        return {
            sql: safeSql,
            explanation:
                generated.explanation,
            answer,
            results,
        };
    },
};