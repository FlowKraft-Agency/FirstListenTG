import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardSidebar from "@/components/DashboardSidebar";
import { DollarSign, ArrowRight } from "lucide-react";
import PayoutRequestButton from "./PayoutRequestButton"; // Client component pour gérer l'état de chargement

export default async function PayoutsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) return null;
    const artistId = (session.user as any).id;

    // Récupérer le user avec son numéro Mobile Money
    const user = await prisma.user.findUnique({
        where: { id: artistId },
        select: { phone: true }
    });

    const tracks = await prisma.track.findMany({
        where: { artistId },
        include: {
            transactions: {
                where: { status: "SUCCESS" }
            }
        }
    });

    let totalEarned = 0;
    let pendingPayout = 0;
    let paidOut = 0;

    tracks.forEach(track => {
        track.transactions.forEach(tx => {
            const artistShare = Math.floor(tx.amount * 0.8);
            totalEarned += artistShare;
            if (tx.payoutStatus === "NONE" || tx.payoutStatus === "PENDING") {
                pendingPayout += artistShare;
            } else if (tx.payoutStatus === "PAID") {
                paidOut += artistShare;
            }
        });
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Gains & Retraits</h1>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Gérez vos revenus générés sur FirstListen.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--shadow-primary-glow)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Solde Disponible</span>
                        <div style={{ padding: '0.5rem', background: 'var(--primary-alpha-10)', borderRadius: '0.5rem', color: 'var(--primary-color)' }}>
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-color)' }}>{pendingPayout} <span style={{ fontSize: '1rem' }}>FCFA</span></span>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Déjà Retiré</span>
                        <div style={{ padding: '0.5rem', background: 'var(--glass-icon-bg)', borderRadius: '0.5rem', color: 'var(--text-main)' }}>
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{paidOut} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>FCFA</span></span>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0' }}>Demander un retrait</h2>

                {user?.phone ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                            Vos fonds seront transférés vers le numéro Mobile Money associé à votre compte : <strong style={{ color: 'var(--text-main)' }}>{user.phone}</strong>
                        </p>

                        <PayoutRequestButton amount={pendingPayout} />

                        <p style={{ fontSize: '0.875rem', color: '#eab308', margin: 0 }}>
                            Note : Un montant minimum de 5000 FCFA est requis pour initier un retrait.
                        </p>
                    </div>
                ) : (
                    <div style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '0.5rem' }}>
                        <p style={{ color: '#ef4444', margin: 0, marginBottom: '1rem' }}>
                            Vous n'avez pas encore défini de numéro Mobile Money pour recevoir vos paiements.
                        </p>
                        <a href="/profile/edit" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--glass-icon-bg)', color: 'var(--text-main)', textDecoration: 'none', borderRadius: '0.5rem' }}>
                            Configurer mon numéro <ArrowRight size={16} />
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
