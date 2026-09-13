import Link from "next/link";
import { notFound } from "next/navigation";

import { CourtForm } from "@/modules/courts/components/court-form";
import { courtService } from "@/modules/courts/court.service";

interface EditCourtPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCourtPage({
  params,
}: EditCourtPageProps) {
  const { id } = await params;

  const courtId = Number(id);

  if (
    !Number.isInteger(courtId) ||
    courtId <= 0
  ) {
    notFound();
  }

  const court =
    await courtService.getCourtByIdForAdmin(
      courtId
    );

  if (!court) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/backoffice/canchas"
        className="text-sm text-slate-400 hover:text-white"
      >
        ← Volver a canchas
      </Link>

      <h1 className="mt-4 text-3xl font-bold">
        Editar cancha
      </h1>

      <div className="mt-8">
        <CourtForm
          courtId={court.id}
          initialValues={{
            name: court.name,
            sport: court.sport,
            description:
              court.description ?? "",
            pricePerHour:
              court.pricePerHour,
            active: court.active,
          }}
        />
      </div>
    </div>
  );
}