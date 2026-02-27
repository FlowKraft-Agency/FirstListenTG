'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // Éviter l'hydratation error
    }

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="theme-toggle-btn"
            style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--glass-icon-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: theme === 'dark' ? '0 0 10px var(--primary-alpha-10)' : '0 2px 10px rgba(0,0,0,0.05)'
            }}
            aria-label="Toggle Dark Mode"
            title={theme === 'dark' ? "Passer en mode clair" : "Passer en mode sombre"}
        >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
}
