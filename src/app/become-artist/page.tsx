'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Music, ArrowRight, CheckCircle2 } from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function BecomeArtistPage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpgrade = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/user/role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: 'ARTIST' }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Une erreur est survenue');
            }

            // Mettre à jour la session
            await update();

            // Rediriger vers le dashboard artiste
            router.push('/artist');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!session) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[var(--bg-color)]">
                <p>Veuillez vous connecter pour accéder à cette page.</p>
            </div>
        );
    }

    if ((session.user as any)?.role === 'ARTIST' || (session.user as any)?.role === 'ADMIN') {
        router.push('/artist');
        return null;
    }

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <DashboardSidebar />

            {/* Main Content */}
            <main className="dashboard-main" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ paddingBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Music size={32} color="var(--primary-color)" /> Devenir Artiste
                    </h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        Transformez votre passion en revenus. Vendez vos morceaux en exclusivité sur FirstListen.
                    </p>
                </div>

                <div className="glass-card" style={{ maxWidth: '800px', margin: 0 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px' }}>
                            <CheckCircle2 size={24} color="var(--primary-color)" />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Vendez vos exclusivités</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}>
                                Proposez vos morceaux avant leur sortie officielle et générez des revenus directs de vos fans les plus fidèles.
                            </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px' }}>
                            <CheckCircle2 size={24} color="var(--primary-color)" />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Contrôle total</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}>
                                Fixez vos propres prix pour le streaming et le téléchargement. Suivez vos revenus en temps réel.
                            </p>
                        </div>
                    </div>

                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '8px', display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '2rem' }}>
                        <ShieldAlert size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <p style={{ color: '#ef4444', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>
                            En devenant artiste, vous acceptez nos conditions d'utilisation concernant la distribution de contenu musical et la perception de revenus.
                        </p>
                    </div>

                    {error && (
                        <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleUpgrade}
                        disabled={isLoading}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '1rem', fontSize: '1.125rem' }}
                    >
                        {isLoading ? 'Activation en cours...' : (
                            <>
                                Activer mon compte Artiste
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </div>
            </main>
        </div>
    );
}
