import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_COOKIE,
} from "@/modules/auth/auth.config";

import { authService } from "@/modules/auth/auth.service";

import {
  createAccessToken,
  verifyRefreshToken,
} from "@/modules/auth/auth.tokens";

export async function POST() {
  const cookieStore = await cookies();

  const refreshToken =
    cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) {
    return NextResponse.json(
      {
        message: "Refresh token no encontrado.",
      },
      {
        status: 401,
      }
    );
  }

  const userId =
    await verifyRefreshToken(refreshToken);

  if (!userId) {
    const response = NextResponse.json(
      {
        message: "Sesión expirada.",
      },
      {
        status: 401,
      }
    );

    response.cookies.delete(ACCESS_TOKEN_COOKIE);
    response.cookies.delete(REFRESH_TOKEN_COOKIE);

    return response;
  }

  const user =
    await authService.getUserById(userId);

  if (!user) {
    const response = NextResponse.json(
      {
        message: "Usuario no encontrado.",
      },
      {
        status: 401,
      }
    );

    response.cookies.delete(ACCESS_TOKEN_COOKIE);
    response.cookies.delete(REFRESH_TOKEN_COOKIE);

    return response;
  }

  const newAccessToken =
    await createAccessToken(user);

  const response = NextResponse.json({
    message: "Sesión renovada correctamente.",
    user,
  });

  response.cookies.set(
    ACCESS_TOKEN_COOKIE,
    newAccessToken,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ACCESS_TOKEN_TTL,
    }
  );

  return response;
}