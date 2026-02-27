'use client';

import { useState } from 'react';
import { Music, PlayCircle, Search, UserCircle } from 'lucide-react';
import PaymentModal from '@/components/PaymentModal';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function ExploreClient({ initialTracks }: { initialTracks: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { data: session } = useSession();

    const filteredTracks = initialTracks.filter(track => {
        const query = searchQuery.toLowerCase();
        const artist = (track.artistName || track.artist?.name || '').toLowerCase();
        const title = (track.title || '').toLowerCase();
        return artist.includes(query) || title.includes(query);
    });

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
                        <Link href="/explore" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 700 }}>Explorer</Link>
                        <Link href="/#comment-ca-marche" style={{ color: 'inherit', textDecoration: 'none' }}>Comment ça marche</Link>
                        <Link href="/#aide" style={{ color: 'inherit', textDecoration: 'none' }}>Aide</Link>
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

            <main style={{ flex: 1, position: 'relative', marginTop: '5rem', padding: '4rem 0', background: 'var(--surface-color)' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '36rem' }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.025em' }}>Explorez notre catalogue</h2>
                            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.125rem' }}>Découvrez et achetez l'accès à des pépites sonores exclusives créées par des artistes talentueux.</p>
                        </div>

                        <div style={{ position: 'relative', maxWidth: '500px' }}>
                            <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text"
                                placeholder="Rechercher un son ou un artiste..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '1rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }}
                                className="search-input-hover"
                            />
                            <style>{`.search-input-hover:focus { border-color: var(--primary-color) !important; box-shadow: 0 0 0 2px var(--primary-alpha-20); }`}</style>
                        </div>
                    </div>

                    {filteredTracks.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
                            <p>Aucun morceau trouvé pour "{searchQuery}"</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {filteredTracks.map(track => (
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
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem', marginBottom: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Link
                                                href={`/a/${encodeURIComponent(track.artistName || track.artist?.name)}`}
                                                onClick={(e) => e.stopPropagation()}
                                                style={{ color: 'inherit', textDecoration: 'none' }}
                                                className="hover-underline"
                                            >
                                                {track.artistName || track.artist?.name}
                                            </Link>
                                            <span>&bull;</span> {track.priceStream} FCFA
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
