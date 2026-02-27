import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    // TODO: Implémenter la logique d'enregistrement du retrait dans le modèle Transaction Payout
    // Pour l'instant, on simule une création réussie
    return NextResponse.json({ success: true, message: "Demande enregistrée." });
}
