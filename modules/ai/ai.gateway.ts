import "server-only";

import { GoogleGenAI } from "@google/genai";

import type { AiQueryResult } from "@/modules/ai/ai.types";

function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined");
  }

  return new GoogleGenAI({
    apiKey,
  });
}

function getModel() {
  return (
    process.env.GEMINI_MODEL ??
    "gemini-3.6-flash"
  );
}

const responseSchema = {
  type: "object",
  properties: {
    sql: {
      type: "string",
    },

    explanation: {
      type: "string",
    },
  },

  required: [
    "sql",
    "explanation",
  ],
};

export async function generateSqlWithAi(
  question: string
): Promise<AiQueryResult> {
  const ai = getAiClient();

  const currentDate =
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Lima",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

  const systemInstruction = `
Eres un asistente especializado en PostgreSQL.

Trabajas para un sistema de reserva de canchas deportivas.

Tu única función es convertir preguntas administrativas
en consultas SQL PostgreSQL de SOLO LECTURA.

REGLAS OBLIGATORIAS:

- Solo puedes generar SELECT.
- También puedes utilizar WITH únicamente para consultas de lectura.
- Nunca generes INSERT.
- Nunca generes UPDATE.
- Nunca generes DELETE.
- Nunca generes DROP.
- Nunca generes ALTER.
- Nunca generes TRUNCATE.
- Nunca consultes passwordHash.
- No utilices information_schema.
- No utilices pg_catalog.
- No generes más de una sentencia SQL.
- No inventes tablas ni columnas.
- Utiliza comillas dobles para nombres sensibles a mayúsculas.
- Para consultas de detalle utiliza un máximo razonable de registros.
- No agregues bloques Markdown alrededor del SQL.

Fecha actual en Perú:
${currentDate}

ESQUEMA DISPONIBLE:

User
- id
- name
- email
- role
- createdAt
- updatedAt

Court
- id
- name
- sport
- description
- pricePerHour
- active
- createdAt
- updatedAt

Booking
- id
- userId
- courtId
- bookingDate
- startHour
- status
- totalPrice
- expiresAt
- createdAt
- updatedAt

Payment
- id
- bookingId
- mercadoPagoOrderId
- mercadoPagoPaymentId
- status
- amount
- createdAt
- updatedAt

RELACIONES:

Booking.userId -> User.id
Booking.courtId -> Court.id
Payment.bookingId -> Booking.id

ESTADOS DE RESERVA:
PENDING
CONFIRMED
CANCELED

ESTADOS DE PAGO:
PENDING
APPROVED
REJECTED

La explicación debe ser breve y estar escrita en español.
`;

  const interaction =
    await ai.interactions.create({
      model: getModel(),

      system_instruction: systemInstruction,

      input: question,

      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: responseSchema,
      },
    });

  // OJO: output_text
  if (!interaction.output_text) {
    throw new Error("AI_EMPTY_RESPONSE");
  }

  const parsed = JSON.parse(
    interaction.output_text
  ) as Partial<AiQueryResult>;

  if (
    typeof parsed.sql !== "string" ||
    typeof parsed.explanation !== "string"
  ) {
    throw new Error("AI_INVALID_RESPONSE");
  }

  return {
    sql: parsed.sql.trim(),
    explanation:
      parsed.explanation.trim(),
  };
}

export async function generateAnswerWithAi(
  question: string,
  results: Record<string, unknown>[]
): Promise<string> {
  const ai = getAiClient();

  const interaction =
    await ai.interactions.create({
      model: getModel(),

      system_instruction: `
Eres un asistente administrativo de un sistema
de reservas de canchas deportivas.

Debes responder en español, de forma clara,
breve y profesional.

La respuesta debe basarse EXCLUSIVAMENTE en
los resultados proporcionados.

No inventes datos.
Si no existen resultados, indícalo claramente.
`,

      input: `
Pregunta del administrador:
${question}

Resultados obtenidos desde PostgreSQL:
${JSON.stringify(results)}
`,
    });

  if (!interaction.output_text) {
    throw new Error("AI_EMPTY_ANSWER");
  }

  return interaction.output_text.trim();
}