import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardSidebar from "@/components/DashboardSidebar";
import { notFound, redirect } from "next/navigation";
import { BarChart2, PlayCircle, Download, ArrowLeft, DollarSign } from "lucide-react";
import Link from "next/link";

export default async function TrackAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) return redirect("/login");

    const artistId = (session.user as any).id;
    const track = await prisma.track.findUnique({
        where: { id },
        include: {
            transactions: {
                where: { status: "SUCCESS" },
                include: { token: true }
            }
        }
    });

    if (!track || track.artistId !== artistId) {
        return notFound();
    }

    // Calcul des revenus
    let totalRevenue = 0;
    let streamRevenue = 0;
    let downloadRevenue = 0;

    track.transactions.forEach(tx => {
        const artistShare = Math.floor(tx.amount * 0.8);
        totalRevenue += artistShare;
        if (tx.token?.accessType === "TEMPORARY" || tx.token?.accessType === "STREAM") {
            streamRevenue += artistShare;
        } else {
            downloadRevenue += artistShare;
        }
    });

    const totalEngagements = track.streamsCount + track.downloadsCount;
    const streamPercentage = totalEngagements > 0 ? Math.round((track.streamsCount / totalEngagements) * 100) : 0;
    const downloadPercentage = totalEngagements > 0 ? Math.round((track.downloadsCount / totalEngagements) * 100) : 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <Link href="/artist" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '1rem', transition: 'color 0.2s', fontWeight: 500 }} className="hover-text-white">
                    <ArrowLeft size={16} /> Retour au studio
                </Link>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <BarChart2 size={32} color="var(--primary-color)" /> Statistiques : {track.title}
                </h1>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Analysez les performances et revenus de ce morceau.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--shadow-primary-glow)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Total Généré (Net)</span>
                        <div style={{ padding: '0.5rem', background: 'var(--primary-alpha-10)', borderRadius: '0.5rem', color: 'var(--primary-color)' }}>
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-color)' }}>{totalRevenue} <span style={{ fontSize: '1rem' }}>FCFA</span></span>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Écoutes Uniques</span>
                        <div style={{ padding: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', color: '#3b82f6' }}>
                            <PlayCircle size={20} />
                        </div>
                    </div>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, display: 'block', marginBottom: '0.5rem' }}>{track.streamsCount}</span>
                    <span style={{ fontSize: '0.875rem', color: '#3b82f6', fontWeight: 600 }}>{streamRevenue} FCFA générés</span>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Téléchargements</span>
                        <div style={{ padding: '0.5rem', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '0.5rem', color: '#a855f7' }}>
                            <Download size={20} />
                        </div>
                    </div>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, display: 'block', marginBottom: '0.5rem' }}>{track.downloadsCount}</span>
                    <span style={{ fontSize: '0.875rem', color: '#a855f7', fontWeight: 600 }}>{downloadRevenue} FCFA générés</span>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 1.5rem 0' }}>Répartition des engagements</h2>

                {totalEngagements === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        Aucune donnée d'engagement pour le moment.
                    </div>
                ) : (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                            <span style={{ color: '#3b82f6' }}>Écoutes ({streamPercentage}%)</span>
                            <span style={{ color: '#a855f7' }}>Téléchargements ({downloadPercentage}%)</span>
                        </div>
                        <div style={{ height: '12px', width: '100%', display: 'flex', borderRadius: '9999px', overflow: 'hidden', background: 'var(--glass-icon-bg)' }}>
                            <div style={{ width: `${streamPercentage}%`, background: '#3b82f6', transition: 'width 1s ease-in-out' }}></div>
                            <div style={{ width: `${downloadPercentage}%`, background: '#a855f7', transition: 'width 1s ease-in-out' }}></div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .hover-text-white:hover { color: #ffffff !important; }
            `}</style>
        </div>
    );
}
