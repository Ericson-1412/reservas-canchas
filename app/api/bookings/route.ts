import { NextResponse } from "next/server";

import { getCurrentUser } from "@/modules/auth/auth.session";
import { bookingService } from "@/modules/bookings/booking.service";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      {
        message: "Debes iniciar sesión para reservar.",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const body = await request.json();

    const booking = await bookingService.createBooking(
      user.id,
      {
        courtId: Number(body.courtId),
        bookingDate: body.bookingDate,
        startHour: Number(body.startHour),
      }
    );

    return NextResponse.json(
      {
        message: "Reserva creada correctamente.",
        booking,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "INVALID_COURT") {
        return NextResponse.json(
          { message: "Cancha inválida." },
          { status: 400 }
        );
      }

      if (error.message === "INVALID_DATE") {
        return NextResponse.json(
          { message: "Fecha inválida." },
          { status: 400 }
        );
      }

      if (error.message === "INVALID_HOUR") {
        return NextResponse.json(
          { message: "Horario inválido." },
          { status: 400 }
        );
      }

      if (error.message === "COURT_NOT_FOUND") {
        return NextResponse.json(
          { message: "La cancha no existe o está inactiva." },
          { status: 404 }
        );
      }

      if (error.message === "SLOT_NOT_AVAILABLE") {
        return NextResponse.json(
          {
            message: "El horario seleccionado ya no está disponible.",
          },
          {
            status: 409,
          }
        );
      }
    }

    console.error(error);

    return NextResponse.json(
      {
        message: "No se pudo crear la reserva.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      {
        message: "Debes iniciar sesión.",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const bookings =
      await bookingService.listUserBookings(user.id);

    return NextResponse.json(bookings);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "No se pudieron obtener las reservas.",
      },
      {
        status: 500,
      }
    );
  }
}