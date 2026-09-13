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

    async createUser(data: {
        name: string;
        email: string;
        passwordHash: string;
    }) {
        return prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash: data.passwordHash,
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