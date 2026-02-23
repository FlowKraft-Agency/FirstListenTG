import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import { User as UserIcon } from "lucide-react";

export default async function ProfileEditPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        redirect("/login");
    }

    // NOTE: En production, nous utiliserions un Server Action pour traiter ce formulaire et modifier l'entité User en base Prisma.

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <DashboardSidebar />

            {/* Main Content */}
            <main className="dashboard-main">
                <h1 className="title" style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Modifier le profil</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Mettez à jour vos informations publiques et de contact.</p>

                <div className="glass-card" style={{ maxWidth: '600px' }}>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), #222)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <UserIcon size={40} color="#000" />
                        </div>
                        <button className="btn btn-secondary">Changer d'avatar</button>
                    </div>

                    <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label htmlFor="name" style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Nom d'affichage</label>
                            <input
                                id="name"
                                type="text"
                                defaultValue={session.user.name || ""}
                                placeholder="Ex: John Doe"
                                style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', color: '#fff', padding: '1rem', borderRadius: '8px', width: '100%', outline: 'none' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label htmlFor="email" style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Adresse Email</label>
                            <input
                                id="email"
                                type="email"
                                defaultValue={session.user.email || ""}
                                style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', color: '#fff', padding: '1rem', borderRadius: '8px', width: '100%', outline: 'none' }}
                                disabled
                            />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>L'email est géré par votre fournisseur de connexion (Google).</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label htmlFor="phone" style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Numéro Mobile Money par défaut</label>
                            <input
                                id="phone"
                                type="tel"
                                placeholder="+228 9X XX XX XX"
                                style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', color: '#fff', padding: '1rem', borderRadius: '8px', width: '100%', outline: 'none' }}
                            />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ce numéro sera pré-rempli lors de vos futurs achats de tokens.</span>
                        </div>

                        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                            <button type="button" className="btn btn-primary">Sauvegarder</button>
                            <a href="/profile" className="btn btn-secondary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>Annuler</a>
                        </div>

                    </form>

                </div>

            </main>
        </div>
    );
}
