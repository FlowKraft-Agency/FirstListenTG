import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tokenValue = searchParams.get('token');

  if (!tokenValue) {
    return new NextResponse('Token manquant', { status: 401 });
  }

  // Vérification de la validité du Token 
  const token = await prisma.token.findUnique({
    where: { id: tokenValue }
  });

  if (!token) {
    return new NextResponse('Token invalide', { status: 403 });
  }

  // Vérification de l'expiration temporelle (30 min) UNIQUEMENT pour les streams
  // @ts-ignore : accessType will be available after prisma generate
  if (token.accessType === 'STREAM' && new Date() > token.expiresAt) {
    if (token.status !== 'CONSUMED') {
      await prisma.token.update({
         where: { id: token.id },
         data: { status: 'CONSUMED' }
      });
    }
    return new NextResponse('Token expiré', { status: 403 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Supabase URL or Service Role Key is missing in environment variables.");
    return new NextResponse('Configuration Serveur Invalide', { status: 500 });
  }

  // Fichier audio sécurisé sur Supabase Storage (Bucket "audio-tracks")
  // En production, le nom du fichier devrait être dans la base de données (ex: token.track.fileName)
  const fileName = 'test-audio.mp3';
  const storageUrl = `${supabaseUrl}/storage/v1/object/authenticated/audio-tracks/${fileName}`;

  // Récupérer le header Range de la requête originale pour le stream natif
  const range = request.headers.get('range');
  const headersInit: Record<string, string> = {
    'Authorization': `Bearer ${serviceRoleKey}`
  };

  if (range) {
    headersInit['Range'] = range;
  }

  // Effectuer la requête vers Supabase Storage
  const fetchResponse = await fetch(storageUrl, {
    headers: headersInit
  });

  if (!fetchResponse.ok) {
     console.error("Erreur téléchargement Supabase:", fetchResponse.status, fetchResponse.statusText);
     return new NextResponse('Fichier audio introuvable sur le cloud', { status: 404 });
  }

  // Préparer les headers de retour avec la sécurité anti-cache
  const headers = new Headers(fetchResponse.headers);
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');
  headers.set('Content-Type', 'audio/mpeg'); // S'assurer que le navigateur comprend le format

  // Next.js NextResponse renvoie directement le flux de données (ReadableStream)
  return new NextResponse(fetchResponse.body, {
    status: fetchResponse.status,
    headers: headers,
  });
}
