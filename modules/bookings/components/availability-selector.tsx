"use client";

import { useEffect, useState } from "react";

import type { AvailabilitySlot } from "@/modules/bookings/booking.types";

interface AvailabilitySelectorProps {
  courtId: number;
}

export function AvailabilitySelector({
  courtId,
}: AvailabilitySelectorProps) {
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!date) {
      setSlots([]);
      return;
    }

    async function loadAvailability() {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/courts/${courtId}/availability?date=${date}`
        );

        if (!response.ok) {
          throw new Error("No se pudo consultar la disponibilidad");
        }

        const data: AvailabilitySlot[] = await response.json();

        setSlots(data);
      } catch (error) {
        console.error(error);
        setSlots([]);
      } finally {
        setLoading(false);
      }
    }

    loadAvailability();
  }, [courtId, date]);

  return (
    <div className="mt-8">
      <label
        htmlFor="booking-date"
        className="block text-sm font-medium text-slate-300"
      >
        Selecciona una fecha
      </label>

      <input
        id="booking-date"
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        className="mt-2 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white"
      />

      {loading && (
        <p className="mt-4 text-sm text-slate-400">
          Consultando horarios...
        </p>
      )}

      {!loading && slots.length > 0 && (
        <div className="mt-6">
          <p className="mb-3 font-medium">
            Horarios disponibles
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {slots.map((slot) => (
              <button
                key={slot.startHour}
                type="button"
                disabled={!slot.available}
                className="rounded-lg border border-slate-700 px-4 py-3 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {slot.startHour}:00 - {slot.endHour}:00
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}