import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ArtistProfileClient from "./ArtistProfileClient";

export default async function ArtistPublicPage({ params }: { params: Promise<{ artistName: string }> }) {
    const { artistName } = await params;
    const decodedName = decodeURIComponent(artistName);

    // D'abord on essaie de trouver le User Artiste par le nom du track
    // ou par le nom de l'utilisateur. 
    // Pour simplifier on va charger les sons (aprouvés) qui correspondent.
    const tracks = await prisma.track.findMany({
        where: {
            status: "APPROVED",
            OR: [
                { artistName: { equals: decodedName, mode: 'insensitive' } },
                { artist: { name: { equals: decodedName, mode: 'insensitive' } } }
            ]
        },
        include: { artist: true },
        orderBy: { createdAt: "desc" }
    });

    if (!tracks || tracks.length === 0) {
        notFound();
    }

    // Récupérer les infos de l'artiste depuis le premier son
    const artistUser = tracks[0].artist;
    const displayArtistName = tracks[0].artistName || artistUser?.name || decodedName;
    const artistImage = artistUser?.image || null;

    return <ArtistProfileClient artistName={displayArtistName} artistImage={artistImage} tracks={tracks} />;
}
