import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import { CreditCard, Download, ExternalLink, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function BillingPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            transactions: {
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <DashboardSidebar />

            {/* Main Content */}
            <main className="dashboard-main">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <Link href="/profile" className="mobile-only btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                        <ArrowLeft size={16} />
                    </Link>
                    <h1 className="title" style={{ fontWeight: 'bold' }}>Facturation</h1>
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Historique de vos paiements et moyens de paiement.</p>

                <div className="glass-card" style={{ maxWidth: '800px', marginBottom: '2rem' }}>

                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Moyen de paiement favori</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Utilisé pour vos achats rapides "One-Click".</p>
                        </div>
                        <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CreditCard size={16} /> Ajouter
                        </button>
                    </div>

                    <div style={{ padding: '1.5rem' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center' }}>Aucun moyen de paiement enregistré.</p>
                    </div>

                </div>

                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', marginTop: '3rem' }}>Historique des transactions</h2>

                <div className="glass-card" style={{ maxWidth: '800px', padding: 0, overflow: 'hidden' }}>

                    {user?.transactions.map(tx => (
                        <div key={tx.id} style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ padding: '1rem', background: 'rgba(13, 242, 89, 0.1)', borderRadius: '12px', color: 'var(--primary-color)' }}>
                                    <CreditCard size={24} />
                                </div>
                                <div>
                                    <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Ticket 1-Écoute</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>Tx: {tx.id.split('-')[0].toUpperCase()} • {new Date(tx.createdAt).toLocaleDateString('fr-FR')}</p>
                                </div>
                            </div>

                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                <p style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{tx.amount} FCFA</p>
                                <span style={{ fontSize: '10px', background: 'rgba(13, 242, 89, 0.2)', color: 'var(--success-color)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{tx.status}</span>
                            </div>
                        </div>
                    ))}

                    {(!user?.transactions || user.transactions.length === 0) && (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            Aucune transaction trouvée.
                        </div>
                    )}

                </div>

            </main>
        </div>
    );
}
