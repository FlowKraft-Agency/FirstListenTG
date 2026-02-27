"use client";
import { useState, useRef } from "react";
import { updateProfile } from "./actions";
import { User as UserIcon, Upload, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ProfileEditForm({ user }: { user: any }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [previewUrl, setPreviewUrl] = useState<string | null>(user.image || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);
        const formData = new FormData(e.currentTarget);

        try {
            const result = await updateProfile(formData);
            if (result.error) {
                setError(result.error);
            } else {
                setSuccess(true);
            }
        } catch (err: any) {
            setError("Erreur lors de la mise à jour.");
        }
        setLoading(false);
    };

    return (
        <div className="glass-card" style={{ maxWidth: '600px' }}>
            {success && (
                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--primary-alpha-10)', color: 'var(--success-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={20} />
                    Profil mis à jour avec succès!
                </div>
            )}

            {error && (
                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Section Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), #222)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {previewUrl ? (
                            <img src={previewUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <UserIcon size={40} color="#000" />
                        )}
                    </div>
                    <div>
                        <input
                            type="file"
                            name="avatarFile"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="btn btn-secondary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Upload size={16} /> Changer d'avatar
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="name" style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Nom d'affichage</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        defaultValue={user.name || ""}
                        placeholder="Ex: John Doe"
                        style={{ background: 'var(--glass-icon-bg)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '1rem', borderRadius: '8px', width: '100%', outline: 'none' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="email" style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Adresse Email</label>
                    <input
                        id="email"
                        type="email"
                        defaultValue={user.email || ""}
                        style={{ background: 'var(--glass-icon-bg)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '1rem', borderRadius: '8px', width: '100%', outline: 'none', opacity: 0.6 }}
                        disabled
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>L'email est géré par votre fournisseur de connexion (Google).</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="phone" style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Numéro Mobile Money par défaut</label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        defaultValue={user.phone || ""}
                        placeholder="+228 9X XX XX XX"
                        style={{ background: 'var(--glass-icon-bg)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '1rem', borderRadius: '8px', width: '100%', outline: 'none' }}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ce numéro sera pré-rempli lors de vos futurs achats de tokens.</span>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {loading ? 'Sauvegarde...' : <>Sauvegarder <ArrowRight size={16} /></>}
                    </button>
                    <Link href="/profile" className="btn btn-secondary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        Annuler
                    </Link>
                </div>

            </form>
        </div>
    );
}
