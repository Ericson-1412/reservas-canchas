import Link from "next/link";

export default function BackofficePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">
        Backoffice
      </h1>

      <p className="mt-2 text-slate-400">
        Administración del sistema de reservas.
      </p>

      <div className="mt-8">
        <Link
          href="/backoffice/reservas"
          className="inline-block rounded-lg border border-slate-700 bg-slate-900 px-6 py-4 hover:bg-slate-800"
        >
          Gestionar reservas
        </Link>
      </div>
    </div>
  );
}