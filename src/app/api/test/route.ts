import { nanoid } from 'nanoid'

export async function GET(req: Request) {
    return Response.json({ shortUrl: nanoid(8) });
}