'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Music, UserCircle } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="navbar">
            <div className="navbar__inner">
                <Link href="/" className="navbar__logo">
                    <div className="navbar__logo-icon">
                        <Music size={24} strokeWidth={2.5} />
                    </div>
                    <span className="navbar__logo-text">
                        First<span style={{ color: 'var(--primary-color)' }}>Listen</span>
                    </span>
                </Link>

                <div className="navbar__links desktop-only">
                    <Link href="/explore" style={{ fontWeight: 700, color: 'var(--text-main)' }}>Explorer</Link>
                    <a href="#comment-ca-marche">Comment ça marche</a>
                    <a href="#aide">Aide</a>
                </div>

                <div className="navbar__actions">
                    <ThemeToggle />
                    {session ? (
                        <>
                            <Link href="/library" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}>
                                <Music size={16} /> Bibliothèque
                            </Link>
                            {(session.user as any)?.role === 'ADMIN' && (
                                <Link href="/admin" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                    Admin
                                </Link>
                            )}
                            {(session.user as any)?.role === 'ARTIST' && (
                                <Link href="/artist" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem', background: 'var(--primary-alpha-10)', color: 'var(--primary-color)', border: '1px solid var(--primary-alpha-20)' }}>
                                    Studio
                                </Link>
                            )}
                            <Link href="/profile" style={{ color: 'var(--text-muted)', display: 'flex' }}>
                                <UserCircle size={24} />
                            </Link>
                        </>
                    ) : (
                        <Link href="/login" className="navbar__login-btn">
                            Connexion
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
