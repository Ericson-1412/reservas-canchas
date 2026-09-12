import bcrypt from "bcryptjs";

import { authRepository } from "@/modules/auth/auth.repository";

import {
    createAccessToken,
    createRefreshToken,
} from "@/modules/auth/auth.tokens";

import type {
    AuthUser,
    LoginInput,
} from "@/modules/auth/auth.types";

export const authService = {
    async login(input: LoginInput) {
        const email = input.email.trim().toLowerCase();

        const user = await authRepository.findByEmail(email);

        if (!user) {
            return null;
        }

        const passwordIsValid = await bcrypt.compare(
            input.password,
            user.passwordHash
        );

        if (!passwordIsValid) {
            return null;
        }

        const authUser: AuthUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        const [accessToken, refreshToken] = await Promise.all([
            createAccessToken(authUser),
            createRefreshToken(authUser),
        ]);

        return {
            user: authUser,
            accessToken,
            refreshToken,
        };
    },

    async getUserById(id: number): Promise<AuthUser | null> {
        const user = await authRepository.findById(id);

        if (!user) {
            return null;
        }

        return user;
    },
};