"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { BookingStatus } from "@/lib/generated/prisma/enums";

interface AdminBookingActionsProps {
    bookingId: number;
    status: BookingStatus;
}

export function AdminBookingActions({
    bookingId,
    status,
}: AdminBookingActionsProps) {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function updateStatus(
        newStatus: BookingStatus
    ) {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `/api/bookings/${bookingId}/status`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        status: newStatus,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ??
                    "No se pudo actualizar la reserva."
                );

                return;
            }

            router.refresh();
        } catch {
            setError("No se pudo conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    }

    if (status === BookingStatus.CONFIRMED) {
        return (
            <span className="text-sm text-green-400">
                Pago confirmado
            </span>
        );
    }

    if (status === BookingStatus.CANCELED) {
        return (
            <span className="text-sm text-slate-500">
                Sin acciones
            </span>
        );
    }

    return (
        <div>
            <button
                type="button"
                disabled={loading}
                onClick={() =>
                    updateStatus(BookingStatus.CANCELED)
                }
                className="rounded-lg border border-slate-700 px-3 py-2 text-sm disabled:opacity-50"
            >
                {loading ? "Cancelando..." : "Cancelar"}
            </button>

            {error && (
                <p className="mt-2 text-xs text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}