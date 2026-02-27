const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Les variables NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requises.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupBuckets() {
  console.log('Création du bucket "avatars"...');
  const { data: avatarsData, error: avatarsError } = await supabase.storage.createBucket('avatars', {
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
  });

  if (avatarsError) {
    if (avatarsError.message.includes('already exists')) {
      console.log('Le bucket "avatars" existe déjà.');
    } else {
      console.error('Erreur lors de la création du bucket "avatars":', avatarsError);
    }
  } else {
    console.log('Bucket "avatars" créé avec succès.');
  }

  // S'assurer que audio-tracks est bien créé, même s'il existait déjà pour les sons
  console.log('Vérification du bucket "audio-tracks"...');
  const { data: audioData, error: audioError } = await supabase.storage.createBucket('audio-tracks', {
    public: false, // Privé pour les sons qui nécessitent un paiement
  });

  if (audioError) {
      if (audioError.message.includes('already exists')) {
        console.log('Le bucket "audio-tracks" existe déjà.');
      } else {
        console.error('Erreur lors de la création du bucket "audio-tracks":', audioError);
      }
  } else {
      console.log('Bucket "audio-tracks" créé avec succès.');
  }
}

setupBuckets();
