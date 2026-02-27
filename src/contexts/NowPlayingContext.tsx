'use client';

import { createContext, useContext, useState, useRef, useCallback, useEffect, ReactNode } from 'react';

export interface NowPlayingTrack {
    id: string;
    title: string;
    artistName: string;
    coverImage: string | null;
    token: string;
}

interface NowPlayingState {
    currentTrack: NowPlayingTrack | null;
    isPlaying: boolean;
    progress: number;
    duration: number;
    currentTime: number;
    volume: number;
    isBuffering: boolean;
}

interface NowPlayingActions {
    play: (track: NowPlayingTrack) => void;
    pause: () => void;
    resume: () => void;
    seek: (percent: number) => void;
    setVolume: (vol: number) => void;
    stop: () => void;
}

type NowPlayingContextType = NowPlayingState & NowPlayingActions;

const NowPlayingContext = createContext<NowPlayingContextType | null>(null);

export function useNowPlaying() {
    const ctx = useContext(NowPlayingContext);
    if (!ctx) throw new Error('useNowPlaying must be used within NowPlayingProvider');
    return ctx;
}

export function NowPlayingProvider({ children }: { children: ReactNode }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentTrack, setCurrentTrack] = useState<NowPlayingTrack | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolumeState] = useState(0.8);
    const [isBuffering, setIsBuffering] = useState(false);

    // Create audio element once
    useEffect(() => {
        const audio = new Audio();
        audio.volume = 0.8;
        audio.preload = 'auto';
        audioRef.current = audio;

        const onTimeUpdate = () => {
            if (!isNaN(audio.duration) && audio.duration > 0) {
                setCurrentTime(audio.currentTime);
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };
        const onLoadedMetadata = () => {
            if (!isNaN(audio.duration)) {
                setDuration(audio.duration);
            }
        };
        const onEnded = () => {
            setIsPlaying(false);
            setProgress(0);
            setCurrentTime(0);
        };
        const onWaiting = () => setIsBuffering(true);
        const onPlaying = () => setIsBuffering(false);
        const onCanPlay = () => setIsBuffering(false);

        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('ended', onEnded);
        audio.addEventListener('waiting', onWaiting);
        audio.addEventListener('playing', onPlaying);
        audio.addEventListener('canplay', onCanPlay);

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('waiting', onWaiting);
            audio.removeEventListener('playing', onPlaying);
            audio.removeEventListener('canplay', onCanPlay);
            audio.pause();
            audio.src = '';
        };
    }, []);

    const play = useCallback((track: NowPlayingTrack) => {
        const audio = audioRef.current;
        if (!audio) return;

        // If same track, just resume
        if (currentTrack?.token === track.token && audio.src) {
            audio.play();
            setIsPlaying(true);
            return;
        }

        // New track
        setCurrentTrack(track);
        setProgress(0);
        setCurrentTime(0);
        setDuration(0);
        setIsBuffering(true);

        audio.src = `/api/stream?token=${track.token}`;
        audio.load();
        audio.play().then(() => {
            setIsPlaying(true);
        }).catch(() => {
            setIsPlaying(false);
            setIsBuffering(false);
        });
    }, [currentTrack]);

    const pause = useCallback(() => {
        audioRef.current?.pause();
        setIsPlaying(false);
    }, []);

    const resume = useCallback(() => {
        audioRef.current?.play();
        setIsPlaying(true);
    }, []);

    const seek = useCallback((percent: number) => {
        const audio = audioRef.current;
        if (audio && !isNaN(audio.duration)) {
            audio.currentTime = (percent / 100) * audio.duration;
        }
    }, []);

    const setVolume = useCallback((vol: number) => {
        const clamped = Math.max(0, Math.min(1, vol));
        if (audioRef.current) {
            audioRef.current.volume = clamped;
        }
        setVolumeState(clamped);
    }, []);

    const stop = useCallback(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.pause();
            audio.src = '';
        }
        setCurrentTrack(null);
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
        setDuration(0);
    }, []);

    return (
        <NowPlayingContext.Provider value={{
            currentTrack, isPlaying, progress, duration, currentTime, volume, isBuffering,
            play, pause, resume, seek, setVolume, stop
        }}>
            {children}
        </NowPlayingContext.Provider>
    );
}
