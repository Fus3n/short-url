import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from 'next/headers'

export async function POST(req: Request) {
    const cookieStore = cookies();
    const { email, password, rememberMe  } = await req.json();

    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        return Response.json({ error: "Invalid email or password" }, {status: 401});
    }

    const isValidPass = await bcrypt.compare(password, user.password);

    if (!isValidPass) {
        return Response.json({ error: "Invalid email or password" }, {status: 401});
    }

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


    // cookieStore.set("session_id", session.sessionId, {
    //     maxAge: sessionDuration / 1000,
    //     path: "/",
    //     httpOnly: true, // Ensures the cookie is only accessible via HTTP(S), not JavaScript
    //     secure: process.env.NODE_ENV === "production", // Ensures the cookie is sent over HTTPS in production
    // })
    console.log("PROD", process.env.NODE_ENV === "production")
    cookieStore.set("session_id", session.sessionId, {
        maxAge: sessionDuration / 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
    });

    return Response.json({ message: "Login successful" }, {status: 200});
}
