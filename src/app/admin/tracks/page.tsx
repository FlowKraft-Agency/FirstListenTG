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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Modération des Sons</h1>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Vérifiez et validez les nouveaux morceaux envoyés par les artistes.</p>
            </div>

            <div className="glass-panel" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                {pendingTracks.length === 0 ? (
                    <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <CheckCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.5, color: 'var(--primary-color)' }} />
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>Tout est à jour !</h3>
                        <p style={{ margin: 0 }}>Aucun nouveau morceau en attente de modération.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                            <thead>
                                <tr style={{ background: 'var(--glass-icon-bg)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                    <th style={{ padding: '1rem' }}>Cover</th>
                                    <th style={{ padding: '1rem' }}>Morceau</th>
                                    <th style={{ padding: '1rem' }}>Artiste</th>
                                    <th style={{ padding: '1rem' }}>Prix (Stream / DL)</th>
                                    <th style={{ padding: '1rem' }}>Aperçu Audio</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingTracks.map(track => (
                                    <TrackRow key={track.id} track={track} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
