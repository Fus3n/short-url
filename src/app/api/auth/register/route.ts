import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

import { cookies } from 'next/headers'
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

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

    const sessionDuration = rememberMe
        ? 30 * 24 * 60 * 60 * 1000 // 30 days
        : 24 * 60 * 60 * 1000; // 1 day


    const session = await prisma.session.create({
        data: {
            userId: user.id,
            expiresAt: new Date(Date.now() + sessionDuration),
        },
    });

    const response = NextResponse.json(
        { message: "Signup successful" },
        { status: 200 }
    );

    response.cookies.set({
        name: "session_id",
        value: session.sessionId,
        maxAge: sessionDuration,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        // domain: process.env.NEXT_PUBLIC_DOMAIN
    });

    return response;
}