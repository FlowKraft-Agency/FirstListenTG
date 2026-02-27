'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LogOut, Music, Settings, User as UserIcon, Shield, CreditCard, Sliders, Home, Star, LayoutDashboard, Search } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function DashboardSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    return (
        <aside className="dashboard-sidebar">
            <div className="dashboard-sidebar-header">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                    <span style={{ color: 'var(--primary-color)' }}>First</span>Listen.
                </h2>
            </div>

            <nav className="sidebar-nav-container">
                <Link href="/" className="nav-link">
                    <Home />
                    <span>Accueil</span>
                </Link>
                <Link href="/explore" className={`nav-link ${pathname === '/explore' ? 'active' : ''}`}>
                    <Search />
                    <span>Explorer</span>
                </Link>
                <Link href="/library" className={`nav-link ${pathname === '/library' ? 'active' : ''}`}>
                    <Music />
                    <span>Ma Musique</span>
                </Link>
                <Link href="/profile" className={`nav-link ${pathname.startsWith('/profile') ? 'active' : ''}`}>
                    <UserIcon />
                    <span>Profil</span>
                </Link>

                {(session?.user as any)?.role === 'ARTIST' || (session?.user as any)?.role === 'ADMIN' ? (
                    <Link href="/artist" className="nav-link" style={{ color: 'var(--primary-color)' }}>
                        <Star />
                        <span>Studio Artiste</span>
                    </Link>
                ) : (
                    <Link href="/become-artist" className={`nav-link ${pathname === '/become-artist' ? 'active' : ''}`} style={{ color: 'var(--primary-color)' }}>
                        <Star />
                        <span>Devenir Artiste</span>
                    </Link>
                )}

                {(session?.user as any)?.role === 'ADMIN' && (
                    <Link href="/admin" className="nav-link" style={{ color: '#ef4444' }}>
                        <LayoutDashboard />
                        <span>Administration</span>
                    </Link>
                )}

                {/* Paramètres avec sous-menus (Cachés sur mobile, ou accessibles autrement dans une V ultérieure, mis dans le flow normal pour l'instant) */}
                <div className="desktop-only" style={{ flexDirection: 'column' }}>
                    <span className="sidebar-section-title">Paramètres</span>
                    <Link href="/settings/preferences" className={`nav-link ${pathname.includes('/preferences') ? 'active' : ''}`}>
                        <Sliders />
                        <span>Préférences</span>
                    </Link>
                    <Link href="/settings/security" className={`nav-link ${pathname.includes('/security') ? 'active' : ''}`}>
                        <Shield />
                        <span>Sécurité</span>
                    </Link>
                    <Link href="/settings/billing" className={`nav-link ${pathname.includes('/billing') ? 'active' : ''}`}>
                        <CreditCard />
                        <span>Facturation</span>
                    </Link>
                </div>

                <a href="/api/auth/signout" className="nav-link" style={{ color: 'var(--error-color)' }}>
                    <LogOut />
                    <span>Déconnexion</span>
                </a>

                <div className="nav-link" style={{ cursor: 'default', marginTop: 'auto', paddingTop: '1rem' }}>
                    <ThemeToggle />
                </div>
            </nav>
        </aside>
    );
}
