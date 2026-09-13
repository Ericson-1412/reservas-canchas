import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AvailabilitySelector } from "@/modules/bookings/components/availability-selector";

import { getCourtImage } from "@/modules/courts/court-image";
import { courtService } from "@/modules/courts/court.service";

interface CourtPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CourtPage({
  params,
}: CourtPageProps) {
  const { id } = await params;

  const courtId = Number(id);

  if (
    !Number.isInteger(courtId) ||
    courtId <= 0
  ) {
    notFound();
  }

  const court =
    await courtService.getCourtById(
      courtId
    );

  if (!court) {
    notFound();
  }

  const image =
    getCourtImage(court.sport);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link
          href="/canchas"
          className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          ← Volver a canchas
        </Link>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* IMAGEN PRINCIPAL */}
          <div className="relative h-[320px] w-full sm:h-[380px]">
            <Image
              src={image}
              alt={court.name}
              fill
              priority
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <span className="inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase text-slate-800">
                {court.sport}
              </span>

              <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
                {court.name}
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-white/85 sm:text-base">
                {court.description ??
                  "Cancha disponible para reservas."}
              </p>
            </div>
          </div>

          {/* CONTENIDO */}
          <section className="p-7 sm:p-9">

            {/* RESUMEN */}
            <div className="grid gap-4 border-b border-slate-200 pb-7 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Precio por hora
                </p>

                <div className="mt-2 flex items-end gap-2">
                  <span className="text-3xl font-bold text-slate-900">
                    S/ {court.pricePerHour.toFixed(2)}
                  </span>

                  <span className="pb-1 text-sm text-slate-500">
                    / hora
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Horario de atención
                </p>

                <p className="mt-2 text-xl font-bold text-slate-900">
                  10:00 a 22:00
                </p>
              </div>
            </div>

            {/* RESERVA */}
            <div className="mt-8">
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                  Reserva deportiva
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Selecciona tu fecha y horario
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Cada reserva corresponde a un bloque de 1 hora.
                </p>
              </div>

              <AvailabilitySelector
                courtId={court.id}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}