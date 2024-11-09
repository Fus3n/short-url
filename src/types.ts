export type User = {
    id: number
    name: string | null
    email: string
    createdAt: string
}

export type Click = {
    id: number;
    createdAt: string;
    urlId: string;
    referrer: string | null;
    userAgent: string | null;
    country: string | null;
    device: string | null;
}