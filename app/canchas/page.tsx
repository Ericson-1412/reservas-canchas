import Link from "next/link";

import { CourtCard } from "@/modules/courts/components/court-card";
import { courtService } from "@/modules/courts/court.service";

import { getCurrentUser } from "@/modules/auth/auth.session";
import { LogoutButton } from "@/modules/auth/components/logout-button";

export default async function CourtsPage() {
  const courts = await courtService.listCourts();
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
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
              Encuentra tu cancha y reserva tu horario
            </p>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium text-slate-800">
                    {user.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    {user.email}
                  </p>
                </div>

                <Link
                  href="/mis-reservas"
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Mis reservas
                </Link>

                <LogoutButton />
              </>
            ) : (
              <>
                <Link
                  href="/registro"
                  className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 sm:block"
                >
                  Crear cuenta
                </Link>

                <Link
                  href="/login"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Iniciar sesión
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Reserva deportiva
          </span>

          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-slate-900">
            Encuentra la cancha ideal para tu próximo partido
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-7 text-slate-500">
            Consulta horarios disponibles, reserva en línea y realiza
            tu pago de forma rápida y segura.
          </p>
        </div>
      </section>

      {/* Canchas */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Canchas disponibles
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Selecciona una cancha para consultar sus horarios.
            </p>
          </div>

          <p className="hidden text-sm text-slate-400 sm:block">
            {courts.length} canchas disponibles
          </p>
        </div>

        {courts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-slate-500">
              Actualmente no hay canchas disponibles.
            </p>
          </div>
        ) : (
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {courts.map((court) => (
              <CourtCard
                key={court.id}
                court={court}
                isAuthenticated={Boolean(user)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}