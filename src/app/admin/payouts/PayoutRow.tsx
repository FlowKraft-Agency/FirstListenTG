"use client";
import { markPayoutAsPaid } from "./actions";
import { Check } from "lucide-react";
import { useState } from "react";

export default function PayoutRow({ payout }: { payout: any }) {
    const [loading, setLoading] = useState(false);

    const handlePaid = async () => {
        setLoading(true);
        await markPayoutAsPaid(payout.transactionIds);
        setLoading(false);
    };

    return (
        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', opacity: loading ? 0.5 : 1 }}>
            <td style={{ padding: '1rem', fontWeight: 600 }}>{payout.artist.name}</td>
            <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{payout.artist.phone || 'Non renseigné'}</td>
            <td style={{ padding: '1rem', color: 'var(--primary-color)', fontWeight: 800 }}>{payout.totalAmount} FCFA</td>
            <td style={{ padding: '1rem', textAlign: 'center' }}>
                <button onClick={handlePaid} disabled={loading} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-color)', color: '#000', border: 'none', padding: '0.5rem 1rem' }}>
                    <Check size={18} /> Marquer Payé
                </button>
            </td>
        </tr>
    );
}
