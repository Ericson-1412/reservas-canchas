"use client";

import type { FormEvent } from "react";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface CourtFormProps {
  courtId?: number;

  initialValues?: {
    name: string;
    sport: string;
    description: string;
    pricePerHour: number;
    active: boolean;
  };
}

export function CourtForm({
  courtId,
  initialValues,
}: CourtFormProps) {
  const router = useRouter();

  const editing = courtId !== undefined;

  const [name, setName] =
    useState(initialValues?.name ?? "");

  const [sport, setSport] =
    useState(initialValues?.sport ?? "FÚTBOL 5");

  const [description, setDescription] =
    useState(initialValues?.description ?? "");

  const [pricePerHour, setPricePerHour] =
    useState(
      initialValues?.pricePerHour.toString() ?? ""
    );

  const [active, setActive] =
    useState(initialValues?.active ?? true);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        editing
          ? `/api/courts/${courtId}`
          : "/api/courts",
        {
          method: editing
            ? "PATCH"
            : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            sport,
            description,
            pricePerHour: Number(pricePerHour),
            active,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ??
            "No se pudo guardar la cancha."
        );

        return;
      }

      router.push("/backoffice/canchas");
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
      className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
    >
      <div className="mb-7">
        <h2 className="text-xl font-bold text-slate-900">
          {editing
            ? "Información de la cancha"
            : "Registrar cancha"}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Completa la información que se mostrará
          a los clientes.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-slate-700"
          >
            Nombre
          </label>

          <input
            id="name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Ej. Cancha Fútbol 5 - C"
            required
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="sport"
            className="text-sm font-medium text-slate-700"
          >
            Deporte
          </label>

          <select
            id="sport"
            value={sport}
            onChange={(event) =>
              setSport(event.target.value)
            }
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="FÚTBOL 5">
              Fútbol 5
            </option>

            <option value="FÚTBOL 7">
              Fútbol 7
            </option>

            <option value="VÓLEY">
              Vóley
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="price"
            className="text-sm font-medium text-slate-700"
          >
            Precio por hora
          </label>

          <div className="relative mt-2">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-slate-500">
              S/
            </span>

            <input
              id="price"
              type="number"
              min="0.01"
              step="0.01"
              value={pricePerHour}
              onChange={(event) =>
                setPricePerHour(event.target.value)
              }
              placeholder="80.00"
              required
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-slate-700"
          >
            Descripción
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Describe brevemente las características de la cancha."
            rows={4}
            className="mt-2 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {editing && (
          <div className="sm:col-span-2">
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div>
                <p className="font-medium text-slate-800">
                  Cancha activa
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Las canchas inactivas no aparecen
                  para los clientes.
                </p>
              </div>

              <input
                type="checkbox"
                checked={active}
                onChange={(event) =>
                  setActive(event.target.checked)
                }
                className="h-5 w-5"
              />
            </label>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mt-7 flex justify-end gap-3 border-t border-slate-100 pt-6">
        <button
          type="button"
          onClick={() =>
            router.push("/backoffice/canchas")
          }
          className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Guardando..."
            : editing
              ? "Guardar cambios"
              : "Crear cancha"}
        </button>
      </div>
    </form>
  );
}