import Image from "next/image";
import Link from "next/link";

import { BookingStatus } from "@/lib/generated/prisma/enums";

import { bookingService } from "@/modules/bookings/booking.service";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/modules/auth/auth.session";

import {
  getBookingStatusLabel,
  getPaymentStatusLabel,
} from "@/modules/bookings/booking.labels";

import { getCourtImage } from "@/modules/courts/court-image";

import { PayBookingButton } from "@/modules/payments/components/pay-booking-button";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00.000Z`));
}

function getBookingStatusStyle(
  status: BookingStatus
) {
  switch (status) {
    case BookingStatus.CONFIRMED:
      return "bg-green-50 text-green-700 border-green-200";

    case BookingStatus.CANCELED:
      return "bg-red-50 text-red-600 border-red-200";

    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
}

export default async function MyBookingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const bookings =
    await bookingService.listUserBookings(user.id);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <Link
              href="/canchas"
              className="text-xl font-bold text-slate-900"
            >
              Reserva Canchas
            </Link>

            <p className="text-xs text-slate-500">
              Gestiona tus reservas deportivas
            </p>
          </div>

          <Link
            href="/canchas"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Ver canchas
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Mis reservas
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Historial de reservas
          </h1>

          <p className="mt-2 text-slate-500">
            Consulta el estado de tus reservas y pagos realizados.
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl">
              ⚽
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Aún no tienes reservas
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Explora nuestras canchas y reserva tu próximo partido.
            </p>

            <Link
              href="/canchas"
              className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Explorar canchas
            </Link>
          </div>
        ) : (
          <div className="mt-10 space-y-5">
            {bookings.map((booking) => {
              const image = getCourtImage(
                booking.court.sport
              );

              return (
                <article
                  key={booking.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="grid md:grid-cols-[220px_1fr]">
                    {/* IMAGEN */}
                    <div className="relative min-h-52 md:min-h-full">
                      <Image
                        src={image}
                        alt={booking.court.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* INFORMACIÓN */}
                    <div className="p-6">
                      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                            {booking.court.sport}
                          </span>

                          <h2 className="mt-1 text-xl font-bold text-slate-900">
                            {booking.court.name}
                          </h2>

                          <div className="mt-5 space-y-2 text-sm text-slate-600">
                            <p>
                              <span className="font-medium text-slate-800">
                                Fecha:
                              </span>{" "}
                              {formatDate(
                                booking.bookingDate
                              )}
                            </p>

                            <p>
                              <span className="font-medium text-slate-800">
                                Horario:
                              </span>{" "}
                              {booking.startHour}:00 -{" "}
                              {booking.startHour + 1}:00
                            </p>
                          </div>
                        </div>

                        <div className="sm:text-right">
                          <p className="text-2xl font-bold text-slate-900">
                            S/{" "}
                            {booking.totalPrice.toFixed(
                              2
                            )}
                          </p>

                          <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                            Total
                          </p>
                        </div>
                      </div>

                      {/* ESTADOS + ACCIÓN */}
                      <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getBookingStatusStyle(
                              booking.status
                            )}`}
                          >
                            Reserva:{" "}
                            {getBookingStatusLabel(
                              booking.status
                            )}
                          </span>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${booking.payment?.status ===
                              "APPROVED"
                              ? "border-green-200 bg-green-50 text-green-700"
                              : "border-slate-200 bg-slate-50 text-slate-600"
                              }`}
                          >
                            Pago:{" "}
                            {booking.payment
                              ? getPaymentStatusLabel(
                                booking.payment
                                  .status
                              )
                              : "Sin pago"}
                          </span>
                        </div>

                        {booking.status ===
                          BookingStatus.PENDING && (
                            <PayBookingButton
                              bookingId={booking.id}
                            />
                          )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}