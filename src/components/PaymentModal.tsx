'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function PaymentModal({ onCloseAction, trackTitle, trackId, priceStream = 200, priceDownload = 500, isLoggedIn }: { onCloseAction: () => void, trackTitle?: string | null, trackId?: string | null, priceStream?: number, priceDownload?: number, isLoggedIn: boolean }) {
    const [phone, setPhone] = useState('');
    const [network, setNetwork] = useState('FLOOZ');
    const [accessType, setAccessType] = useState('STREAM');
    const [amount, setAmount] = useState(priceStream);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [waitingConfirmation, setWaitingConfirmation] = useState(false);
    const [transactionId, setTransactionId] = useState<string | null>(null);
    const [paymentTokenId, setPaymentTokenId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval>;

        if (waitingConfirmation && transactionId && paymentTokenId) {
            // Polling pour vérifier le statut de la transaction
            intervalId = setInterval(async () => {
                try {
                    const res = await fetch(`/api/payment/status?id=${transactionId}`);
                    if (res.ok) {
                        const data = await res.json();
                        if (data.status === 'SUCCESS') {
                            clearInterval(intervalId);
                            router.push(`/player/${paymentTokenId}`);
                        } else if (data.status === 'FAILED') {
                            clearInterval(intervalId);
                            setError("Le paiement a échoué ou a été annulé.");
                            setWaitingConfirmation(false);
                            setLoading(false);
                        }
                    }
                } catch (err) {
                    console.error("Polling error", err);
                }
            }, 3000); // Check every 3 seconds
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [waitingConfirmation, transactionId, paymentTokenId, router]);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, network, trackTitle, trackId, amount, accessType })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // On a initié le paiement, on attend la confirmation USSD
                setTransactionId(data.transactionId);
                setPaymentTokenId(data.token);
                setWaitingConfirmation(true);
            } else {
                setError(data.error || 'Erreur lors de l\'initiation du paiement');
                setLoading(false);
            }
        } catch (err) {
            setError('Erreur de connexion au serveur');
            setLoading(false);
        }
    };

    if (waitingConfirmation) {
        return (
            <div className="modal-overlay">
                <div className="modal-content animate-fade-in" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                    <Loader2 size={48} className="animate-spin" style={{ color: 'var(--primary-color)', margin: '0 auto var(--space-xl)' }} />
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: 'var(--space-sm)' }}>Confirmation requise</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-xl)' }}>
                        Veuillez consulter votre téléphone ({phone}) et entrer votre code secret {network} pour valider le paiement de {amount} FCFA.
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--primary-color)', fontWeight: 500, animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
                        En attente de la validation opérateur...
                    </p>
                    <button
                        className="btn btn-secondary"
                        style={{ marginTop: 'var(--space-2xl)' }}
                        onClick={() => { setWaitingConfirmation(false); setLoading(false); }}
                    >
                        Annuler / Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={onCloseAction}>
            <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Paiement</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>Achat de l'accès à : <strong style={{ color: 'var(--text-main)' }}>{trackTitle || 'Titre Exclusif'}</strong></p>

                {error && <p style={{ color: 'var(--error-color)', marginBottom: '1rem', background: 'rgba(229,57,53,0.1)', padding: '0.5rem', borderRadius: '8px' }}>{error}</p>}

                {/* Options de tarification */}
                <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: accessType === 'STREAM' ? 'var(--primary-alpha-10)' : 'var(--glass-icon-bg)', border: accessType === 'STREAM' ? '1px solid var(--primary-color)' : '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                        <input type="radio" name="accessType" value="STREAM" checked={accessType === 'STREAM'} onChange={() => { setAccessType('STREAM'); setAmount(priceStream); }} style={{ accentColor: 'var(--primary-color)', width: '18px', height: '18px' }} />
                        <div style={{ flex: 1, textAlign: 'left' }}>
                            <div style={{ fontWeight: 'bold' }}>Écoute Unique</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mise à disposition (Streaming)</div>
                        </div>
                        <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{priceStream} FCFA</div>
                    </label>

                    <label
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem',
                            background: accessType === 'PERMANENT' ? 'var(--primary-alpha-10)' : 'var(--glass-icon-bg)',
                            border: accessType === 'PERMANENT' ? '1px solid var(--primary-color)' : '1px solid var(--border-color)',
                            borderRadius: '8px',
                            cursor: isLoggedIn ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s ease',
                            opacity: isLoggedIn ? 1 : 0.5
                        }}
                    >
                        <input
                            type="radio"
                            name="accessType"
                            value="PERMANENT"
                            checked={accessType === 'PERMANENT'}
                            onChange={() => { if (isLoggedIn) { setAccessType('PERMANENT'); setAmount(priceDownload); } }}
                            disabled={!isLoggedIn}
                            style={{ accentColor: 'var(--primary-color)', width: '18px', height: '18px' }}
                        />
                        <div style={{ flex: 1, textAlign: 'left' }}>
                            <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                Ajout Définitif {!isLoggedIn && <span style={{ fontSize: '0.65rem', background: 'var(--error-color)', padding: '2px 4px', borderRadius: '4px', color: '#fff' }}>Connexion requise</span>}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sauvegarde illimitée dans Ma Musique</div>
                        </div>
                        <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{priceDownload} FCFA</div>
                    </label>
                </div>

                <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Réseau Mobile</label>
                        <select
                            value={network}
                            onChange={e => setNetwork(e.target.value)}
                            className="select-base"
                        >
                            <option value="FLOOZ">Moov Money (Flooz)</option>
                            <option value="TMONEY">T-Money</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Numéro de téléphone</label>
                        <input
                            type="tel"
                            placeholder="Ex: 90 00 00 00"
                            required
                            className="input-base"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" className="btn btn-secondary" disabled={loading} onClick={onCloseAction} style={{ flex: 1 }}>
                            Annuler
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
                            {loading ? 'Initiation...' : 'Payer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
