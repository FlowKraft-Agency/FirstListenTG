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

    const PAYGATE_AUTH_TOKEN = process.env.PAYGATE_GLOBAL_AUTH_TOKEN;
    if (!PAYGATE_AUTH_TOKEN) {
      console.error('PAYGATE_GLOBAL_AUTH_TOKEN is missing');
      return NextResponse.json({ error: 'Configuration de paiement invalide sur le serveur.' }, { status: 500 });
    }

    // 1. Enregistrement initial de la Transaction en mode PENDING
    const transaction = await prisma.transaction.create({
      data: {
        amount: amount,
        status: 'PENDING',
        userId: userId,
        trackId: trackId || null,
        // On stockera l'accessType ou token provisoire dans la bdd si necessaire, ici on peut juste se fier à la Transaction pour le webhook
      } as any
    });

    // Preparation du payload pour Paygate
    // L'API attend network: FLOOZ ou TMONEY
    let pgNetwork = network.toUpperCase();
    if (pgNetwork === 'MIXX') pgNetwork = 'FLOOZ'; // Fallback ou adaptation, a voir selon documentation exacte

    const payload = {
      auth_token: PAYGATE_AUTH_TOKEN,
      phone_number: phone.replace(/\s+/g, ''), // Nettoyage espaces
      amount: amount,
      description: `Achat - ${trackId ? 'Titre unique' : 'Contenu exclusif'}`,
      identifier: transaction.id, // On passe l'ID de notre transaction comme identifiant unique
      network: pgNetwork
    };

    // 2. Appel de l'API Paygate Global Method 1 (Direct USSD push)
    const paygateRes = await fetch('https://paygateglobal.com/api/v1/pay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const paygateData = await paygateRes.json();

    if (!paygateRes.ok || (paygateData.status !== 0 && !paygateData.tx_reference)) {
       console.error("Erreur Paygate API:", paygateData);
       // En cas d'erreur immédiate, on passe la transaction en FAILED
       await prisma.transaction.update({
         where: { id: transaction.id },
         data: { status: 'FAILED' }
       });
       return NextResponse.json({ error: 'Erreur lors de l’initiation du paiement. Veuillez réessayer.' }, { status: 400 });
    }

    // Sauvegarder temp le accessType quelque part pour que le webhook le retrouve (ou créer le Token en PENDING)
    // Création du Token d'accès en statut PENDING
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + (accessType === 'PERMANENT' ? 60 * 24 * 365 * 10 : 30));

    const token = await prisma.token.create({
      data: {
        transactionId: transaction.id,
        status: 'PENDING', // Il ne passera VALID que via Webhook
        expiresAt: expiresAt,
        userId: userId,
        accessType: accessType,
      } as any
    });

    // Retour du lien unique mais avec status en attente
    return NextResponse.json({ 
      success: true, 
      message: 'Demande de paiement envoyée. Veuillez confirmer sur votre téléphone.',
      tx_reference: paygateData.tx_reference, // Référence Paygate pour le suivi
      transactionId: transaction.id,
      token: token.id
      // On ne renvoie pas le link tout de suite, le Front s'en occupera après confirmation
    });

  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
