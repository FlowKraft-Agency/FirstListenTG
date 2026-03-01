import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, UploadCloud, LogOut, Wallet } from "lucide-react";
import StudioMobileNav from "@/components/StudioMobileNav";

export default async function ArtistLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session || ((session.user as any).role !== "ARTIST" && (session.user as any).role !== "ADMIN")) {
        redirect("/");
    }

    return (
        <div className="studio-layout">
            <StudioMobileNav
                logoText={<>First<span style={{ color: 'var(--primary-color)' }}>Artist</span></>}
                links={[
                    { href: '/artist', label: 'Mes Revenus', icon: <LayoutDashboard size={20} /> },
                    { href: '/artist/upload', label: 'Publier un Son', icon: <UploadCloud size={20} /> },
                    { href: '/artist/payouts', label: 'Paiements', icon: <Wallet size={20} /> },
                ]}
            />

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
                    <Link href="/signout" className="studio-sidebar__link" style={{ color: 'var(--error-color)', padding: '0.5rem 0' }}>
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
