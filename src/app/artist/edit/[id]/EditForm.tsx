"use client";

import { useState } from "react";
import { editTrack } from "../../actions";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditForm({ track }: { track: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);

        try {
            const result = await editTrack(track.id, formData);
            if (result.error) {
                setError(result.error);
            } else {
                router.push("/artist");
                router.refresh();
            }
        } catch (err: any) {
            setError("Erreur lors de la modification.");
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Link href="/artist" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '1rem' }}>
                <ArrowLeft size={16} /> Retour au studio
            </Link>

            {error && <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '0.5rem' }}>{error}</div>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600 }}>Titre du morceau *</label>
                <input name="title" defaultValue={track.title} required type="text" style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--glass-icon-bg)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600 }}>Nom d'artiste</label>
                <input name="artistName" defaultValue={track.artistName || ""} type="text" style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--glass-icon-bg)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600 }}>Image de couverture (URL)</label>
                <input name="coverImage" defaultValue={track.coverImage || ""} type="url" style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--glass-icon-bg)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 600 }}>Prix Écoute (FCFA)</label>
                    <input name="priceStream" defaultValue={track.priceStream} type="number" required style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--glass-icon-bg)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 600 }}>Prix Téléchargement (FCFA)</label>
                    <input name="priceDownload" defaultValue={track.priceDownload} type="number" required style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--glass-icon-bg)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
                </div>
            </div>

            <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', background: 'var(--primary-color)', color: '#000', fontWeight: 700, borderRadius: '0.5rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: '1rem' }}>
                {loading ? (
                    <div style={{ width: '20px', height: '20px', border: '3px solid rgba(0,0,0,0.1)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                ) : (
                    <><Save size={20} /> Sauvegarder les modifications</>
                )}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </form>
    );
}
