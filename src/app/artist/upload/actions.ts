"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function uploadTrack(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ARTIST") {
    return { error: "Non autorisé" };
  }
  const artistId = (session.user as any).id;

  const title = formData.get("title") as string;
  const artistName = formData.get("artistName") as string;
  const coverImage = formData.get("coverImage") as string;
  const audioFile = formData.get("audioFile") as File;
  const priceStream = parseInt(formData.get("priceStream") as string);
  const priceDownload = parseInt(formData.get("priceDownload") as string);

  if (!title || !audioFile) {
    return { error: "Titre et fichier audio requis" };
  }

  // Upload du fichier sur Supabase Storage
  const fileExt = audioFile.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  // Transform File to ArrayBuffer for Supabase
  const buffer = await audioFile.arrayBuffer();

  const { data, error } = await supabase.storage
    .from("audio-tracks")
    .upload(fileName, buffer, {
        contentType: audioFile.type,
        upsert: false
    });

  if (error) {
    console.error("Supabase Storage Error:", error);
    return { error: "Erreur lors de l'upload du fichier audio vers Supabase." };
  }

  // Création du Track en Base de données (En attente de Modération)
  await prisma.track.create({
    data: {
      title,
      artistName: artistName || null,
      coverImage: coverImage || null,
      audioFileName: fileName,
      priceStream,
      priceDownload,
      status: "PENDING",
      artistId
    }
  });

  revalidatePath("/artist");
  revalidatePath("/admin/tracks"); // Notifie les admins qu'il y a un nouveau son

  return { success: true };
}
