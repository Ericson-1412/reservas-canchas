"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { AvailabilitySlot } from "@/modules/bookings/booking.types";

interface AvailabilitySelectorProps {
  courtId: number;
}

export function AvailabilitySelector({
  courtId,
}: AvailabilitySelectorProps) {
  const router = useRouter();

  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadAvailability(selectedDate: string) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/courts/${courtId}/availability?date=${selectedDate}`
      );

      if (!response.ok) {
        throw new Error("No se pudo consultar la disponibilidad.");
      }

      const data: AvailabilitySlot[] = await response.json();

      setSlots(data);
    } catch {
      setError("No se pudo consultar la disponibilidad.");
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setSelectedHour(null);
    setSuccess("");

    if (!date) {
      setSlots([]);
      return;
    }

    loadAvailability(date);
  }, [courtId, date]);

  async function handleBooking() {
    if (!date || selectedHour === null) {
      return;
    }

    try {
      setBooking(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/bookings", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          courtId,
          bookingDate: date,
          startHour: selectedHour,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        setError(data.message ?? "No se pudo realizar la reserva.");
        return;
      }

      setSuccess("Reserva creada correctamente.");
      setSelectedHour(null);

      await loadAvailability(date);
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setBooking(false);
    }
  }

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
            Selecciona un horario
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {slots.map((slot) => {
              const selected = selectedHour === slot.startHour;

              return (
                <button
                  key={slot.startHour}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => setSelectedHour(slot.startHour)}
                  className={`
                    rounded-lg border px-4 py-3
                    ${
                      selected
                        ? "border-white bg-white text-slate-950"
                        : "border-slate-700"
                    }
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  `}
                >
                  {slot.startHour}:00 - {slot.endHour}:00
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedHour !== null && (
        <div className="mt-6">
          <p className="text-sm text-slate-300">
            Horario seleccionado:
          </p>

          <p className="mt-1 font-semibold">
            {selectedHour}:00 - {selectedHour + 1}:00
          </p>

          <button
            type="button"
            onClick={handleBooking}
            disabled={booking}
            className="mt-4 rounded-lg bg-white px-5 py-3 font-medium text-slate-950 disabled:opacity-50"
          >
            {booking ? "Reservando..." : "Reservar horario"}
          </button>
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-400">
          {error}
        </p>
      )}

      {success && (
        <p className="mt-4 text-sm text-green-400">
          {success}
        </p>
      )}
    </div>
  );
}