"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markPayoutAsPaid(transactionIds: string[]) {
  await prisma.transaction.updateMany({
    where: { id: { in: transactionIds } },
    data: { payoutStatus: "PAID" }
  });
  revalidatePath("/admin/payouts");
}
