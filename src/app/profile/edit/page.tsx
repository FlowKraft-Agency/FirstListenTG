import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProfileEditForm from "./ProfileEditForm";
import { prisma } from "@/lib/prisma";

export default async function ProfileEditPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <DashboardSidebar />

            {/* Main Content */}
            <main className="dashboard-main">
                <h1 className="title" style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Modifier le profil</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Mettez à jour vos informations publiques et de contact.</p>

                <ProfileEditForm user={user} />

            </main>
        </div>
    );
}
