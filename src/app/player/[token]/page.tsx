import { prisma } from '@/lib/prisma';
import CustomAudioPlayer from '@/components/CustomAudioPlayer';
import { XCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function PlayerPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params;

    const tokenRecord = await prisma.token.findUnique({ where: { id: token } });

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
        <main className="container animate-fade-in" style={{ textAlign: 'center', paddingTop: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <Link href="/library" className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="title" style={{ margin: 0 }}>Écoute Privée</h1>
            </div>
            <p className="subtitle" style={{ color: 'var(--success-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={18} />
                {tokenRecord.accessType === 'PERMANENT'
                    ? 'Accès illimité (Ajout Définitif)'
                    : `Accès autorisé. Valable jusqu'à ${tokenRecord.expiresAt.toLocaleTimeString('fr-FR')}`}
            </p>

            <div className="glass-card" style={{ padding: '3rem 2rem' }}>
                <CustomAudioPlayer token={token} accessType={tokenRecord.accessType} />
            </div>
        </main>
    );
}

function ErrorState({ message, detail }: { message: string, detail?: string }) {
    return (
        <main className="container animate-fade-in" style={{ textAlign: 'center', paddingTop: '8rem' }}>
            <XCircle size={80} color="var(--error-color)" style={{ margin: '0 auto 2rem' }} />
            <h1 className="title" style={{ color: 'var(--error-color)' }}>Accès Refusé</h1>
            <p className="subtitle" style={{ fontSize: '1.25rem', color: '#fff' }}>{message}</p>
            {detail && <p style={{ color: 'var(--text-muted)' }}>{detail}</p>}

            <a href="/" className="btn btn-secondary" style={{ marginTop: '2rem', textDecoration: 'none' }}>
                Retour à l'accueil
            </a>
        </main>
    );
}
