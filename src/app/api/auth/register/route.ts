import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

import { cookies } from 'next/headers'

export async function POST(req: Request) {
    const cookieStore = cookies()
    const { email, password, name, rememberMe } = await req.json();
    
    // check if user already exists
    const exists = await prisma.user.findUnique({
        where: { email }
    })

    if (exists) {
        return Response.json({error: "User already exists"}, {status: 400})
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name: name.trim()
        }        
    })    

    // Set session duration
    const sessionDuration = rememberMe
        ? 30 * 24 * 60 * 60 * 1000 // 30 days
        : 24 * 60 * 60 * 1000; // 1 day


    // Automatically log in the user by creating a session
    const session = await prisma.session.create({
        data: {
            userId: user.id,
            expiresAt: new Date(Date.now() + sessionDuration),
        },
    });

    cookieStore.set("session_id", session.sessionId, {
        maxAge: sessionDuration / 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
    });

    return Response.json({ user });
}