import { NextResponse } from "next/server";

import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_TTL,
} from "@/modules/auth/auth.config";

import { authService } from "@/modules/auth/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!email || !password) {
      return NextResponse.json(
        {
          message: "Correo y contraseña son obligatorios.",
        },
        {
          status: 400,
        }
      );
    }

    const result = await authService.login({
      email,
      password,
    });

    if (!result) {
      return NextResponse.json(
        {
          message: "Credenciales incorrectas.",
        },
        {
          status: 401,
        }
      );
    }

    const response = NextResponse.json({
      user: result.user,
    });

    response.cookies.set(
      ACCESS_TOKEN_COOKIE,
      result.accessToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: ACCESS_TOKEN_TTL,
      }
    );

    response.cookies.set(
      REFRESH_TOKEN_COOKIE,
      result.refreshToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: REFRESH_TOKEN_TTL,
      }
    );

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "No se pudo iniciar sesión.",
      },
      {
        status: 500,
      }
    );
  }
}