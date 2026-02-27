'use client';

import { useState } from 'react';
import { UserCircle, BadgeCheck } from 'lucide-react';
import PaymentModal from '@/components/PaymentModal';
import { useSession } from "next-auth/react";
import Navbar from '@/components/Navbar';
import TrackCard from '@/components/TrackCard';
import Footer from '@/components/Footer';

export default function ArtistProfileClient({ artistName, artistImage, tracks }: { artistName: string, artistImage: string | null, tracks: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<any | null>(null);
    const { data: session } = useSession();

    const openModal = (track: any) => {
        setSelectedTrack(track);
        setIsModalOpen(true);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', overflowX: 'hidden', background: 'var(--bg-color)' }}>
            <Navbar />

            <main style={{ flex: 1, position: 'relative', marginTop: '4.5rem', background: 'var(--surface-color)' }}>
                {/* Artist header */}
                <div style={{ background: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)', padding: 'var(--space-3xl) var(--space-lg)', textAlign: 'center' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-lg)' }}>
                        <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--surface-color)', border: '4px solid var(--surface-hover)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {artistImage ? (
                                <img src={artistImage} alt={artistName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <UserCircle size={64} color="var(--text-muted)" />
                            )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', alignItems: 'center' }}>
                            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.025em', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                                {artistName} <BadgeCheck size={28} color="var(--primary-color)" />
                            </h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', margin: 0 }}>
                                Artiste Vérifié &bull; {tracks.length} morceau{tracks.length > 1 ? 'x' : ''} exclusif{tracks.length > 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="landing-section__inner" style={{ padding: 'var(--space-3xl) var(--space-lg)' }}>
                    <div className="grid-responsive">
                        {tracks.map(track => (
                            <TrackCard key={track.id} track={track} onClick={() => openModal(track)} />
                        ))}
                    </div>
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
