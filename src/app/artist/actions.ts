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

export async function editTrack(trackId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ARTIST") {
    return { error: "Non autorisé" };
  }

  const artistId = (session.user as any).id;
  const track = await prisma.track.findUnique({ where: { id: trackId } });
  
  if (!track || track.artistId !== artistId) {
    return { error: "Piste introuvable ou vous n'êtes pas le propriétaire" };
  }

  if (track.status === 'APPROVED') {
    return { error: "Impossible de modifier un morceau déjà validé." };
  }

  const title = formData.get("title") as string;
  const artistName = formData.get("artistName") as string;
  const coverImage = formData.get("coverImage") as string;
  const priceStream = parseInt(formData.get("priceStream") as string, 10);
  const priceDownload = parseInt(formData.get("priceDownload") as string, 10);

  if (!title || isNaN(priceStream) || isNaN(priceDownload)) {
    return { error: "Champs requis manquants ou invalides" };
  }

  try {
    await prisma.track.update({
      where: { id: trackId },
      data: {
        title,
        artistName: artistName || undefined,
        coverImage: coverImage || undefined,
        priceStream,
        priceDownload,
        status: track.status === 'REJECTED' ? 'PENDING' : track.status // Reset to pending if it was rejected
      }
    });

    revalidatePath("/artist");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la modification:", error);
    return { error: "Une erreur est survenue lors de la sauvegarde." };
  }
}

