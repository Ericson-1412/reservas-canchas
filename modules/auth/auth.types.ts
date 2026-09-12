import type { UserRole } from "@/lib/generated/prisma/client";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}