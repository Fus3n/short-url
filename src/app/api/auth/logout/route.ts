import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from 'next/headers'

import { redirect } from "next/navigation";

export async function GET() {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session_id");

    if (sessionId) { 
        await prisma.session.delete({
            where: { sessionId: sessionId?.value },
        });

        cookieStore.delete("session_id");
        return NextResponse.json({ message: "Logout successful" });
    }

    redirect("/login");
    // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}