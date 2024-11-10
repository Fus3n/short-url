import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
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
        { message: "Login successful" },
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
        // domain: process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_DOMAIN : undefined
    });

    return response;
}
