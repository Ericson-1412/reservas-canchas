import { CourtCard } from "@/modules/courts/components/court-card";
import { courtService } from "@/modules/courts/court.service";

export default async function CourtsPage() {
  const courts = await courtService.listCourts();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Canchas disponibles
          </h1>

          <p className="mt-2 text-slate-400">
            Selecciona una cancha para realizar una reserva.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courts.map((court) => (
            <CourtCard
              key={court.id}
              court={court}
            />
          ))}
        </div>
      </div>
    </main>
  );
}