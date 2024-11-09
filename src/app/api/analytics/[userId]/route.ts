import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// var parser = require('ua-parser-js');

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    // No need to parse userId since MongoDB uses string IDs
    const userId = params.userId;

    const links = await prisma.uRL.findMany({
      where: { 
        userId: userId // MongoDB ObjectId is stored as string
      },
      include: {
        clicks: {
          select: {
            createdAt: true,
            referrer: true,
            userAgent: true,
            country: true,
            device: true,
          },
        },
      },
    });

    const formattedLinks = links.map((link) => ({
      ...link,
      clickCount: link.clicks.length,
      clicks: link.clicks.map((click) => ({
        createdAt: click.createdAt.toISOString(),
        referrer: click.referrer,
        userAgent: click.userAgent,
        country: click.country,
        device: click.device,
      })),
    }));

    return NextResponse.json({ links: formattedLinks });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}