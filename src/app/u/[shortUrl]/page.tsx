import { redirect, RedirectType } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { URL } from '@prisma/client';
import { Separator } from '@/components/ui/separator'; 
import { headers } from 'next/headers'

async function fetchUrl(shortUrl: string): Promise<URL | null> {
  const url = await prisma.uRL.findUnique({
      where: {
        shortUrl: shortUrl
      }
  })

  if (!url) {
    return null;
  }
  const headersList = headers()
  await prisma.uRL.update({
    where: { shortUrl },
    data: {
      clicks: {
        create: {
          referrer: headersList.get('referer') || null,
          userAgent: headersList.get('user-agent') || null,
          country: headersList.get('x-user-country') || null,
        },
      },
    },
  });

  return url;
}
 
export default async function page({params}: { params: { shortUrl: string } }) {
  const url = await fetchUrl(params.shortUrl);

  if (!url) {
    return (
      <div className='flex w-full h-full justify-center items-center gap-4'>
        <p className='text-muted-foreground font-semibold'>404</p><Separator orientation='vertical' className='h-8'/> <p className='text-muted-foreground'>URL not found</p>
      </div>
    )
  } else {
    redirect(url.fullUrl, RedirectType.replace)
  }
}

