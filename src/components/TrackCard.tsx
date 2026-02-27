'use client';

import { PlayCircle } from 'lucide-react';
import Link from 'next/link';

interface TrackCardProps {
    track: {
        id: string;
        title: string;
        artistName?: string | null;
        artist?: { name?: string | null } | null;
        coverImage?: string | null;
        priceStream?: number;
    };
    onClick?: () => void;
}

export default function TrackCard({ track, onClick }: TrackCardProps) {
    const artistName = track.artistName || track.artist?.name || 'Artiste inconnu';
    const artistSlug = encodeURIComponent(artistName);

    return (
        <div className="track-card" onClick={onClick}>
            <div className="track-card__image-wrapper">
                {track.coverImage ? (
                    <img
                        alt={track.title}
                        src={track.coverImage}
                        className="track-card__image"
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--surface-hover), var(--surface-sunken))' }} />
                )}
                <div className="track-card__play-overlay">
                    <button className="track-card__play-btn" onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
                        <PlayCircle size={28} />
                    </button>
                </div>
                {track.priceStream && (
                    <span className="track-card__price-badge">{track.priceStream} FCFA</span>
                )}
            </div>
            <div>
                <h3 className="track-card__title">{track.title}</h3>
                <p className="track-card__meta">
                    <Link
                        href={`/a/${artistSlug}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{ color: 'inherit', textDecoration: 'none' }}
                        className="hover-underline"
                    >
                        {artistName}
                    </Link>
                    {track.priceStream && (
                        <>
                            <span>&bull;</span>
                            <span>{track.priceStream} FCFA</span>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}
