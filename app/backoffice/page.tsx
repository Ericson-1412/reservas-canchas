import Link from "next/link";

export default function BackofficePage() {
  return (
    <div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Panel administrativo
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Bienvenido al backoffice
        </h1>

        <p className="mt-2 text-slate-500">
          Gestiona las reservas y canchas disponibles del sistema.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">

        {/* RESERVAS */}
        <Link
          href="/backoffice/reservas"
          className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
            📅
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Reservas
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Consulta las reservas realizadas por los clientes,
            estados y pagos asociados.
          </p>

          <p className="mt-5 text-sm font-semibold text-blue-600">
            Gestionar reservas →
          </p>
        </Link>

        {/* CANCHAS */}
        <Link
          href="/backoffice/canchas"
          className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-xl text-green-600">
            ⚽
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Canchas
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Crea, modifica, activa o desactiva las canchas
            disponibles para los clientes.
          </p>

          <p className="mt-5 text-sm font-semibold text-blue-600">
            Gestionar canchas →
          </p>
        </Link>
      </div>
    </div>
  );
}