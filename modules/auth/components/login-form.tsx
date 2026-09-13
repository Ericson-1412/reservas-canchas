"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

interface LoginResponse {
  user?: {
    id: number;
    name: string;
    email: string;
    role: "ADMIN" | "USER";
  };
  message?: string;
}

interface LoginFormProps {
  returnTo?: string;
}

export function LoginForm({
  returnTo,
}: LoginFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok || !data.user) {
        setError(
          data.message ?? "No se pudo iniciar sesión."
        );
        return;
      }

      if (returnTo) {
        router.replace(returnTo);
      } else if (data.user.role === "ADMIN") {
        router.replace("/backoffice");
      } else {
        router.replace("/canchas");
      }

      router.refresh();
    } catch {
      setError(
        "No se pudo conectar con el servidor."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
    >
      <div>
        <label
          htmlFor="email"
          className="text-sm font-medium text-slate-700"
        >
          Correo electrónico
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          required
          placeholder="correo@ejemplo.com"
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="mt-5">
        <label
          htmlFor="password"
          className="text-sm font-medium text-slate-700"
        >
          Contraseña
        </label>

        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          required
          placeholder="Ingresa tu contraseña"
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Ingresando..."
          : "Iniciar sesión"}
      </button>
    </form>
  );
}