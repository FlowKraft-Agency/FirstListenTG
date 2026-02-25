"use client";
import { uploadTrack } from "./actions";
import { useState } from "react";
import { UploadCloud, CheckCircle } from "lucide-react";

export default function UploadPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const formData = new FormData(e.currentTarget);

        try {
            const result = await uploadTrack(formData);
            if (result.error) {
                setError(result.error);
            } else {
                setSuccess(true);
            }
        } catch (err: any) {
            setError("Erreur lors de l'upload.");
        }
        setLoading(false);
    };

    if (success) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <CheckCircle size={64} style={{ margin: '0 auto 1rem', color: '#0df259' }} />
                <h1 style={{ fontSize: '2rem', color: '#fff' }}>Upload réussi !</h1>
                <p>Votre morceau a été envoyé. Il sera disponible publiquement une fois validé par un modérateur.</p>
                <button onClick={() => setSuccess(false)} className="btn btn-secondary" style={{ marginTop: '2rem', padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', cursor: 'pointer' }}>Uploader un autre morceau</button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Publier un Son</h1>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Uploadez votre nouveau morceau de manière sécurisée.</p>
            </div>

            <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {error && <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '0.5rem' }}>{error}</div>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 600 }}>Titre du morceau *</label>
                    <input name="title" required type="text" placeholder="Ex: Midnight Resonance" style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 600 }}>Nom d'artiste (Optionnel)</label>
                    <input name="artistName" type="text" placeholder="Laissez vide pour utiliser votre nom de profil" style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 600 }}>Image de couverture (Optionnel, URL)</label>
                    <input name="coverImage" type="url" placeholder="https://..." style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 600 }}>Fichier Audio (.mp3, .wav) *</label>
                    <input name="audioFile" required type="file" accept="audio/*" style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: 600 }}>Prix Écoute (FCFA)</label>
                        <input name="priceStream" type="number" defaultValue={200} required style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: 600 }}>Prix Téléchargement (FCFA)</label>
                        <input name="priceDownload" type="number" defaultValue={500} required style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                    </div>
                </div>

                <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', background: 'var(--primary-color)', color: '#000', fontWeight: 700, borderRadius: '0.5rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: '1rem' }}>
                    {loading ? "Envoi en cours..." : <><UploadCloud size={20} /> Publier le morceau</>}
                </button>
            </form>
        </div>
    );
}
