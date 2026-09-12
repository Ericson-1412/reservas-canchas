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

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
        setError(data.message ?? "No se pudo iniciar sesión.");
        return;
      }

      if (data.user.role === "ADMIN") {
        router.replace("/backoffice");
      } else {
        router.replace("/canchas");
      }

      router.refresh();
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-8"
    >
      <h1 className="text-2xl font-bold text-white">
        Iniciar sesión
      </h1>

      <p className="mt-2 text-sm text-slate-400">
        Ingresa tus credenciales para continuar.
      </p>

      <div className="mt-6">
        <label
          htmlFor="email"
          className="text-sm text-slate-300"
        >
          Correo electrónico
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="password"
          className="text-sm text-slate-300"
        >
          Contraseña
        </label>

        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
        />
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-lg bg-white px-4 py-3 font-medium text-slate-950 disabled:opacity-50"
      >
        {loading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}