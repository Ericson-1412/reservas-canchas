import { prisma } from "@/lib/db/prisma";

export const authRepository = {
    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: {
                email,
            },

            select: {
                id: true,
                name: true,
                email: true,
                passwordHash: true,
                role: true,
            },
        });
    },

    async findById(id: number) {
        return prisma.user.findUnique({
            where: {
                id,
            },

            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });
    },
};