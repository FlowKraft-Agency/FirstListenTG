"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignOutPage() {
    const router = useRouter();

    return (
        <main className="bg-abstract" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px', textAlign: 'center', padding: '3rem 2rem' }}>
                <div style={{ width: '64px', height: '64px', background: 'var(--primary-alpha-10)', color: 'var(--primary-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <LogOut size={32} />
                </div>

                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                    Se déconnecter
                </h1>

                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.875rem' }}>
                    Êtes-vous sûr de vouloir vous déconnecter de FirstListen ?
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                    >
                        Oui, me déconnecter
                    </button>

                    <button
                        onClick={() => router.back()}
                        className="btn btn-secondary"
                        style={{ width: '100%' }}
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </main>
    );
}
