'use client';

import { useNowPlaying } from '@/contexts/NowPlayingContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function NowPlayingBar() {
    const {
        currentTrack, isPlaying, progress, duration, currentTime, volume, isBuffering,
        pause, resume, seek, setVolume, stop
    } = useNowPlaying();

    if (!currentTrack) return null;

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = ((e.clientX - rect.left) / rect.width) * 100;
        seek(Math.max(0, Math.min(100, percent)));
    };

    const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const vol = (e.clientX - rect.left) / rect.width;
        setVolume(Math.max(0, Math.min(1, vol)));
    };

    const skipBackward = () => {
        const newPercent = Math.max(0, ((currentTime - 10) / duration) * 100);
        seek(newPercent);
    };

    const skipForward = () => {
        const newPercent = Math.min(100, ((currentTime + 10) / duration) * 100);
        seek(newPercent);
    };

    return (
        <div className="now-playing-bar">
            {/* Track info */}
            <div className="now-playing-bar__track-info">
                {currentTrack.coverImage ? (
                    <img
                        src={currentTrack.coverImage}
                        alt={currentTrack.title}
                        className="now-playing-bar__cover"
                    />
                ) : (
                    <div className="now-playing-bar__cover" style={{ background: 'linear-gradient(135deg, var(--surface-hover), var(--surface-sunken))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Play size={16} />
                    </div>
                )}
                <div className="now-playing-bar__text">
                    <div className="now-playing-bar__title">{currentTrack.title}</div>
                    <div className="now-playing-bar__artist">{currentTrack.artistName}</div>
                </div>
            </div>

            {/* Controls */}
            <div className="now-playing-bar__controls">
                <button className="now-playing-bar__ctrl-btn desktop-only" onClick={skipBackward}>
                    <SkipBack size={18} />
                </button>
                <button
                    className="now-playing-bar__play-btn"
                    onClick={isPlaying ? pause : resume}
                    style={{ opacity: isBuffering ? 0.7 : 1 }}
                >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
                </button>
                <button className="now-playing-bar__ctrl-btn desktop-only" onClick={skipForward}>
                    <SkipForward size={18} />
                </button>
            </div>

            {/* Progress (desktop) */}
            <div className="now-playing-bar__progress">
                <div className="now-playing-bar__progress-track">
                    <span className="now-playing-bar__time">{formatTime(currentTime)}</span>
                    <div className="now-playing-bar__progress-bar" onClick={handleProgressClick}>
                        <div className="now-playing-bar__progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="now-playing-bar__time">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Volume (large desktop) */}
            <div className="now-playing-bar__volume">
                <button className="now-playing-bar__ctrl-btn" onClick={() => setVolume(volume > 0 ? 0 : 0.8)}>
                    {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <div className="now-playing-bar__volume-bar" onClick={handleVolumeClick}>
                    <div className="now-playing-bar__volume-fill" style={{ width: `${volume * 100}%` }} />
                </div>
            </div>
        </div>
    );
}
