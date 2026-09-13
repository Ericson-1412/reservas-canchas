"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface PaymentSuccessSyncProps {
  externalReference: string | null;
}

export function PaymentSuccessSync({
  externalReference,
}: PaymentSuccessSyncProps) {
  const router = useRouter();

  const [message, setMessage] =
    useState("Verificando pago...");

  const [error, setError] =
    useState(false);

  useEffect(() => {
    async function syncPayment() {
      if (!externalReference) {
        setError(true);
        setMessage(
          "No se pudo identificar la reserva."
        );
        return;
      }

      const match =
        externalReference.match(
          /^booking-(\d+)$/
        );

      if (!match) {
        setError(true);
        setMessage(
          "Referencia de reserva inválida."
        );
        return;
      }

      const bookingId = Number(match[1]);

      try {
        const response = await fetch(
          "/api/payments/sync",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              bookingId,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(true);

          setMessage(
            data.message ??
            "No se pudo verificar el pago."
          );

          return;
        }

        setMessage(
          "Pago confirmado correctamente."
        );

        router.refresh();
      } catch {
        setError(true);

        setMessage(
          "No se pudo verificar el pago."
        );
      }
    }

    syncPayment();
  }, [externalReference, router]);

  return (
    <div
      className={`mt-6 rounded-xl border px-4 py-3 text-sm font-medium ${error
          ? "border-red-200 bg-red-50 text-red-700"
          : message === "Pago confirmado correctamente."
            ? "border-green-200 bg-green-50 text-green-700"
            : "border-blue-200 bg-blue-50 text-blue-700"
        }`}
    >
      {message}
    </div>
  );
}