"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { AvailabilitySlot } from "@/modules/bookings/booking.types";

interface AvailabilitySelectorProps {
  courtId: number;
}

interface DateOption {
  value: string;
  dayName: string;
  dayNumber: string;
}

function formatDateValue(date: Date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function createDateOptions(): DateOption[] {
  const dates: DateOption[] = [];

  const today = new Date();

  for (let index = 0; index < 7; index++) {
    const date = new Date(today);

    date.setDate(
      today.getDate() + index
    );

    let dayName = date
      .toLocaleDateString("es-PE", {
        weekday: "short",
      })
      .replace(".", "")
      .toUpperCase();

    if (index === 0) {
      dayName = "HOY";
    }

    if (index === 1) {
      dayName = "MAÑANA";
    }

    dates.push({
      value: formatDateValue(date),

      dayName,

      dayNumber: date.toLocaleDateString(
        "es-PE",
        {
          day: "2-digit",
          month: "short",
        }
      ),
    });
  }

  return dates;
}

export function AvailabilitySelector({
  courtId,
}: AvailabilitySelectorProps) {
  const router = useRouter();

  const [dateOptions] =
    useState(createDateOptions);

  const [date, setDate] =
    useState("");

  const [slots, setSlots] =
    useState<AvailabilitySlot[]>([]);

  const [selectedHour, setSelectedHour] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [booking, setBooking] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  async function loadAvailability(
    selectedDate: string
  ) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/courts/${courtId}/availability?date=${selectedDate}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ??
            "No se pudo consultar la disponibilidad."
        );

        setSlots([]);

        return;
      }

      setSlots(data);
    } catch {
      setError(
        "No se pudo consultar la disponibilidad."
      );

      setSlots([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDateSelection(
    selectedDate: string
  ) {
    setDate(selectedDate);
    setSelectedHour(null);
    setSuccess("");
    setError("");

    await loadAvailability(
      selectedDate
    );
  }

  async function handleBooking() {
    if (
      !date ||
      selectedHour === null
    ) {
      return;
    }

    try {
      setBooking(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        "/api/bookings",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            courtId,
            bookingDate: date,
            startHour: selectedHour,
          }),
        }
      );

      const data =
        await response.json();

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        setError(
          data.message ??
            "No se pudo realizar la reserva."
        );

        return;
      }

      setSuccess(
        "Reserva creada correctamente. Tienes 15 minutos para realizar el pago."
      );

      setSelectedHour(null);

      await loadAvailability(date);
    } catch {
      setError(
        "No se pudo conectar con el servidor."
      );
    } finally {
      setBooking(false);
    }
  }

  return (
    <div className="mt-8">
      {/* FECHA */}
      <div>
        <h3 className="text-base font-semibold text-slate-900">
          Selecciona un día
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Elige la fecha en la que deseas jugar.
        </p>

        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {dateOptions.map((option) => {
            const selected =
              date === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  handleDateSelection(
                    option.value
                  )
                }
                className={`
                  min-w-24 rounded-xl border px-4 py-3
                  text-center transition
                  ${
                    selected
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                  }
                `}
              >
                <span className="block text-xs font-semibold">
                  {option.dayName}
                </span>

                <span className="mt-1 block text-sm">
                  {option.dayNumber}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* HORARIOS */}
      {loading && (
        <p className="mt-6 text-sm text-slate-500">
          Consultando horarios...
        </p>
      )}

      {!loading &&
        date &&
        slots.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold text-slate-900">
              Horarios disponibles
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Cada reserva tiene una duración de 1 hora.
            </p>

            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {slots.map((slot) => {
                const selected =
                  selectedHour ===
                  slot.startHour;

                return (
                  <button
                    key={slot.startHour}
                    type="button"
                    disabled={
                      !slot.available
                    }
                    onClick={() =>
                      setSelectedHour(
                        slot.startHour
                      )
                    }
                    className={`
                      rounded-xl border px-3 py-3
                      text-sm font-medium transition
                      ${
                        selected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : slot.available
                            ? "border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50"
                            : "cursor-not-allowed border-slate-100 bg-slate-100 text-slate-400"
                      }
                    `}
                  >
                    {slot.startHour}:00
                  </button>
                );
              })}
            </div>
          </div>
        )}

      {/* RESERVAR */}
      {selectedHour !== null && (
        <div className="mt-8 rounded-xl bg-blue-50 p-5">
          <p className="text-sm text-slate-500">
            Horario seleccionado
          </p>

          <p className="mt-1 text-lg font-bold text-slate-900">
            {selectedHour}:00 -{" "}
            {selectedHour + 1}:00
          </p>

          <button
            type="button"
            onClick={handleBooking}
            disabled={booking}
            className="mt-4 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {booking
              ? "Reservando..."
              : "Reservar horario"}
          </button>
        </div>
      )}

      {error && (
        <p className="mt-5 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      {success && (
        <p className="mt-5 text-sm font-medium text-green-600">
          {success}
        </p>
      )}
    </div>
  );
}