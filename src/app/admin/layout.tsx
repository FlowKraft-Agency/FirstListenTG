import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Music, DollarSign, LogOut, Users } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
        redirect("/");
    }

    return (
        <div className="studio-layout">
            <aside className="studio-sidebar">
                <div className="studio-sidebar__logo">
                    <span className="studio-sidebar__logo-text">
                        First<span style={{ color: '#ef4444' }}>Admin</span>
                    </span>
                </div>

                <nav className="studio-sidebar__nav">
                    <Link href="/admin" className="studio-sidebar__link">
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link href="/admin/tracks" className="studio-sidebar__link">
                        <Music size={20} /> Modération Sons
                    </Link>
                    <Link href="/admin/payouts" className="studio-sidebar__link">
                        <DollarSign size={20} /> Payouts Artistes
                    </Link>
                    <Link href="/admin/users" className="studio-sidebar__link">
                        <Users size={20} /> Utilisateurs
                    </Link>
                </nav>

                <div style={{ padding: 'var(--space-lg) var(--space-xl)', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
                    <Link href="/" className="studio-sidebar__link" style={{ color: 'var(--error-color)', padding: '0.5rem 0' }}>
                        <LogOut size={20} /> Quitter Admin
                    </Link>
                </div>
            </aside>

            <main className="studio-main">
                {children}
            </main>
        </div>
    );
}
