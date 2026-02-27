import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Users, Music, DollarSign } from "lucide-react";

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions);

    const totalUsers = await prisma.user.count();
    const totalTracks = await prisma.track.count();

    const transactions = await prisma.transaction.findMany({
        where: { status: "SUCCESS" }
    });

    const totalRevenue = transactions.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
            <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, margin: 0 }}>Vue d'ensemble</h1>
                <p style={{ color: 'var(--text-muted)', margin: 0, marginTop: 'var(--space-xs)' }}>Bienvenue dans l'espace d'administration, {session?.user?.name}.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-lg)' }}>
                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="stat-card__label">Chiffre d'Affaire</span>
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
                        <span className="stat-card__label">Utilisateurs Inscrits</span>
                        <div className="stat-card__icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                            <Users size={20} />
                        </div>
                    </div>
                    <span className="stat-card__value">{totalUsers}</span>
                </div>

                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="stat-card__label">Morceaux Uploadés</span>
                        <div className="stat-card__icon" style={{ background: 'rgba(147, 51, 234, 0.1)', color: '#9333ea' }}>
                            <Music size={20} />
                        </div>
                    </div>
                    <span className="stat-card__value">{totalTracks}</span>
                </div>
            </div>
        </div>
    );
}
