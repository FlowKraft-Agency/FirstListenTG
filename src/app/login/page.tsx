'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password
            });

            if (res?.error) {
                setError("Email ou mot de passe incorrect.");
            } else {
                router.push('/library');
                router.refresh();
            }
        } catch (err: any) {
            setError("Une erreur inattendue est survenue.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        signIn("google", { callbackUrl: "/library" });
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
            <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', textAlign: 'center', position: 'relative', margin: 'auto' }}>
                <Link href="/" style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <ArrowLeft size={16} /> Accueil
                </Link>

                <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(247, 160, 26, 0.1)', borderRadius: '1rem', marginBottom: '1.5rem', marginTop: '1.5rem' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                </div>

                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Connexion</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Connectez-vous pour écouter vos exclusivités</p>

                <form onSubmit={handleCredentialsLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left', marginBottom: '1.5rem' }}>
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

                    {error && <div style={{ color: '#ef4444', fontSize: '0.875rem', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem', textAlign: 'center' }}>{error}</div>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1.25rem', marginTop: '0.5rem', fontSize: '1rem', display: 'flex', justifyContent: 'center' }}
                    >
                        {isLoading ? (
                            <div style={{ width: '24px', height: '24px', border: '3px solid rgba(0,0,0,0.1)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        ) : (
                            "Se connecter"
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
                        style={{
                            width: '100%',
                            background: '#fff',
                            color: '#000',
                            border: 'none',
                            padding: '1.25rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '12px'
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                        </svg>
                        Continuer avec Google
                    </button>

                    <button
                        onClick={() => alert('Apple Login en cours de configuration')}
                        className="btn btn-secondary"
                        style={{
                            width: '100%',
                            background: '#000',
                            color: 'var(--text-main)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            padding: '1.25rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '12px'
                        }}
                    >
                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.05 20.28c-.96.95-2.44.8-4.02 0-1.56-.81-2.53-.81-4.07 0-1.61.84-2.82.91-3.83 0-3.32-2.91-3.66-8.11-1.04-10.99 1.29-1.44 2.89-2.28 4.41-2.28 1.52 0 2.27.56 3.48.56 1.18 0 1.96-.56 3.48-.56 1.48 0 2.9.84 4.14 2.28-3.04 1.77-2.53 6.03.5 7.42-.71 1.76-1.76 3.46-3.05 4.57zm-4.32-15.34c.05-.01.1-.02.15-.02.04 0 .09 0 .14.01.07-.48.27-.96.6-1.39.46-.61 1.13-1.08 1.83-1.22-.05.51-.23 1.01-.53 1.45-.48.71-1.26 1.25-2.09 1.39-.19-.08-.36-.16-.5-.22z"></path>
                        </svg>
                        Continuer avec Apple
                    </button>

                </div>

                <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Pas encore de compte ? <Link href="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>S'inscrire</Link>
                </p>
            </div>
        </div>
    );
}
