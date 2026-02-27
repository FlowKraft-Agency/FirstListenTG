import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, UploadCloud, LogOut, BarChart3, Wallet } from "lucide-react";

export default async function ArtistLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ARTIST") {
        redirect("/");
    }

    return (
        <div className="studio-layout">
            <aside className="studio-sidebar">
                <div className="studio-sidebar__logo">
                    <span className="studio-sidebar__logo-text">
                        First<span style={{ color: 'var(--primary-color)' }}>Artist</span>
                    </span>
                </div>

                <nav className="studio-sidebar__nav">
                    <Link href="/artist" className="studio-sidebar__link">
                        <LayoutDashboard size={20} /> Mes Revenus
                    </Link>
                    <Link href="/artist/upload" className="studio-sidebar__link">
                        <UploadCloud size={20} /> Publier un Son
                    </Link>
                    <Link href="/artist/payouts" className="studio-sidebar__link">
                        <Wallet size={20} /> Paiements
                    </Link>
                </nav>

                <div style={{ padding: 'var(--space-lg) var(--space-xl)', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
                    <Link href="/" className="studio-sidebar__link" style={{ color: 'var(--error-color)', padding: '0.5rem 0' }}>
                        <LogOut size={20} /> Quitter Studio
                    </Link>
                </div>
            </aside>

            <main className="studio-main">
                {children}
            </main>
        </div>
    );
}
