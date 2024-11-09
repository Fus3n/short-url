import { prisma } from "@/lib/prisma";
import { nanoid } from 'nanoid'
import { getUserFromSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fullUrl, title } = await req.json();
    const shortUrl = nanoid(8);

    const newUrl = await prisma.uRL.create({
      data: {
        shortUrl,
        fullUrl,
        name: title,
        user: { connect: { id: user.id } },
      },
    });
    return Response.json({ newUrl });
  } catch (error) {
    console.error('Error creating URL:', error);
    return Response.json({ error: 'Unable to create URL' }, { status: 500 });
  }
}