import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Users, Music, DollarSign } from "lucide-react";

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions);

    // Statistiques globales
    const totalUsers = await prisma.user.count();
    const totalTracks = await prisma.track.count();

    const transactions = await prisma.transaction.findMany({
        where: { status: "SUCCESS" }
    });

    const totalRevenue = transactions.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Vue d'ensemble</h1>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Bienvenue dans l'espace d'administration, {session?.user?.name}.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>

                {/* Card 1 */}
                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Chiffre d'Affaire (Total)</span>
                        <div style={{ padding: '0.5rem', background: 'var(--primary-alpha-10)', borderRadius: '0.5rem', color: 'var(--primary-color)' }}>
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{totalRevenue} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>FCFA</span></span>
                </div>

                {/* Card 2 */}
                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Utilisateurs Inscrits</span>
                        <div style={{ padding: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', color: '#3b82f6' }}>
                            <Users size={20} />
                        </div>
                    </div>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{totalUsers}</span>
                </div>

                {/* Card 3 */}
                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Morceaux Uploadés</span>
                        <div style={{ padding: '0.5rem', background: 'rgba(147, 51, 234, 0.1)', borderRadius: '0.5rem', color: '#9333ea' }}>
                            <Music size={20} />
                        </div>
                    </div>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{totalTracks}</span>
                </div>

            </div>
        </div>
    );
}
