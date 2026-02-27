'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, User, Music, EyeOff, Eye, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [isArtist, setIsArtist] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role: isArtist ? "ARTIST" : "USER"
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Une erreur est survenue lors de l'inscription.");
            }

            setSuccessMessage("Compte créé avec succès ! Redirection en cours...");

            // Connecter l'utilisateur automatiquement après l'inscription
            const loginRes = await signIn("credentials", {
                redirect: false,
                email,
                password
            });

            if (loginRes?.error) {
                throw new Error("Erreur lors de la connexion automatique.");
            }

            // Rediriger vers l'espace approprié
            setTimeout(() => {
                router.push(isArtist ? "/artist" : "/library");
            }, 1500);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        signIn("google", { callbackUrl: isArtist ? "/artist" : "/library" });
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--abstract-gradient)',
            padding: '1rem',
            overflowY: 'auto'
        }}>
            <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2.5rem', position: 'relative', margin: 'auto' }}>
                <Link href="/" style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <ArrowLeft size={16} /> Accueil
                </Link>

                <div style={{ textAlign: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Créer un compte</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Rejoignez-nous et profitez des exclusivités</p>
                </div>

                {/* Account Type Toggle */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                    <button
                        type="button"
                        onClick={() => setIsArtist(false)}
                        style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem',
                            borderRadius: '1rem', cursor: 'pointer', transition: 'all 0.2s',
                            background: !isArtist ? 'var(--primary-alpha-10)' : 'var(--bg-color)',
                            border: !isArtist ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                            color: !isArtist ? 'var(--text-main)' : 'var(--text-muted)'
                        }}
                    >
                        <User size={24} color={!isArtist ? "var(--primary-color)" : "currentColor"} />
                        <span style={{ fontWeight: 600 }}>Auditeur</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsArtist(true)}
                        style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem',
                            borderRadius: '1rem', cursor: 'pointer', transition: 'all 0.2s',
                            background: isArtist ? 'var(--primary-alpha-10)' : 'var(--bg-color)',
                            border: isArtist ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                            color: isArtist ? 'var(--text-main)' : 'var(--text-muted)'
                        }}
                    >
                        <Music size={24} color={isArtist ? "var(--primary-color)" : "currentColor"} />
                        <span style={{ fontWeight: 600 }}>Artiste</span>
                    </button>
                </div>

                {isArtist && (
                    <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '1rem', padding: '1rem', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CheckCircle2 size={16} color="var(--primary-color)" /> Vendez vos exclusivités directement.
                        </p>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CheckCircle2 size={16} color="var(--primary-color)" /> Gardez le contrôle total sur vos prix.
                        </p>
                    </div>
                )}

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{isArtist ? "Nom d'artiste" : "Nom complet"}</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', background: 'var(--glass-icon-bg)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                            placeholder={isArtist ? "DJ XxX" : "John Doe"}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Adresse Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', background: 'var(--glass-icon-bg)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                            placeholder="vous@exemple.com"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Mot de passe</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ width: '100%', padding: '1rem', paddingRight: '3rem', borderRadius: '0.75rem', background: 'var(--glass-icon-bg)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                                placeholder="••••••••"
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {error && <div style={{ color: '#ef4444', fontSize: '0.875rem', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem' }}>{error}</div>}
                    {successMessage && <div style={{ color: 'var(--primary-color)', fontSize: '0.875rem', padding: '0.5rem', background: 'var(--primary-alpha-10)', borderRadius: '0.5rem' }}>{successMessage}</div>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1.25rem', marginTop: '1rem', fontSize: '1rem', display: 'flex', justifyContent: 'center' }}
                    >
                        {isLoading ? (
                            <div style={{ width: '24px', height: '24px', border: '3px solid rgba(0,0,0,0.1)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        ) : (
                            "Créer mon compte"
                        )}
                    </button>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0', color: 'var(--text-muted)' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                    <span style={{ padding: '0 1rem', fontSize: '0.875rem' }}>Ou</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button
                        onClick={handleGoogleLogin}
                        className="btn btn-secondary"
                        style={{ width: '100%', background: '#fff', color: '#000', border: 'none', padding: '1.25rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                        </svg>
                        Continuer avec Google
                    </button>
                </div>

                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        Déjà un compte ? <Link href="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>Se connecter</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
