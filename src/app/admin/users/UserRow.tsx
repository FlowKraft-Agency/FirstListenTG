"use client";
import { updateUserRole } from "./actions";
import { useState } from "react";
import { Save } from "lucide-react";

export default function UserRow({ user }: { user: any }) {
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState(user.role);
    const hasChanged = role !== user.role;

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateUserRole(user.id, role);
        } catch (e) {
            alert("Erreur lors de la mise à jour");
            setRole(user.role);
        }
        setLoading(false);
    };

    return (
        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', opacity: loading ? 0.5 : 1 }}>
            <td style={{ padding: '1rem' }}>
                {user.image ? <img src={user.image} style={{ width: '40px', height: '40px', borderRadius: '50%' }} alt="Avatar" /> : <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface-color)' }} />}
            </td>
            <td style={{ padding: '1rem', fontWeight: 600 }}>{user.name || 'Anonyme'}</td>
            <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{user.email}</td>
            <td style={{ padding: '1rem' }}>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={loading}
                    style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                >
                    <option value="USER">Utilisateur (USER)</option>
                    <option value="PREMIUM">Premium (PREMIUM)</option>
                    <option value="ARTIST">Artiste (ARTIST)</option>
                    <option value="ADMIN">Admin (ADMIN)</option>
                </select>
            </td>
            <td style={{ padding: '1rem', textAlign: 'center' }}>
                {hasChanged && (
                    <button onClick={handleSave} disabled={loading} style={{ background: 'var(--primary-color)', color: '#000', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                        <Save size={16} /> Enregistrer
                    </button>
                )}
            </td>
        </tr>
    );
}
