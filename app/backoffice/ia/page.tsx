import { AiQueryForm } from "@/modules/ai/components/ai-query-form";

export default function AiAdminPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Asistente de reservas
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Pregunta en lenguaje natural sobre reservas,
          canchas, pagos y clientes. El asistente
          únicamente consulta información; no modifica datos.
        </p>
      </div>

      <AiQueryForm />
    </div>
  );
}