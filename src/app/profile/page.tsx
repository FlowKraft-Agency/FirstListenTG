import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User as UserIcon } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            tokens: true,
        }
    });

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <DashboardSidebar />

            {/* Main Content */}
            <main className="dashboard-main">

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), #121a14)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {user?.image ? (
                            <img src={user.image} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <UserIcon size={48} color="#000" />
                        )}
                    </div>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{user?.name || 'Utilisateur Anonyme'}</h1>
                        <p style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
                        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                            <span style={{ fontSize: '10px', background: 'var(--primary-alpha-20)', color: 'var(--primary-color)', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{user?.role === 'PREMIUM' ? 'PREMIUM' : 'MEMBRE STANDARD'}</span>
                        </div>
                    </div>
                </div>

                <div className="grid-responsive">
                    <div className="glass-card" style={{ margin: 0 }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Informations
                        </h3>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Nom complet</label>
                            <p>{user?.name}</p>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Email</label>
                            <p>{user?.email}</p>
                        </div>
                        <Link href="/profile/edit" className="btn btn-secondary" style={{ display: 'inline-block', marginTop: '1.5rem', width: '100%', textAlign: 'center' }}>Modifier le profil</Link>
                    </div>

                    <div className="glass-card" style={{ margin: 0 }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                            Statistiques
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sons achetés (V1)</p>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{user?.tokens.length || 0}</p>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Statut compte</p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success-color)' }}>Actif</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Paramètres sur Mobile */}
                <div className="glass-card mobile-only" style={{ flexDirection: 'column', margin: 0, marginTop: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Paramètres & Sécurité</h3>
                    <Link href="/settings/preferences" className="btn btn-secondary" style={{ width: '100%', marginBottom: '0.5rem' }}>Préférences</Link>
                    <Link href="/settings/security" className="btn btn-secondary" style={{ width: '100%', marginBottom: '0.5rem' }}>Sécurité</Link>
                    <Link href="/settings/billing" className="btn btn-secondary" style={{ width: '100%' }}>Facturation</Link>
                </div>

            </main>
        </div>
    );
}
