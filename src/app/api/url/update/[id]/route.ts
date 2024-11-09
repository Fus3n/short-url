import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromSession } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, fullUrl, shortUrl, newShortUrl } = await request.json();

    let urlToChange = shortUrl;
    if (newShortUrl) {
      console.log("NEW SHORT", newShortUrl);
      const existingLink = await prisma.uRL.findUnique({
        where: { shortUrl: newShortUrl },
      });
      if (existingLink) {
        return NextResponse.json({ error: 'Short URL already taken' }, { status: 400 });
      }
      urlToChange = newShortUrl;
    }

    const updatedLink = await prisma.uRL.update({
      where: { id: params.id },
      data: { name, fullUrl, shortUrl: urlToChange },
    });

    return NextResponse.json(updatedLink);
  } catch (error) {
    console.error('Error updating link:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}