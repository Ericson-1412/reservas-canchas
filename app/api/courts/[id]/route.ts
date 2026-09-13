import { NextResponse } from "next/server";

import { UserRole } from "@/lib/generated/prisma/enums";

import { getCurrentUser } from "@/modules/auth/auth.session";
import { courtService } from "@/modules/courts/court.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
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

  const { id } = await params;
  const courtId = Number(id);

  if (
    !Number.isInteger(courtId) ||
    courtId <= 0
  ) {
    return NextResponse.json(
      { message: "Cancha inválida." },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();

    const court =
      await courtService.updateCourt(
        courtId,
        {
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

          active:
            body.active === true,
        }
      );

    return NextResponse.json({
      message: "Cancha actualizada correctamente.",
      court,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "COURT_NOT_FOUND"
    ) {
      return NextResponse.json(
        { message: "La cancha no existe." },
        { status: 404 }
      );
    }

    console.error(error);

    return NextResponse.json(
      {
        message:
          "No se pudo actualizar la cancha.",
      },
      {
        status: 500,
      }
    );
  }
}