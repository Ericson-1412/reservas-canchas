import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-[40%_60%]">

        {/* Formulario */}
        <section className="flex items-center justify-center bg-white px-8 py-12 lg:px-16">
          <div className="w-full max-w-md">
            {children}
          </div>
        </section>

        {/* Imagen */}
        <section className="relative hidden min-h-screen lg:block">
          <Image
            src="/images/auth-football.jpg"
            alt="Cancha de fútbol"
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/35" />

          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="max-w-xl text-center text-white">
              <h2 className="text-5xl font-bold leading-tight">
                Reserva. Juega.
                <br />
                Disfruta.
              </h2>

              <p className="mt-6 text-lg text-white/90">
                Encuentra tu cancha, elige tu horario
                y reserva en pocos minutos.
              </p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}