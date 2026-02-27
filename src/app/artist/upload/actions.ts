"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function getSignedUploadUrl(fileName: string, contentType: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ARTIST") {
    return { error: "Non autorisé" };
  }

  const { data, error } = await supabase.storage
    .from("audio-tracks")
    .createSignedUploadUrl(fileName);

  if (error) {
    console.error("Supabase createSignedUploadUrl Error:", error);
    return { error: "Erreur lors de la préparation de l'upload." };
  }

  return { signedUrl: data.signedUrl, token: data.token, path: data.path };
}

export async function saveTrackRecord(data: {
  title: string;
  artistName?: string;
  coverImage?: string;
  audioFileName: string;
  priceStream: number;
  priceDownload: number;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ARTIST") {
    return { error: "Non autorisé" };
  }
  const artistId = (session.user as any).id;

  try {
    await prisma.track.create({
      data: {
        title: data.title,
        artistName: data.artistName || null,
        coverImage: data.coverImage || null,
        audioFileName: data.audioFileName,
        priceStream: data.priceStream,
        priceDownload: data.priceDownload,
        status: "PENDING",
        artistId
      }
    });

    revalidatePath("/artist");
    revalidatePath("/admin/tracks");

    return { success: true };
  } catch (error) {
    console.error("Database error:", error);
    return { error: "Erreur lors de l'enregistrement en base de données." };
  }
}

