'use client'
import React, { useState } from 'react'

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
    const { user } = useUserStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    let pathname = usePathname();
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
                        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(false)}>
                            <X />
                        </Button>
                    </div>

                    <ul className="menu rounded-box w-full bg-base-100 p-2 text-base-content flex flex-col gap-4">
                        {menuItems.map((item, index) => (
                            <li key={index} >
                                <Link 
                                    href={item.url}
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