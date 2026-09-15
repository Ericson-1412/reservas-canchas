"use client";

import type { FormEvent } from "react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

interface AiResponse {
  answer?: string;
  message?: string;
}

interface ChatMessage {
  id: number;
  role: "USER" | "ASSISTANT";
  content: string;
}

export function AiQueryForm() {
  const [question, setQuestion] =
    useState("");

  const [messages, setMessages] =
    useState<ChatMessage[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const messageId = useRef(0);

  const bottomRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  function createMessage(
    role: ChatMessage["role"],
    content: string
  ): ChatMessage {
    messageId.current += 1;

    return {
      id: messageId.current,
      role,
      content,
    };
  }

  function selectExample(
    example: string
  ) {
    setQuestion(example);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const currentQuestion =
      question.trim();

    if (
      !currentQuestion ||
      loading
    ) {
      return;
    }

    const userMessage =
      createMessage(
        "USER",
        currentQuestion
      );

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setQuestion("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/admin/ai-query",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            question:
              currentQuestion,
          }),
        }
      );

      const data: AiResponse =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ??
            "No se pudo procesar la consulta."
        );

        return;
      }

      const assistantMessage =
        createMessage(
          "ASSISTANT",
          data.answer ??
            "No se pudo generar una respuesta."
        );

      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);
    } catch {
      setError(
        "No se pudo conectar con el servidor."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* CONVERSACIÓN */}
      <div className="h-[480px] overflow-y-auto p-6">

        {/* SIN MENSAJES */}
        {messages.length === 0 && (
          <div className="flex h-full flex-col justify-end">
            <p className="mb-3 text-sm text-slate-500">
              Prueba con alguna de estas consultas:
            </p>

            <div className="flex flex-col items-start gap-2">
              <button
                type="button"
                onClick={() =>
                  selectExample(
                    "¿Cuál es la cancha con más reservas?"
                  )
                }
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-100"
              >
                ¿Cuál es la cancha con más reservas?
              </button>

              <button
                type="button"
                onClick={() =>
                  selectExample(
                    "¿Cuántas reservas confirmadas existen?"
                  )
                }
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-100"
              >
                ¿Cuántas reservas confirmadas existen?
              </button>

              <button
                type="button"
                onClick={() =>
                  selectExample(
                    "¿Cuánto dinero se ha recaudado por cancha?"
                  )
                }
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-100"
              >
                ¿Cuánto dinero se ha recaudado por cancha?
              </button>
            </div>
          </div>
        )}

        {/* HISTORIAL */}
        <div className="space-y-5">
          {messages.map((message) => {
            if (
              message.role === "USER"
            ) {
              return (
                <div
                  key={message.id}
                  className="flex justify-end"
                >
                  <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-slate-900 px-5 py-3 text-sm leading-6 text-white">
                    {message.content}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={message.id}
                className="flex justify-start"
              >
                <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-slate-100 px-5 py-4 text-sm leading-6 text-slate-700">
                  {message.content}
                </div>
              </div>
            );
          })}

          {/* CARGANDO */}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-5 py-3">
                <p className="text-sm text-slate-500">
                  Calculando estadísticas...
                </p>
              </div>
            </div>
          )}

          {/* ERROR */}
          {error && !loading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-600">
                {error}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* INPUT */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-3 border-t border-slate-200 p-4"
      >
        <input
          type="text"
          value={question}
          onChange={(event) =>
            setQuestion(
              event.target.value
            )
          }
          placeholder="Escribe una pregunta..."
          disabled={loading}
          className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
        />

        <button
          type="submit"
          disabled={
            loading ||
            !question.trim()
          }
          className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Preguntar
        </button>
      </form>
    </div>
  );
}