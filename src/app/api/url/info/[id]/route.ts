import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromSession } from "@/lib/auth";


export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
      const user = await getUserFromSession();
      if (!user) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const link = await prisma.uRL.findUnique({
        where: { id: params.id },
        select: { id: true, shortUrl: true, fullUrl: true, name: true },
      });
      
      if (!link) {
        console.log("Link not found");
        return NextResponse.json({ error: 'Link not found' }, { status: 404 });
      }
  
      return NextResponse.json(link);
    } catch (error) {
      console.error('Error fetching link:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
  