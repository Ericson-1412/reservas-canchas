import {
  courtRepository,
  type CourtListRecord,
} from "@/modules/courts/court.repository";

import type {
  CourtListItem,
  CreateCourtInput,
  UpdateCourtInput,
} from "@/modules/courts/court.types";

function toCourtListItem(
  record: CourtListRecord
): CourtListItem {
  return {
    id: record.id,
    name: record.name,
    sport: record.sport,
    description: record.description,
    pricePerHour: Number(record.pricePerHour),
    active: record.active,
  };
}

function validateCourt(
  name: string,
  sport: string,
  pricePerHour: number
) {
  if (!name.trim()) {
    throw new Error("INVALID_NAME");
  }

  if (!sport.trim()) {
    throw new Error("INVALID_SPORT");
  }

  if (
    !Number.isFinite(pricePerHour) ||
    pricePerHour <= 0
  ) {
    throw new Error("INVALID_PRICE");
  }
}

export const courtService = {
  async listCourts(): Promise<CourtListItem[]> {
    const courts =
      await courtRepository.findAll();

    return courts.map(toCourtListItem);
  },

  async listAllCourts(): Promise<CourtListItem[]> {
    const courts =
      await courtRepository.findAllForAdmin();

    return courts.map(toCourtListItem);
  },

  async getCourtById(
    id: number
  ): Promise<CourtListItem | null> {
    const court =
      await courtRepository.findById(id);

    return court
      ? toCourtListItem(court)
      : null;
  },

  async getCourtByIdForAdmin(
    id: number
  ): Promise<CourtListItem | null> {
    const court =
      await courtRepository.findByIdForAdmin(id);

    return court
      ? toCourtListItem(court)
      : null;
  },

  async createCourt(
    input: CreateCourtInput
  ): Promise<CourtListItem> {
    validateCourt(
      input.name,
      input.sport,
      input.pricePerHour
    );

    const court =
      await courtRepository.create({
        name: input.name.trim(),
        sport: input.sport.trim(),
        description:
          input.description?.trim() || null,
        pricePerHour: input.pricePerHour,
      });

    return toCourtListItem(court);
  },

  async updateCourt(
    id: number,
    input: UpdateCourtInput
  ): Promise<CourtListItem> {
    const current =
      await courtRepository.findByIdForAdmin(id);

    if (!current) {
      throw new Error("COURT_NOT_FOUND");
    }

    validateCourt(
      input.name,
      input.sport,
      input.pricePerHour
    );

    const court =
      await courtRepository.update(id, {
        name: input.name.trim(),
        sport: input.sport.trim(),
        description:
          input.description?.trim() || null,
        pricePerHour: input.pricePerHour,
        active: input.active,
      });

    return toCourtListItem(court);
  },
};