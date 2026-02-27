import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DollarSign, CheckCircle, Clock, PlusCircle } from "lucide-react";
import TrackActionRow from "./TrackActionRow";
import Link from "next/link";

export default async function ArtistDashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) return null;
    const artistId = (session.user as any).id;

    const tracks = await prisma.track.findMany({
        where: { artistId },
        include: { transactions: { where: { status: "SUCCESS" } } }
    });

    const approvedTracks = tracks.filter(t => t.status === "APPROVED").length;
    const pendingTracks = tracks.filter(t => t.status === "PENDING").length;

    let totalRevenue = 0;
    let recentSales: any[] = [];

    tracks.forEach(track => {
        track.transactions.forEach(tx => {
            // L'artiste touche 80%
            totalRevenue += Math.floor(tx.amount * 0.8);
            recentSales.push({ ...tx, trackTitle: track.title, trackCover: track.coverImage });
        });
    });

    recentSales.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    recentSales = recentSales.slice(0, 10); // 10 dernières ventes

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Espace Artiste</h1>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Statistiques et revenus de vos morceaux.</p>
                </div>
                <Link href="/artist/upload" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', textDecoration: 'none' }}>
                    <PlusCircle size={20} />
                    Nouveau Son
                </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Mes Gains (Net)</span>
                        <div style={{ padding: '0.5rem', background: 'var(--primary-alpha-10)', borderRadius: '0.5rem', color: 'var(--primary-color)' }}>
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{totalRevenue} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>FCFA</span></span>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Sons Publiés (Validés)</span>
                        <div style={{ padding: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', color: '#3b82f6' }}>
                            <CheckCircle size={20} />
                        </div>
                    </div>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{approvedTracks}</span>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-muted)' }}>En Attente de Modération</span>
                        <div style={{ padding: '0.5rem', background: 'rgba(234, 179, 8, 0.1)', borderRadius: '0.5rem', color: '#eab308' }}>
                            <Clock size={20} />
                        </div>
                    </div>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{pendingTracks}</span>
                </div>
            </div>

            <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 1rem 0' }}>Mes Morceaux (Gestion)</h2>
                <div className="glass-panel" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                    {tracks.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <p style={{ margin: 0 }}>Vous n'avez encore publié aucun morceau.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                                <thead>
                                    <tr style={{ background: 'var(--glass-icon-bg)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                        <th style={{ padding: '1rem' }}>Pochette</th>
                                        <th style={{ padding: '1rem' }}>Titre</th>
                                        <th style={{ padding: '1rem' }}>Prix (Stream / Définitif)</th>
                                        <th style={{ padding: '1rem' }}>Statut</th>
                                        <th style={{ padding: '1rem', textAlign: 'center' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tracks.map(track => (
                                        <TrackActionRow key={track.id} track={track} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 1rem 0' }}>Dernières ventes</h2>
                <div className="glass-panel" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                    {recentSales.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <p style={{ margin: 0 }}>Aucune vente pour le moment.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                                <thead>
                                    <tr style={{ background: 'var(--glass-icon-bg)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                        <th style={{ padding: '1rem' }}>Date</th>
                                        <th style={{ padding: '1rem' }}>Morceau</th>
                                        <th style={{ padding: '1rem' }}>Montant Brut</th>
                                        <th style={{ padding: '1rem' }}>Votre Part (80%)</th>
                                        <th style={{ padding: '1rem' }}>Statut Reversement</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentSales.map(sale => (
                                        <tr key={sale.id} style={{ borderBottom: '1px solid var(--glass-icon-bg)' }}>
                                            <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{sale.createdAt.toLocaleDateString('fr-FR')}</td>
                                            <td style={{ padding: '1rem', fontWeight: 600 }}>{sale.trackTitle}</td>
                                            <td style={{ padding: '1rem' }}>{sale.amount} FCFA</td>
                                            <td style={{ padding: '1rem', color: 'var(--primary-color)', fontWeight: 700 }}>{Math.floor(sale.amount * 0.8)} FCFA</td>
                                            <td style={{ padding: '1rem' }}>
                                                {sale.payoutStatus === 'PAID' ?
                                                    <span style={{ color: 'var(--primary-color)', fontSize: '0.875rem', fontWeight: 600 }}>Transféré (MoMo)</span> :
                                                    <span style={{ color: '#eab308', fontSize: '0.875rem', fontWeight: 600 }}>En attente</span>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
