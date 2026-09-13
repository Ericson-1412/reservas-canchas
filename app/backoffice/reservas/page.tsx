import Link from "next/link";

import { bookingService } from "@/modules/bookings/booking.service";
import { AdminBookingActions } from "@/modules/bookings/components/admin-booking-actions";
import {
  getBookingStatusLabel,
  getPaymentStatusLabel,
} from "@/modules/bookings/booking.labels";

export default async function BackofficeBookingsPage() {
  const bookings =
    await bookingService.listAllBookings();

  return (
    <div>
      <div className="mb-8">

        <h1 className="mt-4 text-3xl font-bold">
          Reservas
        </h1>

        <p className="mt-2 text-slate-400">
          Administración de reservas realizadas por los usuarios.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8">
          <p className="text-slate-400">
            No existen reservas registradas.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Cliente
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Cancha
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Fecha
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Horario
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Total
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Reserva
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Pago
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-5">
                      <p className="font-semibold text-slate-900">
                        {booking.user.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {booking.user.email}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-medium text-slate-800">
                        {booking.court.name}
                      </p>

                      <p className="mt-1 text-xs font-medium uppercase text-blue-500">
                        {booking.court.sport}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {booking.bookingDate}
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
                        {booking.startHour}:00 -{" "}
                        {booking.startHour + 1}:00
                      </span>
                    </td>

                    <td className="px-6 py-5 font-semibold text-slate-900">
                      S/ {booking.totalPrice.toFixed(2)}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${booking.status === "CONFIRMED"
                            ? "bg-green-50 text-green-700"
                            : booking.status === "CANCELED"
                              ? "bg-red-50 text-red-600"
                              : "bg-amber-50 text-amber-700"
                          }`}
                      >
                        {getBookingStatusLabel(booking.status)}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${booking.payment?.status === "APPROVED"
                              ? "bg-green-50 text-green-700"
                              : booking.payment?.status === "REJECTED"
                                ? "bg-red-50 text-red-600"
                                : "bg-slate-100 text-slate-600"
                            }`}
                        >
                          {booking.payment
                            ? getPaymentStatusLabel(
                              booking.payment.status
                            )
                            : "Sin pago"}
                        </span>

                        {booking.payment
                          ?.mercadoPagoPaymentId && (
                            <p className="mt-2 max-w-36 truncate text-xs text-slate-400">
                              {
                                booking.payment
                                  .mercadoPagoPaymentId
                              }
                            </p>
                          )}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <AdminBookingActions
                        bookingId={booking.id}
                        status={booking.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}