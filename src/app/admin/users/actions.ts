"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function updateUserRole(userId: string, newRole: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Non autorisé");
  }

  const validRoles = ["USER", "ARTIST", "ADMIN", "PREMIUM"];
  if (!validRoles.includes(newRole)) {
     throw new Error("Rôle invalide");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole }
  });

  revalidatePath("/admin/users");
}
