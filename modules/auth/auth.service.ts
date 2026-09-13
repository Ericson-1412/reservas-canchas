import bcrypt from "bcryptjs";

import { authRepository } from "@/modules/auth/auth.repository";

import {
    createAccessToken,
    createRefreshToken,
} from "@/modules/auth/auth.tokens";

import type {
    AuthUser,
    LoginInput,
    RegisterInput,
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

    async register(
        input: RegisterInput
    ): Promise<AuthUser> {
        const name = input.name.trim();
        const email = input.email.trim().toLowerCase();
        const password = input.password;

        if (name.length < 2) {
            throw new Error("INVALID_NAME");
        }

        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
            throw new Error("INVALID_EMAIL");
        }

        if (password.length < 8) {
            throw new Error("INVALID_PASSWORD");
        }

        const existingUser =
            await authRepository.findByEmail(email);

        if (existingUser) {
            throw new Error("EMAIL_ALREADY_EXISTS");
        }

        const passwordHash =
            await bcrypt.hash(password, 12);

        return authRepository.createUser({
            name,
            email,
            passwordHash,
        });
    },
};