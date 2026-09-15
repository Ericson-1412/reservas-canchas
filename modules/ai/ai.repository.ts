import { prisma } from "@/lib/db/prisma";

export const aiRepository = {
  async executeReadOnlyQuery(
    sql: string
  ): Promise<unknown[]> {
    return prisma.$queryRawUnsafe<unknown[]>(
      sql
    );
  },
};