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
            totalRevenue += Math.floor(tx.amount * 0.8);
            recentSales.push({ ...tx, trackTitle: track.title, trackCover: track.coverImage });
        });
    });

    recentSales.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    recentSales = recentSales.slice(0, 10);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, margin: 0 }}>Espace Artiste</h1>
                    <p style={{ color: 'var(--text-muted)', margin: 0, marginTop: 'var(--space-xs)' }}>Statistiques et revenus de vos morceaux.</p>
                </div>
                <Link href="/artist/upload" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontSize: '0.9375rem' }}>
                    <PlusCircle size={20} />
                    Nouveau Son
                </Link>
            </div>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-lg)' }}>
                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="stat-card__label">Mes Gains (Net)</span>
                        <div className="stat-card__icon" style={{ background: 'var(--primary-alpha-10)', color: 'var(--primary-color)' }}>
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <div>
                        <span className="stat-card__value" style={{ color: 'var(--primary-color)' }}>{totalRevenue}</span>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginLeft: 'var(--space-sm)' }}>FCFA</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="stat-card__label">Sons Publiés</span>
                        <div className="stat-card__icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                            <CheckCircle size={20} />
                        </div>
                    </div>
                    <span className="stat-card__value">{approvedTracks}</span>
                </div>

                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="stat-card__label">En Modération</span>
                        <div className="stat-card__icon" style={{ background: 'rgba(234, 179, 8, 0.1)', color: '#eab308' }}>
                            <Clock size={20} />
                        </div>
                    </div>
                    <span className="stat-card__value">{pendingTracks}</span>
                </div>
            </div>

            {/* Tracks table */}
            <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, margin: '0 0 var(--space-md) 0' }}>Mes Morceaux</h2>
                <div className="data-table-wrapper">
                    {tracks.length === 0 ? (
                        <div className="empty-state" style={{ padding: 'var(--space-2xl)' }}>
                            <p className="empty-state__text">Vous n'avez encore publié aucun morceau.</p>
                        </div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Pochette</th>
                                    <th>Titre</th>
                                    <th>Prix (Stream / Définitif)</th>
                                    <th>Statut</th>
                                    <th style={{ textAlign: 'center' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tracks.map(track => (
                                    <TrackActionRow key={track.id} track={track} />
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Recent sales table */}
            <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, margin: '0 0 var(--space-md) 0' }}>Dernières ventes</h2>
                <div className="data-table-wrapper">
                    {recentSales.length === 0 ? (
                        <div className="empty-state" style={{ padding: 'var(--space-2xl)' }}>
                            <p className="empty-state__text">Aucune vente pour le moment.</p>
                        </div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Morceau</th>
                                    <th>Montant Brut</th>
                                    <th>Votre Part (80%)</th>
                                    <th>Reversement</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentSales.map(sale => (
                                    <tr key={sale.id}>
                                        <td>{sale.createdAt.toLocaleDateString('fr-FR')}</td>
                                        <td style={{ fontWeight: 600 }}>{sale.trackTitle}</td>
                                        <td>{sale.amount} FCFA</td>
                                        <td style={{ color: 'var(--primary-color)', fontWeight: 700 }}>{Math.floor(sale.amount * 0.8)} FCFA</td>
                                        <td>
                                            {sale.payoutStatus === 'PAID' ? (
                                                <span className="badge badge--success">Transféré</span>
                                            ) : (
                                                <span className="badge badge--warning">En attente</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
