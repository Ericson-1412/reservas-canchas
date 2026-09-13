import { prisma } from "@/lib/db/prisma";

import type { Prisma } from "@/lib/generated/prisma/client";

const courtListSelect = {
  id: true,
  name: true,
  sport: true,
  description: true,
  pricePerHour: true,
  active: true,
} satisfies Prisma.CourtSelect;

export type CourtListRecord = Prisma.CourtGetPayload<{
  select: typeof courtListSelect;
}>;

export const courtRepository = {
  async findAll(): Promise<CourtListRecord[]> {
    return prisma.court.findMany({
      select: courtListSelect,

      where: {
        active: true,
      },

      orderBy: {
        name: "asc",
      },
    });
  },

  async findAllForAdmin(): Promise<CourtListRecord[]> {
    return prisma.court.findMany({
      select: courtListSelect,

      orderBy: {
        name: "asc",
      },
    });
  },

  async findById(id: number): Promise<CourtListRecord | null> {
    return prisma.court.findFirst({
      where: {
        id,
        active: true,
      },

      select: courtListSelect,
    });
  },

  async findByIdForAdmin(
    id: number
  ): Promise<CourtListRecord | null> {
    return prisma.court.findUnique({
      where: {
        id,
      },

      select: courtListSelect,
    });
  },

  async create(data: {
    name: string;
    sport: string;
    description: string | null;
    pricePerHour: number;
  }) {
    return prisma.court.create({
      data: {
        ...data,
        active: true,
      },

      select: courtListSelect,
    });
  },

  async update(
    id: number,
    data: {
      name: string;
      sport: string;
      description: string | null;
      pricePerHour: number;
      active: boolean;
    }
  ) {
    return prisma.court.update({
      where: {
        id,
      },

      data,

      select: courtListSelect,
    });
  },
};