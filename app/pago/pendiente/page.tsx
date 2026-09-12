import Link from "next/link";

export default function PaymentPendingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
        <h1 className="text-2xl font-bold">
          Pago pendiente
        </h1>

        <p className="mt-3 text-slate-400">
          Tu pago todavía está pendiente de confirmación.
        </p>

        <Link
          href="/mis-reservas"
          className="mt-6 inline-block rounded-lg border border-slate-700 px-5 py-3"
        >
          Ver mis reservas
        </Link>
      </div>
    </main>
  );
}