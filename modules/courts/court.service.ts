import {
  courtRepository,
  type CourtListRecord,
} from "@/modules/courts/court.repository";

import type { CourtListItem } from "@/modules/courts/court.types";

function toCourtListItem(record: CourtListRecord): CourtListItem {
  return {
    id: record.id,
    name: record.name,
    sport: record.sport,
    description: record.description,
    pricePerHour: Number(record.pricePerHour),
    active: record.active,
  };
}

export const courtService = {
  async listCourts(): Promise<CourtListItem[]> {
    const courts = await courtRepository.findAll();

    return courts.map(toCourtListItem);
  },

  async getCourtById(id: number): Promise<CourtListItem | null> {
    const court = await courtRepository.findById(id);

    if (!court) {
      return null;
    }

    return toCourtListItem(court);
  },
};