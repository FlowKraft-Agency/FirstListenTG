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
        } | null;
    };
}

export default function LibraryClient({ tokens }: { tokens: Token[] }) {
    const { play, currentTrack, isPlaying } = useNowPlaying();

    const handlePlay = (token: Token) => {
        const track = token.transaction.track;
        if (!track) return;

        play({
            id: track.id,
            title: track.title || 'Titre inconnu',
            artistName: track.artistName || 'Artiste inconnu',
            coverImage: track.coverImage,
            token: token.id,
        });
    };

    return (
        <div className="grid-responsive">
            {tokens.map(token => {
                const track = token.transaction.track;
                const isPermanent = token.accessType === 'PERMANENT';
                const isValid = token.status === 'VALID' && new Date() <= new Date(token.expiresAt);
                const isCurrentlyPlaying = currentTrack?.token === token.id && isPlaying;

                return (
                    <div key={token.id} className="track-card" style={{ padding: 0, cursor: 'default' }}>
                        <div className="track-card__image-wrapper">
                            {track?.coverImage ? (
                                <img src={track.coverImage} alt="Cover" className="track-card__image" />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                                    {track?.title || "Titre inconnu"}
                                </h3>
                                {track?.artistName ? (
                                    <p className="track-card__meta">
                                        <Link href={`/a/${encodeURIComponent(track.artistName)}`} className="hover-underline" style={{ color: 'inherit', textDecoration: 'none' }}>
                                            {track.artistName}
                                        </Link>
                                    </p>
                                ) : (
                                    <p className="track-card__meta">Artiste inconnu</p>
                                )}
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--space-sm)' }}>
                                    Acheté le {new Date(token.createdAt).toLocaleDateString('fr-FR')}
                                </p>
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
                                    <Link href={`/player/${token.id}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}>
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
