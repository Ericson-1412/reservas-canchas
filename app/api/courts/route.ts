import { NextResponse } from "next/server";

import { courtService } from "@/modules/courts/court.service";

import { UserRole } from "@/lib/generated/prisma/enums";

import { getCurrentUser } from "@/modules/auth/auth.session";

export async function GET() {
  try {
    const courts = await courtService.listCourts();

    return NextResponse.json(courts);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "No se pudo obtener el listado de canchas.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "No autenticado." },
      { status: 401 }
    );
  }

  if (user.role !== UserRole.ADMIN) {
    return NextResponse.json(
      { message: "No autorizado." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    const court =
      await courtService.createCourt({
        name:
          typeof body.name === "string"
            ? body.name
            : "",

        sport:
          typeof body.sport === "string"
            ? body.sport
            : "",

        description:
          typeof body.description === "string"
            ? body.description
            : null,

        pricePerHour:
          Number(body.pricePerHour),
      });

    return NextResponse.json(
      {
        message: "Cancha creada correctamente.",
        court,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === "INVALID_NAME" ||
        error.message === "INVALID_SPORT" ||
        error.message === "INVALID_PRICE"
      ) {
        return NextResponse.json(
          {
            message:
              "Los datos de la cancha son inválidos.",
          },
          {
            status: 400,
          }
        );
      }
    }

    console.error(error);

    return NextResponse.json(
      {
        message: "No se pudo crear la cancha.",
      },
      {
        status: 500,
      }
    );
  }
}