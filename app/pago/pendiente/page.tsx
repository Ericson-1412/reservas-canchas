import Link from "next/link";

export default function PaymentPendingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl font-bold text-amber-600">
          !
        </div>

        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Pago pendiente
        </h1>

        <p className="mt-3 text-slate-500">
          Mercado Pago todavía está procesando la operación.
          Puedes consultar nuevamente el estado desde tus reservas.
        </p>

        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Tu reserva todavía no ha sido confirmada.
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/canchas"
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Ver canchas
          </Link>

          <Link
            href="/mis-reservas"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Mis reservas
          </Link>
        </div>
      </div>
    </main>
  );
}