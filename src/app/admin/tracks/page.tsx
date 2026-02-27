import { prisma } from "@/lib/prisma";
import TrackRow from "./TrackRow";
import { CheckCircle } from "lucide-react";

export default async function AdminTracksPage() {
    const pendingTracks = await prisma.track.findMany({
        where: { status: "PENDING" },
        include: { artist: true },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
            <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, margin: 0 }}>Modération des Sons</h1>
                <p style={{ color: 'var(--text-muted)', margin: 0, marginTop: 'var(--space-xs)' }}>Vérifiez et validez les nouveaux morceaux envoyés par les artistes.</p>
            </div>

            <div className="data-table-wrapper">
                {pendingTracks.length === 0 ? (
                    <div className="empty-state" style={{ padding: 'var(--space-3xl)' }}>
                        <CheckCircle size={48} className="empty-state__icon" style={{ color: 'var(--primary-color)', opacity: 0.5 }} />
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: 'var(--space-sm)' }}>Tout est à jour !</h3>
                        <p className="empty-state__text">Aucun nouveau morceau en attente de modération.</p>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Cover</th>
                                <th>Morceau</th>
                                <th>Artiste</th>
                                <th>Prix (Stream / DL)</th>
                                <th>Aperçu Audio</th>
                                <th style={{ textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingTracks.map(track => (
                                <TrackRow key={track.id} track={track} />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
