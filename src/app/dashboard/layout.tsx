import React from 'react'

import { redirect } from 'next/navigation';
import { getUserFromSession } from '@/lib/auth';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    const user = await getUserFromSession();
    if (!user) {
        redirect('/login');
    }

    return (
        <main className='w-full h-full'>
            {children}
        </main>
    )
}

export default DashboardLayout;