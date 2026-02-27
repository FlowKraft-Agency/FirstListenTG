import { prisma } from "@/lib/prisma";
import ExploreClient from "./ExploreClient";

export const dynamic = 'force-dynamic';

export default async function ExplorePage() {
    // Récupérer uniquement les sons validés par l'administration
    const tracks = await prisma.track.findMany({
        where: { status: "APPROVED" },
        include: { artist: true },
        orderBy: { createdAt: "desc" }
    });

    return <ExploreClient initialTracks={tracks} />;
}
