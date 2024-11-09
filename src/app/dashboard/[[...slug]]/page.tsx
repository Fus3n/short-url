'use client'
import React, { useEffect, useState } from 'react'

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle-theme';

import { LayoutDashboard, LinkIcon, Cable, CreditCard, Settings, LogOutIcon, BellIcon, Menu, X, Link2 } from 'lucide-react';
import ProfileDropDown from '@/components/local/profile-dropdown';

import CreateNewLink from '../dashpages/create-new-link';
import DashHome from '../dashpages/dash-home';
import EditLink from '../dashpages/edit-links';
import LinksManager from '../dashpages/links-manager';
import Payments from '../dashpages/payments';
import ProfileView from '../dashpages/profile-view';

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useParams } from 'next/navigation';

import Link from 'next/link';
import useUserStore from '@/store/user.store';

const menuItems = [
    {name: "Dashboard", icon: <LayoutDashboard />, url: "/dashboard"},
    {name: "Create New", icon: <LinkIcon />, url: "/dashboard/create-new-link"},
    {name: "Links", icon: <Cable />, url: "/dashboard/links"},
    {name: "Payments", icon: <CreditCard />, url: "/dashboard/payments"},
    {name: "Settings", icon: <Settings />, url: "/dashboard/profile"},
]

const Dashboard = () => {
    const { user, isLoading: userLoading } = useUserStore();
    // const [user, setUser] = useState<User | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    let pathname = usePathname();
    const router = useRouter();
    const params = useParams();
    
    if (pathname === "/dashboard/") {
        pathname = "/dashboard"
        
    }
    const renderSection = () => {
        if (pathname.startsWith('/dashboard/edit-link/')) {
            return <EditLink id={params.slug[1]} />;
        }

        switch (pathname) {
            case '/dashboard':
                return <DashHome />;
            case '/dashboard/create-new-link':
                return <CreateNewLink />;
            case '/dashboard/links':
                return <LinksManager />;
            case '/dashboard/payments':
                return <Payments />;
            case "/dashboard/profile":
                return <ProfileView />
            default:
                return <h1>Page not found</h1>;
        }
    };

    useEffect(() => {   
        if (!user && !userLoading) {
            router.push('/login')
        }
    }, [user, userLoading])
    
    const activeTabStyle = "bg-primary text-white";
    return (
        <section className='flex w-full h-full flex-col lg:flex-row'>
            <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block lg:w-64 xl:w-96 bg-background z-50 lg:relative absolute top-0 left-0 right-0 h-full`}>
                <div className="flex flex-col items-center gap-4 px-4 lg:px-8 py-4 h-full">
                    <div className="flex justify-between items-center w-full">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                                <Link2 className="h-4 w-4 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                ShortLinks
                            </span>
                        </Link>
                        {/* <svg className='fill-current text-muted-foreground size-20 lg:size-28 dark:text-white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 394 80"><path d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"/><path d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"/></svg> */}
                        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(false)}>
                            <X />
                        </Button>
                    </div>

                    <ul className="menu rounded-box w-full bg-base-100 p-2 text-base-content flex flex-col gap-4">
                        {menuItems.map((item, index) => (
                            <li key={index} >
                                <Link 
                                    href={item.url}
                                    // className={`flex gap-2 items-center text-lg w-full cursor-pointer p-2 px-3 rounded-sm  ${pathname === item.url ? activeTabStyle : "hover:bg-muted"}`}
                                    // make it so the text doesnt break when it gets too long
                                    className={`flex gap-2 items-center text-lg w-full cursor-pointer p-2 px-3 rounded-sm truncate ${pathname === item.url ? activeTabStyle : "hover:bg-muted"}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.icon}{item.name}
                                </Link>
                            </li>
                        ))}
                        
                    </ul>
                    <Separator/>
                    <Button variant={"outline"} className='w-full text-md' asChild>
                        <Link href="/api/auth/logout">Logout <LogOutIcon className="ml-2 h-4 w-4"/></Link>
                    </Button> 
                </div>
            </nav>

            <Separator className="hidden lg:block my-6" orientation='vertical'/>
            <div className='w-full h-full'>
                <div className="w-full h-20 flex flex-row justify-between items-center px-4 lg:px-12">
                    <div className="flex items-center">
                        <Button variant="ghost" size="icon" className="lg:hidden mr-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            <Menu />
                        </Button>
                        <h3 className="scroll-m-20 text-xl lg:text-2xl font-semibold tracking-tight">Dashboard</h3>
                    </div>
                    <div className="flex gap-2 items-center">
                        <Button variant="outline" size="icon"><BellIcon /></Button>
                        <ProfileDropDown user={user} />
                        <ModeToggle />
                    </div>
                </div>
                <Separator/>

                <div className="p-4 lg:p-8">{renderSection()}</div>

            </div>

        </section>
    )
}

export default Dashboard;