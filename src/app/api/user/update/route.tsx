import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server'
import { getUserFromSession } from "@/lib/auth";

export async function PUT(request: Request) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email } = await request.json();

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id: user.id
        }
      }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already taken' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name.trim(),
        email: email.trim()
      }
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        name: updatedUser.name,
        email: updatedUser.email
      }
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
