import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Music } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";

export default async function LibraryPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        redirect("/login");
    }

    // Récupérer l'utilisateur en BDD et ses tokens/achats
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            tokens: {
                include: {
                    transaction: {
                        include: {
                            track: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <DashboardSidebar />

            {/* Main Content */}
            <main className="dashboard-main">
                <h1 className="title" style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Ma Musique</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Retrouvez tous vos titres achetés.</p>

                <div className="grid-responsive">
                    {user?.tokens.map(token => (
                        <div key={token.id} className="glass-card" style={{ padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: 0 }}>
                            <div style={{
                                aspectRatio: '1',
                                background: 'linear-gradient(135deg, #080c09, #121a14)',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {token.transaction.track?.coverImage ? (
                                    <img src={token.transaction.track.coverImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <Music size={48} color="var(--border-color)" />
                                )}
                                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                                    {token.accessType === 'PERMANENT' ? (
                                        <span style={{ fontSize: '10px', background: 'var(--primary-alpha-20)', color: 'var(--primary-color)', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>DÉFINITIF</span>
                                    ) : token.status === 'VALID' && new Date() <= token.expiresAt ? (
                                        <span style={{ fontSize: '10px', background: 'var(--primary-alpha-20)', color: 'var(--primary-color)', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>30 MIN RESTANTES</span>
                                    ) : (
                                        <span style={{ fontSize: '10px', background: 'var(--border-color)', color: '#888', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>EXPIRÉ</span>
                                    )}
                                </div>
                            </div>

                            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {token.transaction.track?.title || "Titre inconnu"}
                                    </h3>
                                    {token.transaction.track?.artistName ? (
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                            <Link href={`/a/${encodeURIComponent(token.transaction.track.artistName)}`} className="hover-underline" style={{ color: 'inherit', textDecoration: 'none' }}>
                                                {token.transaction.track.artistName}
                                            </Link>
                                        </p>
                                    ) : (
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Artiste inconnu</p>
                                    )}
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>Acheté le {token.createdAt.toLocaleDateString('fr-FR')}</p>
                                </div>
                                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '10px', color: '#666', fontFamily: 'monospace' }}>ID: {token.id.split('-')[0].toUpperCase()}</span>

                                    {token.accessType === 'PERMANENT' || (token.status === 'VALID' && new Date() <= token.expiresAt) ? (
                                        <Link href={`/player/${token.id}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                                            Écouter
                                        </Link>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    ))}

                    {(!user?.tokens || user.tokens.length === 0) && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
                            <Music size={64} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                            <p>Votre bibliothèque est vide.</p>
                            <Link href="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Explorer le catalogue</Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
