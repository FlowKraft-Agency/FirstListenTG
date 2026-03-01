import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        
        console.log("Reçu Callback Paygate:", payload);

        // Paramètres reçus du webhook Paygate Global
        const { tx_reference, identifier, payment_reference, amount, datetime, phone_number, payment_method } = payload;

        if (!identifier) {
            return NextResponse.json({ error: 'Missing identifier' }, { status: 400 });
        }

        // On cherche la transaction correspondante
        const transaction = await prisma.transaction.findUnique({
            where: { id: identifier }
        });

        if (!transaction) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        // Si la transaction est déjà en succès on ne fait rien
        if (transaction.status === 'SUCCESS') {
            return NextResponse.json({ success: true, message: 'Already processed' });
        }

        // Validation simple: Paygate renvoie le payload en POST seulement quand c'est un succès (selon méthode 1/2) 
        // ou on peut vérifier un statut si présent. Dans la doc Flutter, la réception du POST = confirmation.
        
        // Mettre à jour la transaction
        await prisma.transaction.update({
            where: { id: identifier },
            data: { status: 'SUCCESS' }
        });

        // Chercher le token lié à cette transaction
        const token = await prisma.token.findUnique({
            where: { transactionId: identifier }
        });

        if (token) {
            await prisma.token.update({
                where: { id: token.id },
                data: { status: 'VALID' }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erreur traitement Callback Paygate:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
