import Link from "next/link";

import { courtService } from "@/modules/courts/court.service";

export default async function BackofficeCourtsPage() {
  const courts =
    await courtService.listAllCourts();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>

          <h1 className="mt-4 text-3xl font-bold">
            Canchas
          </h1>

          <p className="mt-2 text-slate-400">
            Administración de canchas deportivas.
          </p>
        </div>

        <Link
          href="/backoffice/canchas/nueva"
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          + Nueva cancha
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Cancha
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Deporte
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Precio
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Estado
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {courts.map((court) => (
                <tr
                  key={court.id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-6 py-5">
                    <p className="font-semibold text-slate-900">
                      {court.name}
                    </p>

                    {court.description && (
                      <p className="mt-1 max-w-md text-xs text-slate-400">
                        {court.description}
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase text-blue-700">
                      {court.sport}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <p className="font-semibold text-slate-900">
                      S/ {court.pricePerHour.toFixed(2)}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      por hora
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${court.active
                        ? "bg-green-50 text-green-700"
                        : "bg-slate-100 text-slate-500"
                        }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${court.active
                          ? "bg-green-500"
                          : "bg-slate-400"
                          }`}
                      />

                      {court.active
                        ? "Activa"
                        : "Inactiva"}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <Link
                      href={`/backoffice/canchas/${court.id}/editar`}
                      className="inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}