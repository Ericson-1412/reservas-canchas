import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/modules/auth/auth.session";
import { bookingService } from "@/modules/bookings/booking.service";
import { BookingStatus } from "@/lib/generated/prisma/enums";
import { PayBookingButton } from "@/modules/payments/components/pay-booking-button";

export default async function MyBookingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const bookings =
    await bookingService.listUserBookings(user.id);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <Link
            href="/canchas"
            className="text-sm text-slate-400 hover:text-white"
          >
            ← Volver a canchas
          </Link>

          <h1 className="mt-4 text-3xl font-bold">
            Mis reservas
          </h1>

          <p className="mt-2 text-slate-400">
            Consulta las reservas que has realizado.
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8">
            <p className="text-slate-400">
              Todavía no tienes reservas.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <article
                key={booking.id}
                className="rounded-xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {booking.court.name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      {booking.court.sport}
                    </p>

                    <p className="mt-4">
                      Fecha: {booking.bookingDate}
                    </p>

                    <p>
                      Horario: {booking.startHour}:00 -{" "}
                      {booking.startHour + 1}:00
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xl font-bold">
                      S/ {booking.totalPrice.toFixed(2)}
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      {booking.status}
                    </p>
                    
                    {booking.status === BookingStatus.PENDING && (
                      <PayBookingButton bookingId={booking.id} />
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}