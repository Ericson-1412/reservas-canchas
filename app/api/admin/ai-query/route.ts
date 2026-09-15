import { NextResponse } from "next/server";

import { UserRole } from "@/lib/generated/prisma/enums";

import { getCurrentUser } from "@/modules/auth/auth.session";
import { aiService } from "@/modules/ai/ai.service";

export async function POST(
    request: Request
) {
    const user =
        await getCurrentUser();

    if (!user) {
        return NextResponse.json(
            {
                message:
                    "Debes iniciar sesión.",
            },
            {
                status: 401,
            }
        );
    }

    if (user.role !== UserRole.ADMIN) {
        return NextResponse.json(
            {
                message:
                    "No tienes permisos para utilizar esta función.",
            },
            {
                status: 403,
            }
        );
    }

    try {
        const body =
            await request.json();

        const question =
            typeof body.question === "string"
                ? body.question
                : "";

        const result =
            await aiService.executeQuery(
                question
            );

        return NextResponse.json(
            result
        );
    } catch (error) {
        if (error instanceof Error) {
            if (
                error.message ===
                "QUESTION_REQUIRED"
            ) {
                return NextResponse.json(
                    {
                        message:
                            "Debes escribir una pregunta.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            if (
                error.message ===
                "QUESTION_TOO_LONG"
            ) {
                return NextResponse.json(
                    {
                        message:
                            "La consulta es demasiado larga.",
                    },
                    {
                        status: 400,
                    }
                );
            }
        }

        console.error(
            "AI query error:",
            error
        );

        return NextResponse.json(
            {
                message:
                    "No se pudo procesar la consulta con IA.",
            },
            {
                status: 500,
            }
        );
    }
}