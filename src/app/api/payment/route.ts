import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { phone, network, amount = 200, accessType = 'STREAM', trackId } = await request.json();

    if (!phone || !network) {
      return NextResponse.json({ error: 'Numéro de téléphone et réseau requis' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    let userId = null;
    
    if (session && session.user?.email) {
      const user = await prisma.user.findUnique({ where: { email: session.user.email }});
      if (user) { userId = user.id; }
    }

    if (accessType === 'PERMANENT' && !userId) {
      return NextResponse.json({ error: 'Vous devez être connecté pour acheter définitivement un son et l\'ajouter à votre bibliothèque.' }, { status: 401 });
    }

    // 1. Création de la transaction (Simulation de l'API MoMo)
    const transaction = await prisma.transaction.create({
      data: {
        amount: amount,
        status: 'SUCCESS', // Payé avec succès (Bouchon)
        userId: userId,
        trackId: trackId || null,
      } as any
    });

    // 2. Création du Token d'accès valide 30 minutes ou plus selon le type
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + (accessType === 'PERMANENT' ? 60 * 24 * 365 * 10 : 30));

    const token = await prisma.token.create({
      data: {
        transactionId: transaction.id,
        status: 'VALID',
        expiresAt: expiresAt,
        userId: userId,
        accessType: accessType,
      } as any
    });

    // Retour du lien unique
    return NextResponse.json({ 
      success: true, 
      message: 'Paiement simulé avec succès.',
      token: token.id,
      link: `/player/${token.id}` 
    });

  } catch (error) {
    console.error('Payment simulation error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
