import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const { role } = await request.json();

        if (role !== 'ARTIST') {
            return NextResponse.json({ error: 'Rôle invalide' }, { status: 400 });
        }

        // Mettre à jour le rôle de l'utilisateur
        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: { role: role }
        });

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du rôle:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
