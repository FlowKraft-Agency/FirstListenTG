'use client';

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { NowPlayingProvider } from "@/contexts/NowPlayingContext";
import NowPlayingBar from "@/components/NowPlayingBar";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="data-theme" defaultTheme="dark">
            <SessionProvider>
                <NowPlayingProvider>
                    {children}
                    <NowPlayingBar />
                </NowPlayingProvider>
            </SessionProvider>
        </ThemeProvider>
    );
}
