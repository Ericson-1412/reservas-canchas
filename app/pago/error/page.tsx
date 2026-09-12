import Link from "next/link";

export default function PaymentErrorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
        <h1 className="text-2xl font-bold">
          Pago no completado
        </h1>

        <p className="mt-3 text-slate-400">
          El pago no pudo completarse.
          Puedes volver a intentarlo desde tus reservas.
        </p>

        <Link
          href="/mis-reservas"
          className="mt-6 inline-block rounded-lg bg-white px-5 py-3 font-medium text-slate-950"
        >
          Volver a mis reservas
        </Link>
      </div>
    </main>
  );
}