import { prisma } from "@/lib/prisma";
import PayoutRow from "./PayoutRow";
import { CheckCircle } from "lucide-react";

export default async function AdminPayoutsPage() {
    const pendingTransactions = await prisma.transaction.findMany({
        where: {
            status: "SUCCESS",
            payoutStatus: "PENDING",
            trackId: { not: null }
        },
        include: {
            track: { include: { artist: true } }
        },
        orderBy: { createdAt: "desc" }
    });

    // Group by Artist
    const artistPayouts: Record<string, { artist: any, totalAmount: number, transactionIds: string[] }> = {};

    pendingTransactions.forEach(tx => {
        if (!tx.track || !tx.track.artist) return;
        const artist = tx.track.artist;
        if (!artistPayouts[artist.id]) {
            artistPayouts[artist.id] = { artist, totalAmount: 0, transactionIds: [] };
        }
        // Calculate the cut (e.g., 80% to artist)
        const cut = Math.floor(tx.amount * 0.8);
        artistPayouts[artist.id].totalAmount += cut;
        artistPayouts[artist.id].transactionIds.push(tx.id);
    });

    const payoutsList = Object.values(artistPayouts);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Paiements Artistes</h1>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Gérez les reversements des ventes vers les numéros Mobile Money des artistes (80% des revenus).</p>
            </div>

            <div className="glass-panel" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                {payoutsList.length === 0 ? (
                    <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <CheckCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.5, color: 'var(--primary-color)' }} />
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>Tout est payé !</h3>
                        <p style={{ margin: 0 }}>Aucun reversement en attente.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ background: 'var(--glass-icon-bg)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                    <th style={{ padding: '1rem' }}>Artiste</th>
                                    <th style={{ padding: '1rem' }}>Téléphone (MoMo)</th>
                                    <th style={{ padding: '1rem' }}>Montant Dû</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payoutsList.map(payout => (
                                    <PayoutRow key={payout.artist.id} payout={payout} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
