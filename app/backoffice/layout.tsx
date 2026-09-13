import Link from "next/link";

import { LogoutButton } from "@/modules/auth/components/logout-button";

export default function BackofficeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex min-h-screen">

                {/* SIDEBAR */}
                <aside className="hidden w-64 flex-col bg-slate-900 text-white lg:flex">
                    <div className="border-b border-slate-800 px-6 py-6">
                        <Link
                            href="/backoffice"
                            className="text-xl font-bold text-white"
                        >
                            Reserva Canchas
                        </Link>

                        <p className="mt-1 text-xs text-slate-400">
                            Panel administrativo
                        </p>
                    </div>

                    <nav className="flex-1 space-y-2 p-4">
                        <Link
                            href="/backoffice"
                            className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                        >
                            Inicio
                        </Link>

                        <Link
                            href="/backoffice/reservas"
                            className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                        >
                            Reservas
                        </Link>

                        <Link
                            href="/backoffice/canchas"
                            className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                        >
                            Canchas
                        </Link>
                    </nav>
                </aside>

                {/* CONTENIDO */}
                <div className="flex min-w-0 flex-1 flex-col">
                    <header className="border-b border-blue-100 bg-white">
                        <div className="flex items-center justify-between px-6 py-5 lg:px-10">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Administración
                                </p>

                                <h1 className="text-lg font-bold text-slate-900">
                                    Reserva de Canchas
                                </h1>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-slate-800">
                                        Administrador
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        Panel de gestión
                                    </p>
                                </div>

                                <LogoutButton />
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 p-6 lg:p-10">
                        <div className="mx-auto max-w-7xl">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}