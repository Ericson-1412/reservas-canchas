import { NextResponse } from "next/server";

import { courtService } from "@/modules/courts/court.service";

export async function GET() {
  try {
    const courts = await courtService.listCourts();

    return NextResponse.json(courts);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "No se pudo obtener el listado de canchas.",
      },
      {
        status: 500,
      }
    );
  }
}