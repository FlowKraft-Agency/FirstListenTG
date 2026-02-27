'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function PayoutRequestButton({ amount }: { amount: number }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRequest = async () => {
        if (amount < 5000) {
            setError("Le montant minimum de retrait est de 5000 FCFA.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Dans une vraie app, on appellerait une API pour créer la demande de retrait
            const res = await fetch('/api/payment/payout', {
                method: 'POST',
                body: JSON.stringify({ amount })
            });

            if (!res.ok) throw new Error("Erreur lors de la demande");

            setSuccess(true);
        } catch (err) {
            setError("Une erreur est survenue lors de la demande de retrait. Veuillez réessayer plus tard.");
        }
        setLoading(false);
    };

    if (success) {
        return (
            <div style={{ padding: '1rem', background: 'var(--primary-alpha-10)', color: 'var(--primary-color)', borderRadius: '0.5rem', fontWeight: 600 }}>
                Votre demande de retrait a été envoyée ! Elle sera traitée sous 24 à 48h.
            </div>
        );
    }

    return (
        <div>
            {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

            <button
                onClick={handleRequest}
                disabled={loading || amount < 5000}
                className="btn btn-primary"
                style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    padding: '1rem', width: '100%', maxWidth: '300px', fontSize: '1rem',
                    opacity: (loading || amount < 5000) ? 0.7 : 1, cursor: (loading || amount < 5000) ? 'not-allowed' : 'pointer'
                }}
            >
                {loading ? (
                    <div style={{ width: '20px', height: '20px', border: '3px solid rgba(0,0,0,0.1)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                ) : (
                    <>Demander le transfert <ArrowRight size={20} /></>
                )}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
