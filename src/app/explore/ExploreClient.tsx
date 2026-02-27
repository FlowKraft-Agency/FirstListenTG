'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import PaymentModal from '@/components/PaymentModal';
import { useSession } from "next-auth/react";
import Navbar from '@/components/Navbar';
import TrackCard from '@/components/TrackCard';
import Footer from '@/components/Footer';

const GENRES = ['Tous', 'Afrobeats', 'Hip-Hop', 'Gospel', 'Coupé-Décalé', 'R&B', 'Reggae', 'Traditionnelle'];

export default function ExploreClient({ initialTracks }: { initialTracks: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeGenre, setActiveGenre] = useState('Tous');
    const { data: session } = useSession();

    const filteredTracks = initialTracks.filter(track => {
        const query = searchQuery.toLowerCase();
        const artist = (track.artistName || track.artist?.name || '').toLowerCase();
        const title = (track.title || '').toLowerCase();
        return artist.includes(query) || title.includes(query);
    });

    const openModal = (track: any) => {
        setSelectedTrack(track);
        setIsModalOpen(true);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', overflowX: 'hidden', background: 'var(--bg-color)' }}>
            <Navbar />

            <main style={{ flex: 1, position: 'relative', marginTop: '4.5rem', padding: 'var(--space-3xl) 0', background: 'var(--surface-color)' }}>
                <div className="landing-section__inner" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>

                    {/* Header */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                        <div style={{ maxWidth: '36rem' }}>
                            <h1 className="landing-section__title" style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.025em' }}>Explorez notre catalogue</h1>
                            <p className="landing-section__subtitle" style={{ marginTop: 'var(--space-sm)', fontSize: '1.0625rem' }}>
                                Découvrez et achetez l'accès à des pépites sonores exclusives créées par des artistes talentueux.
                            </p>
                        </div>

                        {/* Search */}
                        <div style={{ position: 'relative', maxWidth: '500px' }}>
                            <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />
                            <input
                                type="text"
                                placeholder="Rechercher un son ou un artiste..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                        </div>

                        {/* Genre chips */}
                        <div className="filter-chips">
                            {GENRES.map(genre => (
                                <button
                                    key={genre}
                                    className={`filter-chip ${activeGenre === genre ? 'active' : ''}`}
                                    onClick={() => setActiveGenre(genre)}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid */}
                    {filteredTracks.length === 0 ? (
                        <div className="empty-state">
                            <p>Aucun morceau trouvé pour &quot;{searchQuery}&quot;</p>
                        </div>
                    ) : (
                        <div className="grid-responsive">
                            {filteredTracks.map((track) => (
                                <TrackCard key={track.id} track={track} onClick={() => openModal(track)} />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />

            {isModalOpen && (
                <PaymentModal
                    onCloseAction={() => { setIsModalOpen(false); setSelectedTrack(null); }}
                    trackTitle={selectedTrack?.title}
                    trackId={selectedTrack?.id}
                    priceStream={selectedTrack?.priceStream}
                    priceDownload={selectedTrack?.priceDownload}
                    isLoggedIn={!!session}
                />
            )}
        </div>
    );
}
