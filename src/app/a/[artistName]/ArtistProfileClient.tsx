'use client';

import { useState } from 'react';
import { Music, PlayCircle, UserCircle, BadgeCheck, Search } from 'lucide-react';
import PaymentModal from '@/components/PaymentModal';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function ArtistProfileClient({ artistName, artistImage, tracks }: { artistName: string, artistImage: string | null, tracks: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<any | null>(null);
    const { data: session } = useSession();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', overflowX: 'hidden', background: 'var(--bg-color)' }}>
            {/* Navbar */}
            <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, borderBottom: '1px solid var(--border-color)', background: 'var(--surface-color)', backdropFilter: 'blur(10px)' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', height: '5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'var(--text-main)' }}>
                        <div style={{ background: 'var(--primary-color)', color: 'var(--text-on-primary)', padding: '0.375rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Music size={24} strokeWidth={2.5} />
                        </div>
                        <span style={{ fontSize: '1.25rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.025em' }}>
                            First<span style={{ color: 'var(--primary-color)' }}>Listen</span>
                        </span>
                    </Link>

                    <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '2rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                        <Link href="/explore" style={{ color: 'inherit', textDecoration: 'none' }}>Explorer</Link>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <ThemeToggle />
                        {session ? (
                            <>
                                <Link href="/library" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                                    <Music size={16} /> Bibliothèque
                                </Link>
                                {(session.user as any)?.role === 'ADMIN' && (
                                    <Link href="/admin" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                        Admin
                                    </Link>
                                )}
                                {(session.user as any)?.role === 'ARTIST' && (
                                    <Link href="/artist" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', background: 'var(--primary-alpha-10)', color: 'var(--primary-color)', border: '1px solid var(--primary-alpha-20)' }}>
                                        Studio
                                    </Link>
                                )}
                                <Link href="/profile" style={{ color: 'var(--text-muted)' }}>
                                    <UserCircle size={24} />
                                </Link>
                            </>
                        ) : (
                            <Link href="/login" style={{ background: 'var(--text-main)', color: 'var(--bg-color)', padding: '0.5rem 1.5rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none' }}>
                                Connexion
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            <main style={{ flex: 1, position: 'relative', marginTop: '5rem', background: 'var(--surface-color)' }}>
                {/* En-tête de l'artiste */}
                <div style={{ background: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)', padding: '4rem 1.5rem', textAlign: 'center' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--surface-color)', border: '4px solid var(--surface-hover)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {artistImage ? (
                                <img src={artistImage} alt={artistName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <UserCircle size={64} color="var(--text-muted)" />
                            )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                            <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.025em', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                                {artistName} <BadgeCheck size={32} color="var(--primary-color)" />
                            </h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', margin: 0 }}>
                                Artiste Vérifié &bull; {tracks.length} morceau{tracks.length > 1 ? 'x' : ''} exclusif{tracks.length > 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {tracks.map(track => (
                            <div key={track.id} style={{ background: 'var(--surface-color)', padding: '1rem', borderRadius: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '1rem' }} onClick={() => { setSelectedTrack(track); setIsModalOpen(true); }}>
                                <div style={{ aspectRatio: '1', borderRadius: '1rem', overflow: 'hidden', position: 'relative' }}>
                                    {track.coverImage ? (
                                        <img alt={track.title} src={track.coverImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(45deg, var(--bg-color), var(--surface-hover))' }}></div>
                                    )}
                                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.1)' }}>
                                        <PlayCircle size={48} color="#fff" style={{ opacity: 0.8 }} />
                                    </div>
                                </div>
                                <div>
                                    <h3 style={{ color: 'var(--text-main)', fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '1.125rem' }}>{track.title}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem', marginBottom: 0 }}>{track.artistName || track.artist?.name} &bull; {track.priceStream} FCFA</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* FOOTER */}
            <footer style={{ borderTop: '1px solid var(--border-color)', background: 'var(--bg-color)', padding: '3rem 0', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', opacity: 0.5, marginBottom: '1rem' }}>
                    <Music size={18} strokeWidth={2.5} />
                    <span style={{ fontSize: '1.125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.025em' }}>FirstListen</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 500, margin: 0 }}>
                    © 2026 FirstListen. Tous droits réservés.
                </p>
            </footer>

            {isModalOpen && <PaymentModal onCloseAction={() => { setIsModalOpen(false); setSelectedTrack(null); }} trackTitle={selectedTrack?.title} trackId={selectedTrack?.id} priceStream={selectedTrack?.priceStream} priceDownload={selectedTrack?.priceDownload} isLoggedIn={!!session} />}
        </div >
    );
}
