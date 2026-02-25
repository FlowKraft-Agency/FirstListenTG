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

    const linkStyle = { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'all 0.2s', fontWeight: 500 };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)', color: '#fff' }}>
            {/* Sidebar Admin */}
            <aside style={{ width: '250px', background: 'var(--surface-color)', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.025em' }}>
                        First<span style={{ color: 'var(--primary-color)' }}>Admin</span>
                    </span>
                </div>

                <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link href="/admin" style={linkStyle}>
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link href="/admin/tracks" style={linkStyle}>
                        <Music size={20} /> Modération Sons
                    </Link>
                    <Link href="/admin/payouts" style={linkStyle}>
                        <DollarSign size={20} /> Payouts Artistes
                    </Link>
                    <Link href="/admin/users" style={linkStyle}>
                        <Users size={20} /> Utilisateurs
                    </Link>
                </nav>

                <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <Link href="/" style={{ ...linkStyle, color: '#ef4444' }}>
                        <LogOut size={20} /> Quitter Admin
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
