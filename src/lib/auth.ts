import { prisma } from "./prisma";
import { cookies } from 'next/headers'

export async function getUserFromSession() {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session_id");
     // Add debug logging
     console.log('Session ID from cookie:', sessionId?.value);
    if (!sessionId) {
        return null;
    }

    const session = await prisma.session.findUnique({
        where: { sessionId: sessionId?.value },
        include: { user: true}
    });

    
    if (!session || new Date() > session.expiresAt) {
        return null;
    }

    return session.user;
}




