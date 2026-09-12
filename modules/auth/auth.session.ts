import { cookies } from "next/headers";

import { ACCESS_TOKEN_COOKIE } from "@/modules/auth/auth.config";
import { authService } from "@/modules/auth/auth.service";
import { verifyAccessToken } from "@/modules/auth/auth.tokens";

import type { AuthUser } from "@/modules/auth/auth.types";

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();

  const accessToken =
    cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return null;
  }

  const userId = await verifyAccessToken(accessToken);

  if (!userId) {
    return null;
  }

  return authService.getUserById(userId);
}