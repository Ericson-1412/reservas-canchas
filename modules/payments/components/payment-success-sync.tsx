"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function PaymentSuccessSync() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [message, setMessage] =
    useState("Verificando pago...");

  const [error, setError] =
    useState(false);

  useEffect(() => {
    async function syncPayment() {
      const externalReference =
        searchParams.get(
          "external_reference"
        );

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

      const bookingId =
        Number(match[1]);

      try {
        const response = await fetch(
          "/api/payments/sync",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              bookingId,
            }),
          }
        );

        const data =
          await response.json();

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
  }, [router, searchParams]);

  return (
    <p
      className={`mt-4 text-sm ${
        error
          ? "text-red-400"
          : "text-green-400"
      }`}
    >
      {message}
    </p>
  );
}