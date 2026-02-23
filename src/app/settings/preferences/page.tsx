import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function PreferencesPage() {
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
                    <h1 className="title" style={{ fontWeight: 'bold' }}>Préférences</h1>
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Gérez vos préférences de lecture et de notifications.</p>

                <div className="glass-card" style={{ maxWidth: '800px' }}>

                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Thème de l'application</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Même en plein jour, gardez le dark mode activé.</p>
                        </div>
                        <select style={{ background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                            <option>Dark Mode Premium</option>
                        </select>
                    </div>

                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Qualité Audio</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Définissez la qualité par défaut des flux sonores.</p>
                        </div>
                        <select style={{ background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                            <option>Haute Qualité (320kbps)</option>
                            <option>Économie de données</option>
                        </select>
                    </div>

                    <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Notifications de transaction</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Recevez un mail de reçu après chaque achat.</p>
                        </div>
                        <div style={{ width: '40px', height: '24px', background: 'var(--primary-color)', borderRadius: '12px', position: 'relative', cursor: 'pointer' }}>
                            <div style={{ width: '20px', height: '20px', background: '#000', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px' }}></div>
                        </div>
                    </div>

                </div>

                <div style={{ marginTop: '2rem' }}>
                    <button className="btn btn-primary">Enregistrer les préférences</button>
                </div>
            </main>
        </div>
    );
}
