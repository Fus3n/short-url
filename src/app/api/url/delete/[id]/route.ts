import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = params;

    await prisma.click.deleteMany({
      where: { urlId: id },
    });

    // Delete the URL and associated clicks
    await prisma.uRL.delete({
      where: { id },
      include: {
        clicks: true,
      },
    });

    return NextResponse.json({ message: "URL deleted successfully" });
  } catch (error) {
    console.error("Error deleting URL:", error);
    return NextResponse.json({ error: "Failed to delete URL" }, { status: 500 });
  }
}