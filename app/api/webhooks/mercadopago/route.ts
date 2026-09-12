import { NextResponse } from "next/server";

import {
  InvalidWebhookSignatureError,
  WebhookSignatureValidator,
} from "mercadopago";

import { mercadoPagoConfig } from "@/lib/config/env";

import { paymentService } from "@/modules/payments/payment.service";

export async function POST(request: Request) {
  const url = new URL(request.url);

  const dataId =
    url.searchParams.get("data.id");

  const type =
    url.searchParams.get("type");

  const xSignature =
    request.headers.get("x-signature");

  const xRequestId =
    request.headers.get("x-request-id");

  if (
    !dataId ||
    !xSignature ||
    !xRequestId
  ) {
    return NextResponse.json(
      {
        message:
          "Notificación inválida.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    WebhookSignatureValidator.validate({
      xSignature,
      xRequestId,
      dataId,
      secret:
        mercadoPagoConfig.webhookSecret,
    });
  } catch (error) {
    if (
      error instanceof
      InvalidWebhookSignatureError
    ) {
      return NextResponse.json(
        {
          message:
            "Firma inválida.",
        },
        {
          status: 401,
        }
      );
    }

    throw error;
  }

  if (type !== "order") {
    return NextResponse.json({
      received: true,
    });
  }

  try {
    await paymentService.processOrderNotification(
      dataId
    );

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error(
      "Error procesando webhook Mercado Pago:",
      error
    );

    return NextResponse.json(
      {
        message:
          "No se pudo procesar la notificación.",
      },
      {
        status: 500,
      }
    );
  }
}