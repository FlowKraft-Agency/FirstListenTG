import { prisma } from '@/lib/prisma';
import CustomAudioPlayer from '@/components/CustomAudioPlayer';
import { XCircle, CheckCircle, ArrowLeft, Info, Music } from 'lucide-react';
import Link from 'next/link';
import ShareButton from './ShareButton';

export default async function PlayerPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params;

    const tokenRecord = await prisma.token.findUnique({
        where: { id: token },
        include: {
            transaction: {
                include: {
                    track: {
                        include: {
                            artist: true
                        }
                    }
                }
            }
        }
    });

    if (!tokenRecord) {
        return <ErrorState message="Lien invalide ou inexistant." />;
    }

    // On ignore l'expiration pour les achats PERMANENT
    if (tokenRecord.accessType !== 'PERMANENT' && new Date() > tokenRecord.expiresAt) {
        return <ErrorState message="Ce lien a expiré." detail="L'accès était limité à 30 minutes après l'achat." />;
    }

    if (tokenRecord.accessType !== 'PERMANENT' && tokenRecord.status === 'CONSUMED') {
        return <ErrorState message="Ce lien a expiré (déjà consommé)." />;
    }

    return (
        <main style={{ maxWidth: '1152px', margin: '0 auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)' }}>

            <div style={{ width: '100%', marginBottom: '2rem' }}>
                <Link href="/library" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
                    <ArrowLeft size={16} /> Retour à la bibliothèque
                </Link>
            </div>

            <div style={{ width: '100%' }}>
                <CustomAudioPlayer
                    token={token}
                    accessType={tokenRecord.accessType}
                    trackTitle={tokenRecord.transaction.track?.title}
                    artistName={tokenRecord.transaction.track?.artistName || tokenRecord.transaction.track?.artist?.name}
                    coverImage={tokenRecord.transaction.track?.coverImage}
                />
            </div>

            {/* Track Info & Share */}
            {tokenRecord.transaction.track && (
                <div style={{ width: '100%', maxWidth: '896px', marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '48px', height: '48px', background: 'var(--glass-icon-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                <Music size={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontWeight: 600 }}>À propos de {tokenRecord.transaction.track.title}</h3>
                                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    Par <strong>{tokenRecord.transaction.track.artistName || tokenRecord.transaction.track.artist.name}</strong> • Vendu pour {tokenRecord.transaction.track.priceStream} FCFA (Stream) / {tokenRecord.transaction.track.priceDownload} FCFA (Définitif)
                                </p>
                            </div>
                        </div>

                        {/* Public Link Share */}
                        <ShareButton url={`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/track/${tokenRecord.transaction.track.id}`} />
                    </div>
                </div>
            )}

            {/* Mobile Money Info Footer */}
            <section style={{ marginTop: '3rem', width: '100%', maxWidth: '896px', borderTop: '1px solid var(--glass-icon-bg)', paddingTop: '3rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', background: 'var(--glass-icon-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', marginBottom: '1rem' }}>
                            <CheckCircle size={24} />
                        </div>
                        <h3 style={{ color: 'var(--text-main)', fontWeight: 'bold', marginBottom: '0.25rem' }}>Verified Access</h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unlocked via Mobile Money Transaction #{token.split('-')[0].toUpperCase()}</p>
                    </div>
                </div>
            </section>
        </main>
    );
}

function ErrorState({ message, detail }: { message: string, detail?: string }) {
    return (
        <main className="container animate-fade-in" style={{ textAlign: 'center', paddingTop: '8rem' }}>
            <XCircle size={80} color="var(--error-color)" style={{ margin: '0 auto 2rem' }} />
            <h1 className="title" style={{ color: 'var(--error-color)' }}>Accès Refusé</h1>
            <p className="subtitle" style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>{message}</p>
            {detail && <p style={{ color: 'var(--text-muted)' }}>{detail}</p>}

            <a href="/" className="btn btn-secondary" style={{ marginTop: '2rem', textDecoration: 'none' }}>
                Retour à l'accueil
            </a>
        </main>
    );
}
