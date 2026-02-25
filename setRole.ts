// Script local pour passer un compte en ADMIN ou ARTIST
// Usage: npx ts-node setRole.ts <email> <role>
// Ex: npx ts-node setRole.ts monemail@gmail.com ADMIN

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const role = process.argv[3];

  if (!email || !role) {
    console.error("Veuillez fournir un email et un rôle (ADMIN, ARTIST, USER).");
    console.error("Exemple: npx ts-node setRole.ts user@example.com ADMIN");
    process.exit(1);
  }

  const validRoles = ['ADMIN', 'ARTIST', 'USER', 'PREMIUM'];
  if (!validRoles.includes(role)) {
    console.error(`Rôle invalide. Les rôles possibles sont : ${validRoles.join(', ')}`);
    process.exit(1);
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      console.error(`Aucun utilisateur trouvé avec l'email : ${email}`);
      console.log("Avez-vous bien créé un compte sur le site (via Google) avant de lancer ce script ?");
      process.exit(1);
    }

    await prisma.user.update({
      where: { email },
      data: { role }
    });

    console.log(`✅ Succès : L'utilisateur ${email} a maintenant le rôle ${role}.`);
    console.log(`👉 Connectez-vous avec ce compte. S'il était déjà connecté, déconnectez-vous puis reconnectez-vous pour actualiser la session.`);
    
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
