import { prisma } from "@/lib/prisma";
import UserRow from "./UserRow";

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { id: "desc" }
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Gestion des Utilisateurs</h1>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Attribuez des rôles aux utilisateurs de la plateforme (Ex: Promouvoir un artiste).</p>
            </div>

            <div className="glass-panel" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                <th style={{ padding: '1rem' }}>Avatar</th>
                                <th style={{ padding: '1rem' }}>Nom</th>
                                <th style={{ padding: '1rem' }}>Email</th>
                                <th style={{ padding: '1rem' }}>Rôle</th>
                                <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <UserRow key={user.id} user={user} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
