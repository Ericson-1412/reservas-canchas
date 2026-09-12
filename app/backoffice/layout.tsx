import { redirect } from "next/navigation";

import { UserRole } from "@/lib/generated/prisma/client";
import { getCurrentUser } from "@/modules/auth/auth.session";
import { LogoutButton } from "@/modules/auth/components/logout-button";

interface BackofficeLayoutProps {
    children: React.ReactNode;
}

export default async function BackofficeLayout({
    children,
}: BackofficeLayoutProps) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    if (user.role !== UserRole.ADMIN) {
        redirect("/canchas");
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <header className="border-b border-slate-800 bg-slate-900 px-6 py-4">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div>
                        <p className="font-semibold">
                            Reserva de Canchas - Administración
                        </p>

                        <p className="text-sm text-slate-400">
                            {user.name}
                        </p>
                    </div>

                    <LogoutButton />
                </div>
            </header>

            <div className="mx-auto max-w-7xl p-6">
                {children}
            </div>
        </div>
    );
}