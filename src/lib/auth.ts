import { prisma } from "./prisma";
import { cookies } from 'next/headers'

export async function getUserFromSession() {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session_id");
    if (!sessionId) {
        return null;
    }

    const session = await prisma.session.findUnique({
        where: { sessionId: sessionId?.value },
        include: { user: true}
    });

    
    if (!session || new Date() > session.expiresAt) {
        if (session) {
            await prisma.session.delete({
                where: { id: session.id }
            });
        }
        return null;
    }

    return session.user;
}




