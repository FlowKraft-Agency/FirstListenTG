import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import LibraryClient from "./LibraryClient";

export default async function LibraryPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            tokens: {
                include: {
                    transaction: {
                        include: {
                            track: {
                                include: {
                                    artist: true
                                }
                            }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    // Serialize dates for client component
    const serializedTokens = (user?.tokens || []).map(token => ({
        ...token,
        createdAt: token.createdAt.toISOString(),
        expiresAt: token.expiresAt.toISOString(),
        consumedAt: token.consumedAt?.toISOString() || null,
        transaction: {
            ...token.transaction,
            createdAt: token.transaction.createdAt.toISOString(),
            updatedAt: token.transaction.updatedAt.toISOString(),
            track: token.transaction.track ? {
                id: token.transaction.track.id,
                title: token.transaction.track.title,
                artistName: token.transaction.track.artistName,
                coverImage: token.transaction.track.coverImage,
                priceStream: token.transaction.track.priceStream,
                priceDownload: token.transaction.track.priceDownload,
                artist: {
                    name: token.transaction.track.artist?.name || null,
                },
            } : null,
        }
    }));

    return (
        <div className="dashboard-container">
            <DashboardSidebar />
            <main className="dashboard-main">
                <h1 className="title" style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Ma Musique</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-2xl)' }}>Retrouvez tous vos titres achetés.</p>
                <LibraryClient tokens={serializedTokens} />
            </main>
        </div>
    );
}
