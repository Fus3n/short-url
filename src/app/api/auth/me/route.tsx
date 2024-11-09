import { NextResponse } from "next/server";
import { getUserFromSession } from "@/lib/auth";

export async function GET(req: Request) {
    const user = await getUserFromSession();
     
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ user });
}