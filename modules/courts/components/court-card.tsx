import Link from "next/link";

import type { CourtListItem } from "@/modules/courts/court.types";

interface CourtCardProps {
  court: CourtListItem;
}

export function CourtCard({ court }: CourtCardProps) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-semibold">
        {court.name}
      </h2>

      <p className="mt-1 text-sm text-slate-400">
        {court.sport}
      </p>

      <p className="mt-4 text-slate-300">
        {court.description}
      </p>

      <div className="mt-6">
        <span className="text-2xl font-bold">
          S/ {court.pricePerHour.toFixed(2)}
        </span>

        <span className="ml-1 text-sm text-slate-400">
          / hora
        </span>
      </div>

      <Link
        href={`/canchas/${court.id}`}
        className="mt-6 inline-block rounded-lg bg-white px-4 py-2 font-medium text-slate-950"
      >
        Ver cancha
      </Link>
    </article>
  );
}