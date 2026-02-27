import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function SecurityPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        redirect("/login");
    }

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
                    <h1 className="title" style={{ fontWeight: 'bold' }}>Sécurité</h1>
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Gérez les accès à votre compte.</p>

                <div className="glass-card" style={{ maxWidth: '800px', marginBottom: '2rem' }}>

                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Méthodes de connexion</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Identifiants rattachés à votre compte.</p>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--glass-icon-bg)', padding: '1rem', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '32px', height: '32px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p style={{ fontWeight: 'bold' }}>Google Workspace</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{session.user.email}</p>
                                </div>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--success-color)' }}>Connecté</span>
                        </div>
                    </div>

                    <div style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Déconnexion globale</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Si vous suspectez que votre compte a été compromis sur un autre appareil.</p>
                        <button className="btn btn-secondary" style={{ color: 'var(--error-color)', borderColor: 'var(--error-color)' }}>Déconnecter tous les appareils</button>
                    </div>

                </div>

                <div className="glass-card" style={{ maxWidth: '800px', borderColor: 'rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--error-color)', marginBottom: '1rem' }}>
                        <ShieldAlert size={24} />
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Zone de danger</h3>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>La suppression de compte est irréversible et effacera toutes vos musiques achetées.</p>
                    <button className="btn btn-secondary" style={{ color: '#fff', background: 'var(--error-color)', borderColor: 'var(--error-color)' }}>Supprimer mon compte</button>
                </div>

            </main>
        </div>
    );
}
