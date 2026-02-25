"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approveTrack(trackId: string) {
  await prisma.track.update({
    where: { id: trackId },
    data: { status: "APPROVED" }
  });
  revalidatePath("/admin/tracks");
  revalidatePath("/");
}

export async function rejectTrack(trackId: string) {
  await prisma.track.update({
    where: { id: trackId },
    data: { status: "REJECTED" }
  });
  revalidatePath("/admin/tracks");
}
