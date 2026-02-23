'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentModal({ onCloseAction, trackTitle, isLoggedIn }: { onCloseAction: () => void, trackTitle?: string | null, isLoggedIn: boolean }) {
    const [phone, setPhone] = useState('');
    const [network, setNetwork] = useState('FLOOZ');
    const [accessType, setAccessType] = useState('STREAM');
    const [amount, setAmount] = useState(200);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, network, trackTitle, amount, accessType })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // Redirection vers le lecteur via le token unique généré
                router.push(data.link);
            } else {
                setError(data.error || 'Erreur lors du paiement');
            }
        } catch (err) {
            setError('Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onCloseAction}>
            <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Paiement</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>Achat de l'accès à : <strong style={{ color: '#fff' }}>{trackTitle || 'Titre Exclusif'}</strong></p>

                {error && <p style={{ color: 'var(--error-color)', marginBottom: '1rem', background: 'rgba(229,57,53,0.1)', padding: '0.5rem', borderRadius: '8px' }}>{error}</p>}

                {/* Options de tarification */}
                <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: accessType === 'STREAM' ? 'rgba(13, 242, 89, 0.1)' : 'rgba(255,255,255,0.05)', border: accessType === 'STREAM' ? '1px solid var(--primary-color)' : '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                        <input type="radio" name="accessType" value="STREAM" checked={accessType === 'STREAM'} onChange={() => { setAccessType('STREAM'); setAmount(200); }} style={{ accentColor: 'var(--primary-color)', width: '18px', height: '18px' }} />
                        <div style={{ flex: 1, textAlign: 'left' }}>
                            <div style={{ fontWeight: 'bold' }}>Écoute Unique</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mise à disposition (Streaming)</div>
                        </div>
                        <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>200 FCFA</div>
                    </label>

                    <label
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem',
                            background: accessType === 'PERMANENT' ? 'rgba(13, 242, 89, 0.1)' : 'rgba(255,255,255,0.05)',
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
                            onChange={() => { if (isLoggedIn) { setAccessType('PERMANENT'); setAmount(500); } }}
                            disabled={!isLoggedIn}
                            style={{ accentColor: 'var(--primary-color)', width: '18px', height: '18px' }}
                        />
                        <div style={{ flex: 1, textAlign: 'left' }}>
                            <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                Ajout Définitif {!isLoggedIn && <span style={{ fontSize: '0.65rem', background: 'var(--error-color)', padding: '2px 4px', borderRadius: '4px', color: '#fff' }}>Connexion requise</span>}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sauvegarde illimitée dans Ma Musique</div>
                        </div>
                        <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>500 FCFA</div>
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
                            <option value="MIXX">Mixx by Yas</option>
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
                        <button type="button" className="btn btn-secondary" onClick={onCloseAction} style={{ flex: 1 }}>
                            Annuler
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
                            {loading ? 'Traitement...' : 'Payer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
