import { NextResponse } from "next/server";

import { authService } from "@/modules/auth/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const user = await authService.register({
      name:
        typeof body.name === "string"
          ? body.name
          : "",

      email:
        typeof body.email === "string"
          ? body.email
          : "",

      password:
        typeof body.password === "string"
          ? body.password
          : "",
    });

    return NextResponse.json(
      {
        message: "Usuario registrado correctamente.",
        user,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === "INVALID_NAME" ||
        error.message === "INVALID_EMAIL" ||
        error.message === "INVALID_PASSWORD"
      ) {
        return NextResponse.json(
          {
            message:
              "Los datos ingresados no son válidos.",
          },
          {
            status: 400,
          }
        );
      }

      if (
        error.message === "EMAIL_ALREADY_EXISTS"
      ) {
        return NextResponse.json(
          {
            message:
              "Ya existe una cuenta con ese correo.",
          },
          {
            status: 409,
          }
        );
      }
    }

    console.error(error);

    return NextResponse.json(
      {
        message:
          "No se pudo registrar el usuario.",
      },
      {
        status: 500,
      }
    );
  }
}