import Link from "next/link";

import { AuthLayout } from "@/modules/auth/components/auth-layout";
import { RegisterForm } from "@/modules/auth/components/register-form";

export default function RegisterPage() {
  return (
    <AuthLayout>
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-600">
          RESERVA CANCHAS
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Crear cuenta
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Regístrate para empezar a reservar.
        </p>
      </div>

      <RegisterForm />

      <p className="mt-6 text-center text-sm text-slate-500">
        ¿Ya tienes una cuenta?{" "}
        <Link
          href="/login"
          className="font-semibold text-blue-600 hover:underline"
        >
          Iniciar sesión
        </Link>
      </p>
    </AuthLayout>
  );
}