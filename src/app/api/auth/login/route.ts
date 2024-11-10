import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { cookies } from 'next/headers'
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
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

    const response = NextResponse.json(
        { message: "Login successful" },
        { status: 200 }
    );

    // Set cookie with specific options for Vercel deployment
    response.cookies.set({
        name: "session_id",
        value: session.sessionId,
        maxAge: sessionDuration,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        // Add domain if you're using a custom domain
        // domain: process.env.NEXT_PUBLIC_DOMAIN
        // domain: process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_DOMAIN : undefined
    });

    return response;
}
