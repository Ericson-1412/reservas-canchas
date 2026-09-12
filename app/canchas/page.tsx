import Link from "next/link";

import { CourtCard } from "@/modules/courts/components/court-card";
import { courtService } from "@/modules/courts/court.service";

import { getCurrentUser } from "@/modules/auth/auth.session";
import { LogoutButton } from "@/modules/auth/components/logout-button";

export default async function CourtsPage() {
  const courts = await courtService.listCourts();
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold">
              Canchas disponibles
            </h1>

            <p className="mt-2 text-slate-400">
              Selecciona una cancha para realizar una reserva.
            </p>

            {user && (
              <p className="mt-2 text-sm text-slate-500">
                Bienvenido, {user.name}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/mis-reservas"
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
                >
                  Mis reservas
                </Link>

                <LogoutButton />
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courts.map((court) => (
            <CourtCard
              key={court.id}
              court={court}
            />
          ))}
        </div>

      </div>
    </main>
  );
}