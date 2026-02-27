import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EditForm from "./EditForm";
import { notFound, redirect } from "next/navigation";

export default async function EditTrackPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return redirect("/login");

    const artistId = (session.user as any).id;
    const track = await prisma.track.findUnique({ where: { id: params.id } });

    if (!track || track.artistId !== artistId || track.status === 'APPROVED') {
        return notFound();
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Modifier le morceau</h1>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Mettez à jour les informations de: {track.title}</p>
            </div>

            <EditForm track={track} />
        </div>
    );
}
