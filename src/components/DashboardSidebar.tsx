'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LogOut, Music, User as UserIcon, Shield, CreditCard, Sliders, Home, Star, LayoutDashboard, Search, MoreHorizontal } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useNowPlaying } from "@/contexts/NowPlayingContext";
import { useState } from "react";

export default function DashboardSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const { currentTrack } = useNowPlaying();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const hasPlayer = !!currentTrack;
    const role = (session?.user as any)?.role;

    return (
        <>
            <aside className={`dashboard-sidebar ${hasPlayer ? 'dashboard-sidebar--player-active' : ''}`}>
                <div className="dashboard-sidebar-header">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                        <span style={{ color: 'var(--primary-color)' }}>First</span>Listen.
                    </h2>
                </div>

                <nav className="sidebar-nav-container">
                    {/* Section: Navigation */}
                    <span className="sidebar-section-title">Navigation</span>

                    <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
                        <Home size={20} />
                        <span>Accueil</span>
                    </Link>
                    <Link href="/explore" className={`nav-link ${pathname === '/explore' ? 'active' : ''}`}>
                        <Search size={20} />
                        <span>Explorer</span>
                    </Link>
                    <Link href="/library" className={`nav-link ${pathname === '/library' ? 'active' : ''}`}>
                        <Music size={20} />
                        <span>Ma Musique</span>
                    </Link>
                    <Link href="/profile" className={`nav-link ${pathname.startsWith('/profile') ? 'active' : ''}`}>
                        <UserIcon size={20} />
                        <span>Profil</span>
                    </Link>

                    {/* Mobile: "Plus" button to open drawer */}
                    <button
                        className="nav-link mobile-only"
                        onClick={() => setDrawerOpen(true)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                        <MoreHorizontal size={20} />
                        <span>Plus</span>
                    </button>

                    {/* Section: Artiste (desktop only) */}
                    <div className="sidebar-divider" />

                    {role === 'ARTIST' || role === 'ADMIN' ? (
                        <Link href="/artist" className={`nav-link ${pathname.startsWith('/artist') ? 'active' : ''}`} style={{ color: 'var(--primary-color)' }}>
                            <Star size={20} />
                            <span>Studio Artiste</span>
                        </Link>
                    ) : (
                        <Link href="/become-artist" className={`nav-link ${pathname === '/become-artist' ? 'active' : ''}`} style={{ color: 'var(--primary-color)' }}>
                            <Star size={20} />
                            <span>Devenir Artiste</span>
                        </Link>
                    )}

                    {role === 'ADMIN' && (
                        <Link href="/admin" className={`nav-link ${pathname.startsWith('/admin') ? 'active' : ''}`} style={{ color: '#ef4444' }}>
                            <LayoutDashboard size={20} />
                            <span>Administration</span>
                        </Link>
                    )}

                    {/* Section: Parametres (desktop only) */}
                    <div className="desktop-only" style={{ flexDirection: 'column' }}>
                        <div className="sidebar-divider" />
                        <span className="sidebar-section-title">Paramètres</span>
                        <Link href="/settings/preferences" className={`nav-link ${pathname.includes('/preferences') ? 'active' : ''}`}>
                            <Sliders size={20} />
                            <span>Préférences</span>
                        </Link>
                        <Link href="/settings/security" className={`nav-link ${pathname.includes('/security') ? 'active' : ''}`}>
                            <Shield size={20} />
                            <span>Sécurité</span>
                        </Link>
                        <Link href="/settings/billing" className={`nav-link ${pathname.includes('/billing') ? 'active' : ''}`}>
                            <CreditCard size={20} />
                            <span>Facturation</span>
                        </Link>
                    </div>

                    {/* Bottom section (desktop only) */}
                    <div className="sidebar-bottom">
                        <Link href="/signout" className="nav-link" style={{ color: 'var(--error-color)', padding: '0.5rem 0' }}>
                            <LogOut size={18} />
                            <span>Déconnexion</span>
                        </Link>
                        <div style={{ paddingTop: 'var(--space-sm)' }}>
                            <ThemeToggle />
                        </div>
                    </div>
                </nav>
            </aside>

            {/* Mobile Drawer */}
            {drawerOpen && (
                <>
                    <div className="mobile-drawer-overlay" onClick={() => setDrawerOpen(false)} />
                    <div className="mobile-drawer">
                        <div className="mobile-drawer__handle" />

                        <span className="mobile-drawer__section-title">Espace</span>
                        {role === 'ARTIST' || role === 'ADMIN' ? (
                            <Link href="/artist" className="mobile-drawer__item" onClick={() => setDrawerOpen(false)} style={{ color: 'var(--primary-color)' }}>
                                <Star size={20} />
                                Studio Artiste
                            </Link>
                        ) : (
                            <Link href="/become-artist" className="mobile-drawer__item" onClick={() => setDrawerOpen(false)} style={{ color: 'var(--primary-color)' }}>
                                <Star size={20} />
                                Devenir Artiste
                            </Link>
                        )}

                        {role === 'ADMIN' && (
                            <Link href="/admin" className="mobile-drawer__item" onClick={() => setDrawerOpen(false)} style={{ color: '#ef4444' }}>
                                <LayoutDashboard size={20} />
                                Administration
                            </Link>
                        )}

                        <div className="mobile-drawer__divider" />

                        <span className="mobile-drawer__section-title">Paramètres</span>
                        <Link href="/settings/preferences" className="mobile-drawer__item" onClick={() => setDrawerOpen(false)}>
                            <Sliders size={20} />
                            Préférences
                        </Link>
                        <Link href="/settings/security" className="mobile-drawer__item" onClick={() => setDrawerOpen(false)}>
                            <Shield size={20} />
                            Sécurité
                        </Link>
                        <Link href="/settings/billing" className="mobile-drawer__item" onClick={() => setDrawerOpen(false)}>
                            <CreditCard size={20} />
                            Facturation
                        </Link>

                        <div className="mobile-drawer__divider" />

                        <div style={{ padding: '0.5rem var(--space-xl)' }}>
                            <ThemeToggle />
                        </div>
                        <Link href="/signout" className="mobile-drawer__item" onClick={() => setDrawerOpen(false)} style={{ color: 'var(--error-color)' }}>
                            <LogOut size={20} />
                            Déconnexion
                        </Link>
                    </div>
                </>
            )}
        </>
    );
}
