"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function deleteTrack(trackId: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ARTIST") {
    throw new Error("Non autorisé");
  }

  const artistId = (session.user as any).id;
  
  // Verify ownership
  const track = await prisma.track.findUnique({ where: { id: trackId } });
  if (!track || track.artistId !== artistId) {
    throw new Error("Piste introuvable ou vous n'êtes pas le propriétaire");
  }

  // Define as deleted or actually delete from DB.
  // We actually delete from DB since schema handles SetNull for transactions.
  await prisma.track.delete({
    where: { id: trackId }
  });

  revalidatePath("/artist");
}
