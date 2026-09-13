import Link from "next/link";

import { AuthLayout } from "@/modules/auth/components/auth-layout";
import { LoginForm } from "@/modules/auth/components/login-form";

interface LoginPageProps {
  searchParams: Promise<{
    returnTo?: string;
  }>;
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const params = await searchParams;

  const returnTo =
    params.returnTo?.startsWith("/") &&
    !params.returnTo.startsWith("//")
      ? params.returnTo
      : undefined;

  return (
    <AuthLayout>
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-600">
          RESERVA CANCHAS
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Bienvenido
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Ingresa tus datos para continuar.
        </p>
      </div>

      <LoginForm returnTo={returnTo} />

      <p className="mt-6 text-center text-sm text-slate-500">
        ¿No tienes una cuenta?{" "}
        <Link
          href="/registro"
          className="font-semibold text-blue-600 hover:underline"
        >
          Regístrate
        </Link>
      </p>
    </AuthLayout>
  );
}