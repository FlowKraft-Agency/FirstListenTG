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

    const artistPayouts: Record<string, { artist: any, totalAmount: number, transactionIds: string[] }> = {};

    pendingTransactions.forEach(tx => {
        if (!tx.track || !tx.track.artist) return;
        const artist = tx.track.artist;
        if (!artistPayouts[artist.id]) {
            artistPayouts[artist.id] = { artist, totalAmount: 0, transactionIds: [] };
        }
        const cut = Math.floor(tx.amount * 0.8);
        artistPayouts[artist.id].totalAmount += cut;
        artistPayouts[artist.id].transactionIds.push(tx.id);
    });

    const payoutsList = Object.values(artistPayouts);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
            <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, margin: 0 }}>Paiements Artistes</h1>
                <p style={{ color: 'var(--text-muted)', margin: 0, marginTop: 'var(--space-xs)' }}>Gérez les reversements des ventes vers les numéros Mobile Money des artistes (80% des revenus).</p>
            </div>

            <div className="data-table-wrapper">
                {payoutsList.length === 0 ? (
                    <div className="empty-state" style={{ padding: 'var(--space-3xl)' }}>
                        <CheckCircle size={48} className="empty-state__icon" style={{ color: 'var(--primary-color)', opacity: 0.5 }} />
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: 'var(--space-sm)' }}>Tout est payé !</h3>
                        <p className="empty-state__text">Aucun reversement en attente.</p>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Artiste</th>
                                <th>Téléphone (MoMo)</th>
                                <th>Montant Dû</th>
                                <th style={{ textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payoutsList.map(payout => (
                                <PayoutRow key={payout.artist.id} payout={payout} />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
