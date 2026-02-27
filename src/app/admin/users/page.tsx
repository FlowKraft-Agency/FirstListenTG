import { prisma } from "@/lib/prisma";
import UserRow from "./UserRow";

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { id: "desc" }
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
            <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, margin: 0 }}>Gestion des Utilisateurs</h1>
                <p style={{ color: 'var(--text-muted)', margin: 0, marginTop: 'var(--space-xs)' }}>Attribuez des rôles aux utilisateurs de la plateforme.</p>
            </div>

            <div className="data-table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Avatar</th>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Rôle</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
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
    );
}
