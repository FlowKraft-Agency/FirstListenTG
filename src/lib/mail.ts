import nodemailer from 'nodemailer';

// Configuration du transporteur SMTP
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true pour 465, false pour les autres (587)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export const sendWelcomeEmail = async (email: string, name: string) => {
    try {
        const mailOptions = {
            from: `"FirstListen" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Bienvenue sur FirstListen !',
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #080c09; color: #fff; padding: 40px 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #1a1e1b; padding: 40px; border-radius: 10px; border: 1px solid #333;">
                        <h1 style="color: #0df259; text-align: center;">Bienvenue ${name} !</h1>
                        <p style="font-size: 16px; line-height: 1.5; text-align: center;">
                            Nous sommes ravis de vous compter parmi nous sur <strong>FirstListen</strong>.
                        </p>
                        <p style="font-size: 16px; line-height: 1.5; text-align: center;">
                            Préparez-vous à découvrir des morceaux exclusifs avant tout le monde.
                        </p>
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="${process.env.NEXTAUTH_URL}/library" style="background-color: #0df259; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Aller à ma bibliothèque</a>
                        </div>
                        <p style="font-size: 12px; color: #888; text-align: center; margin-top: 40px;">
                            © ${new Date().getFullYear()} FirstListen. Tous droits réservés.
                        </p>
                    </div>
                </div>
            `,
        };

        // En mode développement, on affiche souvent dans la console si le SMTP n'est pas configuré
        if (!process.env.SMTP_USER) {
            console.log("Mock Email Envoyé:", mailOptions);
            return;
        }

        const info = await transporter.sendMail(mailOptions);
        console.log("Email de bienvenue envoyé: %s", info.messageId);
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email de bienvenue:", error);
    }
};
