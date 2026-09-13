"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { CourtListItem } from "@/modules/courts/court.types";
import { getCourtImage } from "@/modules/courts/court-image";

interface CourtCardProps {
  court: CourtListItem;
  isAuthenticated: boolean;
}

export function CourtCard({
  court,
  isAuthenticated,
}: CourtCardProps) {
  const [showLoginAlert, setShowLoginAlert] =
    useState(false);

  const image = getCourtImage(court.sport);

  return (
    <>
      <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative h-52 overflow-hidden">
          <Image
            src={image}
            alt={court.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-800 backdrop-blur">
            {court.sport}
          </span>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-900">
            {court.name}
          </h2>

          <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
            {court.description ??
              "Cancha disponible para reservas."}
          </p>

          <div className="mt-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Precio por hora
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                S/ {court.pricePerHour.toFixed(2)}
              </p>
            </div>

            {isAuthenticated ? (
              <Link
                href={`/canchas/${court.id}`}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Ver cancha
              </Link>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setShowLoginAlert(true)
                }
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Ver cancha
              </button>
            )}
          </div>
        </div>
      </article>

      {showLoginAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl text-blue-600">
              !
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Inicia sesión para reservar
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Para consultar horarios y realizar una
              reserva necesitas iniciar sesión en tu
              cuenta.
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setShowLoginAlert(false)
                }
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>

              <Link
                href={`/login?returnTo=/canchas/${court.id}`}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}