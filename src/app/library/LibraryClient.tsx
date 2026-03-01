'use client';

import Link from 'next/link';
import { Music } from 'lucide-react';
import { useNowPlaying } from '@/contexts/NowPlayingContext';

interface Token {
    id: string;
    accessType: string;
    status: string;
    createdAt: string;
    expiresAt: string;
    transaction: {
        track: {
            id: string;
            title: string;
            artistName: string | null;
            coverImage: string | null;
            priceStream: number;
            priceDownload: number;
            artist: {
                name: string | null;
            };
        } | null;
    };
}

export default function LibraryClient({ tokens }: { tokens: Token[] }) {
    const { play, currentTrack, isPlaying } = useNowPlaying();

    const handlePlay = (token: Token) => {
        const track = token.transaction.track;
        if (!track) return;

        const displayArtist = track.artistName || track.artist?.name || 'Artiste inconnu';

        play({
            id: track.id,
            title: track.title || 'Titre inconnu',
            artistName: displayArtist,
            coverImage: track.coverImage,
            token: token.id,
        });
    };

    const getArtistName = (track: Token['transaction']['track']) => {
        if (!track) return 'Artiste inconnu';
        return track.artistName || track.artist?.name || 'Artiste inconnu';
    };

    return (
        <div className="grid-responsive">
            {tokens.map(token => {
                const track = token.transaction.track;
                // Si la piste a été supprimée ou est introuvable, on affiche un message clair ou on l'ignore.
                if (!track) {
                    return (
                        <div key={token.id} className="track-card" style={{ padding: 0, cursor: 'not-allowed', opacity: 0.6 }}>
                            <div className="track-card__image-wrapper" style={{ background: 'var(--surface-sunken)' }}>
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Music size={48} color="var(--border-color)" />
                                </div>
                                <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2 }}>
                                    <span className="badge badge--neutral">INDISPONIBLE</span>
                                </div>
                            </div>
                            <div style={{ padding: 'var(--space-md)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <h3 className="track-card__title" style={{ color: 'var(--text-muted)' }}>Titre indisponible</h3>
                                    <p className="track-card__meta">L'audio a été retiré.</p>
                                </div>
                            </div>
                        </div>
                    );
                }

                const isPermanent = token.accessType === 'PERMANENT';
                const isValid = isPermanent || (token.status === 'VALID' && new Date() <= new Date(token.expiresAt));
                const isCurrentlyPlaying = currentTrack?.token === token.id && isPlaying;
                const artistName = getArtistName(track);
                const price = isPermanent ? track?.priceDownload : track?.priceStream;

                return (
                    <div key={token.id} className="track-card" style={{ padding: 0, cursor: 'default' }}>
                        <div className="track-card__image-wrapper">
                            {track?.coverImage ? (
                                <img src={track.coverImage} alt={track.title} className="track-card__image" />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-sunken)' }}>
                                    <Music size={48} color="var(--border-color)" />
                                </div>
                            )}
                            {/* Status badge */}
                            <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2 }}>
                                {isPermanent ? (
                                    <span className="badge badge--success">DÉFINITIF</span>
                                ) : isValid ? (
                                    <span className="badge badge--success">30 MIN</span>
                                ) : (
                                    <span className="badge badge--neutral">EXPIRÉ</span>
                                )}
                            </div>
                            {isCurrentlyPlaying && (
                                <div style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex: 2 }}>
                                    <span className="badge badge--success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-color)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                                        EN COURS
                                    </span>
                                </div>
                            )}
                        </div>

                        <div style={{ padding: 'var(--space-md)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <h3 className="track-card__title">
                                    {track.title}
                                </h3>
                                <p className="track-card__meta">
                                    <Link href={`/a/${encodeURIComponent(artistName)}`} className="hover-underline" style={{ color: 'inherit', textDecoration: 'none' }}>
                                        {artistName}
                                    </Link>
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)', flexWrap: 'wrap' }}>
                                    {price && (
                                        <span className="track-card__price-badge">
                                            {price} FCFA
                                        </span>
                                    )}
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        {new Date(token.createdAt).toLocaleDateString('fr-FR')}
                                    </span>
                                </div>
                            </div>
                            <div style={{ marginTop: 'var(--space-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                                    ID: {token.id.split('-')[0].toUpperCase()}
                                </span>

                                {isPermanent ? (
                                    <button
                                        className="btn btn-primary"
                                        style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}
                                        onClick={() => handlePlay(token)}
                                    >
                                        {isCurrentlyPlaying ? 'En cours...' : 'Écouter'}
                                    </button>
                                ) : isValid ? (
                                    <Link href={`/player/${token.id}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem', textDecoration: 'none' }}>
                                        Écouter
                                    </Link>
                                ) : null}
                            </div>
                        </div>
                    </div>
                );
            })}

            {tokens.length === 0 && (
                <div className="empty-state">
                    <Music size={64} className="empty-state__icon" />
                    <p className="empty-state__text">Votre bibliothèque est vide.</p>
                    <Link href="/" className="btn btn-primary" style={{ marginTop: 'var(--space-md)' }}>Explorer le catalogue</Link>
                </div>
            )}
        </div>
    );
}
