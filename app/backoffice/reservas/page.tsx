import Link from "next/link";

import { bookingService } from "@/modules/bookings/booking.service";
import { AdminBookingActions } from "@/modules/bookings/components/admin-booking-actions";

export default async function BackofficeBookingsPage() {
  const bookings =
    await bookingService.listAllBookings();

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/backoffice"
          className="text-sm text-slate-400 hover:text-white"
        >
          ← Volver al backoffice
        </Link>

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
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-sm text-slate-400">
              <tr>
                <th className="px-5 py-4">
                  Cliente
                </th>

                <th className="px-5 py-4">
                  Cancha
                </th>

                <th className="px-5 py-4">
                  Fecha
                </th>

                <th className="px-5 py-4">
                  Horario
                </th>

                <th className="px-5 py-4">
                  Total
                </th>

                <th className="px-5 py-4">
                  Estado
                </th>

                <th className="px-5 py-4">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-t border-slate-800"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium">
                      {booking.user.name}
                    </p>

                    <p className="text-sm text-slate-400">
                      {booking.user.email}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p>
                      {booking.court.name}
                    </p>

                    <p className="text-sm text-slate-400">
                      {booking.court.sport}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    {booking.bookingDate}
                  </td>

                  <td className="px-5 py-4">
                    {booking.startHour}:00 -{" "}
                    {booking.startHour + 1}:00
                  </td>

                  <td className="px-5 py-4">
                    S/ {booking.totalPrice.toFixed(2)}
                  </td>

                  <td className="px-5 py-4">
                    {booking.status}
                  </td>

                  <td className="px-5 py-4">
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
      )}
    </div>
  );
}