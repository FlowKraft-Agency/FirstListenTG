import { prisma } from "@/lib/prisma";
import LandingClient from "./LandingClient";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Récupérer uniquement les sons validés par l'administration
  const tracks = await prisma.track.findMany({
    where: { status: "APPROVED" },
    include: { artist: true },
    orderBy: { createdAt: "desc" }
  });

  return <LandingClient initialTracks={tracks} />;
}
