"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PayBookingButtonProps {
  bookingId: number;
}

export function PayBookingButton({
  bookingId,
}: PayBookingButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePayment() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/payments/checkout", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          bookingId,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        setError(
          data.message ?? "No se pudo iniciar el pago."
        );

        return;
      }

      window.location.href = data.checkoutUrl;
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={handlePayment}
        disabled={loading}
        className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-950 disabled:opacity-50"
      >
        {loading ? "Redirigiendo..." : "Pagar"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}