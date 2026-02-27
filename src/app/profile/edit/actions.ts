"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { error: "Non autorisé" };
  }

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const avatarFile = formData.get("avatarFile") as File | null;

  let avatarUrl = undefined;

  // Si un nouveau fichier d'avatar est fourni
  if (avatarFile && avatarFile.size > 0) {
    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `${(session.user as any).id}_${Date.now()}.${fileExt}`;
    
    const buffer = await avatarFile.arrayBuffer();

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, buffer, {
          contentType: avatarFile.type,
          upsert: true
      });

    if (uploadError) {
      console.error("Supabase Storage Error:", uploadError);
      return { error: "Erreur lors de l'upload de l'avatar." };
    }

    // Récupérer l'URL publique
    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);
      
    avatarUrl = publicUrlData.publicUrl;
  }

  // Mise à jour de l'utilisateur
  const updateData: any = {};
  if (name) updateData.name = name;
  if (phone) updateData.phone = phone;
  if (avatarUrl) updateData.image = avatarUrl;

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: updateData
    });
    
    revalidatePath("/profile");
    revalidatePath("/profile/edit");
    return { success: true };
  } catch (error) {
    console.error("Erreur mise à jour profil:", error);
    return { error: "Erreur lors de la mise à jour." };
  }
}
