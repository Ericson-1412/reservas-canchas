import { randomUUID } from "crypto";

import { mercadoPagoConfig } from "@/lib/config/env";

interface CreateOrderInput {
    bookingId: number;
    email: string;
    courtName: string;
    amount: number;
}

interface MercadoPagoOrderResponse {
    id: string;
    status: string;
    checkout_url: string;
}

export interface MercadoPagoOrder {
    id: string;
    status: string;
    status_detail: string;
    external_reference?: string;
    total_amount?: string;

    transactions?: {
        payments?: Array<{
            id: string;
            status: string;
            status_detail: string;
        }>;
    };
}

export async function createMercadoPagoOrder(
    input: CreateOrderInput
): Promise<MercadoPagoOrderResponse> {
    const amount = input.amount.toFixed(2);

    const response = await fetch(
        "https://api.mercadopago.com/v1/orders",
        {
            method: "POST",

            headers: {
                Authorization: `Bearer ${mercadoPagoConfig.accessToken}`,
                "Content-Type": "application/json",
                "X-Idempotency-Key": randomUUID(),
            },

            body: JSON.stringify({
                type: "online",
                processing_mode: "manual",

                total_amount: amount,

                external_reference:
                    `booking-${input.bookingId}`,

                payer: {
                    email:
                        process.env.NODE_ENV === "production"
                            ? input.email
                            : mercadoPagoConfig.testPayerEmail,
                },

                items: [
                    {
                        title: `Reserva - ${input.courtName}`,
                        quantity: 1,
                        unit_price: amount,
                    },
                ],

                config: {
                    online: {
                        success_url:
                            `${mercadoPagoConfig.appUrl}/pago/exito`,

                        failure_url:
                            `${mercadoPagoConfig.appUrl}/pago/error`,

                        pending_url:
                            `${mercadoPagoConfig.appUrl}/pago/pendiente`,

                        auto_return: "all",
                    },
                },
            }),
        }
    );

    if (!response.ok) {
        const error = await response.text();

        console.error(
            "Mercado Pago error:",
            error
        );

        throw new Error("MERCADO_PAGO_ERROR");
    }

    return response.json();
}

export async function getMercadoPagoOrder(
    orderId: string
): Promise<MercadoPagoOrder> {
    const response = await fetch(
        `https://api.mercadopago.com/v1/orders/${orderId}`,
        {
            method: "GET",

            headers: {
                Authorization:
                    `Bearer ${mercadoPagoConfig.accessToken}`,
            },
        }
    );

    if (!response.ok) {
        const error = await response.text();

        console.error(
            "Error consultando orden Mercado Pago:",
            error
        );

        throw new Error("MERCADO_PAGO_ORDER_ERROR");
    }

    return response.json();
}