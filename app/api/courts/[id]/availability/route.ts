import { NextResponse } from "next/server";

import { bookingService } from "@/modules/bookings/booking.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;

  const courtId = Number(id);

  if (!Number.isInteger(courtId) || courtId <= 0) {
    return NextResponse.json(
      { message: "ID de cancha inválido." },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(request.url);

  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json(
      { message: "La fecha es obligatoria." },
      { status: 400 }
    );
  }

  try {
    const availability =
      await bookingService.getAvailability(courtId, date);

    return NextResponse.json(availability);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "No se pudo consultar la disponibilidad." },
      { status: 500 }
    );
  }
}