'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, ShieldAlert, Download } from 'lucide-react';

export default function CustomAudioPlayer({ token, accessType }: { token: string, accessType: string }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    // Empêcher le clic droit sur le lecteur pour sécuriser davantage l'UI de l'audio
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        document.addEventListener('contextmenu', handleContextMenu);
        return () => document.removeEventListener('contextmenu', handleContextMenu);
    }, []);

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
        if (audioRef.current) {
            setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>

            <div className="track-art" style={{ width: '200px', height: '200px', margin: '0', background: 'linear-gradient(135deg, #f7a01a 0%, #e53935 100%)' }}>
                <Volume2 size={48} color="#fff" />
            </div>

            <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, background: 'var(--primary-color)', height: '100%', transition: 'width 0.1s linear' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button
                    className="btn btn-primary"
                    onClick={togglePlay}
                    style={{ width: '64px', height: '64px', borderRadius: '50%', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    {isPlaying ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: '4px' }} />}
                </button>
            </div>

            {accessType === 'PERMANENT' ? (
                <p style={{ color: 'var(--success-color)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                    <ShieldAlert size={16} color="var(--success-color)" /> Acheté définitivement - Écoute illimitée
                </p>
            ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                    <ShieldAlert size={16} color="var(--primary-color)" /> Achat éphémère - 30 minutes restantes
                </p>
            )}

            {/* Source audio sécurisée appelant l'API interne */}
            <audio
                ref={audioRef}
                src={`/api/stream?token=${token}`}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                controlsList="nodownload noplaybackrate"
                style={{ display: 'none' }}
            />
        </div>
    );
}
