'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, ShieldAlert, FastForward, Rewind } from 'lucide-react';

export default function CustomAudioPlayer({
    token,
    accessType,
    trackTitle,
    artistName,
    coverImage
}: {
    token: string,
    accessType: string,
    trackTitle?: string | null,
    artistName?: string | null,
    coverImage?: string | null
}) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isBuffering, setIsBuffering] = useState(true);

    // Empêcher le clic droit sur le lecteur pour sécuriser davantage l'UI de l'audio
    useEffect(() => {
        const handleContextMenu = (e: globalThis.MouseEvent) => e.preventDefault();
        document.addEventListener('contextmenu', handleContextMenu);
        return () => document.removeEventListener('contextmenu', handleContextMenu);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current && !isNaN(audioRef.current.duration)) {
            setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (audioRef.current && !isNaN(audioRef.current.duration)) {
            const bounds = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - bounds.left) / bounds.width;
            audioRef.current.currentTime = percent * audioRef.current.duration;
        }
    };

    const skipForward = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 10);
        }
    };

    const skipBackward = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
        }
    };

    const timeRemaining = audioRef.current && !isNaN(audioRef.current.duration)
        ? audioRef.current.duration - audioRef.current.currentTime
        : 0;


    return (
        <div style={{ width: '100%' }}>
            {/* Status Badge */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
                <div style={{ padding: '6px 16px', borderRadius: '9999px', background: 'var(--primary-alpha-10)', border: '1px solid var(--primary-alpha-20)', color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ position: 'relative', display: 'flex', height: '8px', width: '8px' }}>
                        <span style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', background: 'var(--primary-color)', opacity: 0.75, animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></span>
                        <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '8px', width: '8px', background: 'var(--primary-color)' }}></span>
                    </div>
                    {accessType === 'PERMANENT' ? 'Accès Définitif – Illimité' : 'Lecture unique – non reproductible'}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center', width: '100%' }}>

                {/* Cover Art Side */}
                <div style={{ position: 'relative', margin: '0 auto', maxWidth: '384px', width: '100%' }}>
                    <div style={{ position: 'absolute', top: '-16px', left: '-16px', right: '-16px', bottom: '-16px', background: 'var(--primary-alpha-10)', filter: 'blur(24px)', borderRadius: '50%', opacity: 0.5, transition: 'opacity 1s ease' }}></div>
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid var(--border-color)' }}>
                        <img
                            alt={trackTitle || "Album art"}
                            src={coverImage || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800"}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: isPlaying ? 'grayscale(0)' : 'grayscale(0.5)', transition: 'filter 0.7s ease' }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8, 13, 10, 0.8), transparent, transparent)' }}></div>

                        {/* Dynamic Watermark Overlay */}
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', opacity: 0.1 }}>
                            <p style={{ fontSize: '0.75rem', transform: 'rotate(45deg)', userSelect: 'none', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 'bold', color: 'white' }}>
                                SecureID: {token.split('-')[0].toUpperCase()}-X91
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content Side */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--text-main)', letterSpacing: '-0.05em', marginBottom: '0.5rem', lineHeight: 1.1 }}>{trackTitle || 'Titre inconnu'}</h1>
                    <p style={{ fontSize: '1.5rem', color: 'var(--primary-color)', fontWeight: 500, marginBottom: '2rem' }}>{artistName || 'Artiste inconnu'}</p>

                    <div style={{ background: 'var(--glass-icon-bg)', backdropFilter: 'blur(12px)', border: '1px solid var(--glass-icon-bg)', borderRadius: '0.75rem', padding: '1.5rem', width: '100%', maxWidth: '28rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                            <div style={{ textAlign: 'left' }}>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Status</p>
                                <p style={{ color: 'var(--text-main)', fontWeight: 600 }}>{isPlaying ? 'Lecture en cours' : 'Ready for playback'}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Temps Restant</p>
                                <p style={{ color: 'var(--primary-color)', fontSize: '1.5rem', fontWeight: 'bold' }}>{formatTime(timeRemaining)}</p>
                            </div>
                        </div>

                        {/* Linear Progress Bar */}
                        <div onClick={handleSeek} style={{ height: '6px', width: '100%', background: 'var(--border-color)', borderRadius: '9999px', overflow: 'hidden', cursor: 'pointer' }}>
                            <div style={{ height: '100%', background: 'var(--primary-color)', width: `${progress}%`, transition: 'width 0.1s linear', boxShadow: '0 0 10px rgba(13,242,89,0.5)' }}></div>
                        </div>
                    </div>

                    {/* Central Control */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <style>{`
                            @keyframes spin {
                                from { transform: rotate(0deg); }
                                to { transform: rotate(360deg); }
                            }
                        `}</style>
                        <button onClick={skipBackward} style={{ width: '64px', height: '64px', borderRadius: '50%', border: '1px solid var(--border-color)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}>
                            <Rewind size={24} />
                        </button>
                        <button
                            onClick={togglePlay}
                            disabled={isBuffering}
                            style={{
                                width: '96px', height: '96px', borderRadius: '50%', background: 'var(--primary-color)', color: '#000',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isBuffering ? 'wait' : 'pointer',
                                boxShadow: isPlaying ? '0 0 20px var(--shadow-primary-glow)' : 'none',
                                transform: isPlaying ? 'scale(1.05)' : 'scale(1)', transition: 'all 0.2s ease',
                                opacity: isBuffering ? 0.7 : 1
                            }}>
                            {isBuffering ? (
                                <div style={{ width: '32px', height: '32px', border: '3px solid rgba(0,0,0,0.2)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                            ) : isPlaying ? (
                                <Pause size={40} />
                            ) : (
                                <Play size={40} style={{ marginLeft: '4px' }} />
                            )}
                        </button>
                        <button onClick={skipForward} style={{ width: '64px', height: '64px', borderRadius: '50%', border: '1px solid var(--border-color)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}>
                            <FastForward size={24} />
                        </button>
                    </div>

                    {accessType !== 'PERMANENT' && (
                        <p style={{ marginTop: '2.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShieldAlert size={16} />
                            Après cette lecture, le lien expirera automatiquement.
                        </p>
                    )}
                </div>
            </div>

            {/* Source audio sécurisée appelant l'API interne */}
            <audio
                ref={audioRef}
                src={`/api/stream?token=${token}`}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                onLoadedMetadata={handleTimeUpdate}
                onWaiting={() => setIsBuffering(true)}
                onPlaying={() => setIsBuffering(false)}
                onCanPlay={() => setIsBuffering(false)}
                controlsList="nodownload noplaybackrate"
                style={{ display: 'none' }}
            />
        </div>
    );
}
