import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from '@/lib/mail';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, name, role } = body;

        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Tous les champs sont requis.' }, { status: 400 });
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'Un compte existe déjà avec cet email.' }, { status: 409 });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer l'utilisateur
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: role === 'ARTIST' ? 'ARTIST' : 'USER',
            }
        });

        // Envoi de l'email de bienvenue (ne bloque pas la réponse si erreur)
        sendWelcomeEmail(user.email || '', user.name || 'Utilisateur').catch(console.error);

        return NextResponse.json({ 
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }, 
            message: 'Compte créé avec succès' 
        }, { status: 201 });

    } catch (error: any) {
        console.error('Erreur lors de la création du compte:', error);
        return NextResponse.json({ error: 'Erreur serveur lors de la création du compte.' }, { status: 500 });
    }
}
