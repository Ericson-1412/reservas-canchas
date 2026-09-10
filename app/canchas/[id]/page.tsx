import Link from "next/link";
import { notFound } from "next/navigation";

import { courtService } from "@/modules/courts/court.service";

import { AvailabilitySelector } from "@/modules/bookings/components/availability-selector";

interface CourtDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CourtDetailPage({
  params,
}: CourtDetailPageProps) {
  const { id } = await params;

  const courtId = Number(id);

  if (!Number.isInteger(courtId)) {
    notFound();
  }

  const court = await courtService.getCourtById(courtId);

  if (!court) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/canchas"
          className="text-sm text-slate-400 hover:text-white"
        >
          ← Volver a canchas
        </Link>

        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-8">
          <p className="text-sm font-medium text-slate-400">
            {court.sport}
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            {court.name}
          </h1>

          <p className="mt-4 text-slate-300">
            {court.description}
          </p>

          <div className="mt-8">
            <span className="text-3xl font-bold">
              S/ {court.pricePerHour.toFixed(2)}
            </span>

            <span className="ml-2 text-slate-400">
              por hora
            </span>
          </div>

          <div className="mt-8">
            <p className="text-sm text-slate-400">
              Horario de atención
            </p>

            <p className="mt-1 font-medium">
              10:00 a 22:00
            </p>
          </div>

          <AvailabilitySelector courtId={court.id} />
          
        </div>
      </div>
    </main>
  );
}