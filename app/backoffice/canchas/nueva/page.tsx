import Link from "next/link";

import { CourtForm } from "@/modules/courts/components/court-form";

export default function NewCourtPage() {
  return (
    <div>

      <h1 className="mt-4 text-3xl font-bold">
        Nueva cancha
      </h1>

      <div className="mt-8">
        <CourtForm />
      </div>
    </div>
  );
}