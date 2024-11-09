'use client'

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Copy, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { UAParser } from "my-ua-parser"
import { useRouter } from 'next/navigation';
import { deleteURL } from '@/lib/utils';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { DataTable } from '@/components/ui/data-table';

import useUserStore from '@/store/user.store';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface FormattedClick {
  createdAt: string;
  referrer: string | null;
  userAgent: string | null;
  country: string | null;
  device: string | null;
};

interface LinkData {
  id: string;
  shortUrl: string;
  fullUrl: string;
  name: string | null;
  createdAt: string;
  clickCount: number;
  clicks: FormattedClick[];
};

interface BrowserData {
  name: string;
  value: number;
}

interface ClickTimeData {
  date: string;
  clicks: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const DashHome = () => {
  const { user, isLoading: userLoading } = useUserStore();
  const [linkData, setLinkData] = useState<LinkData[]>([]);
  const [top5Links, setTop5Links] = useState<LinkData[]>([]);
  const [browserData, setBrowserData] = useState<BrowserData[]>([]);
  const [clickTimeData, setClickTimeData] = useState<ClickTimeData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  // from linkData, get the top 5 links by click count, handle the case where there are less than 5 links
  function createTop5() {
    const sortedLinks = [...linkData].sort((a, b) => b.clickCount - a.clickCount);
    const newTop5Links = sortedLinks.slice(0, 5);
    setTop5Links(newTop5Links);
  }

  useEffect(() => {
    createTop5();
  }, [linkData]);

  useEffect(() => {
    const fetchData = async () => {
      if (userLoading) return;
      
      if (user) {
        try {
          const response = await axios.get(`/api/analytics/${user.id}`);
          setLinkData(response.data.links);
          processBrowserData(response.data.links);
          processClickTimeData(response.data.links);
        } catch (error) {
          console.error('Error fetching data:', error);
          toast({
            title: "Error",
            description: "Failed to fetch analytics data.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, userLoading]);

  const processClickTimeData = (links: LinkData[]) => {
    const clicksByDate: { [key: string]: number } = {};
    
    links.forEach(link => {
      link.clicks.forEach(click => {
        const date = new Date(click.createdAt).toLocaleDateString();
        clicksByDate[date] = (clicksByDate[date] || 0) + 1;
      });
    });

    const timeData = Object.entries(clicksByDate)
      .map(([date, clicks]) => ({ date, clicks }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setClickTimeData(timeData);
  };

  const processBrowserData = (links: LinkData[]) => {
    const browserCounts: { [key: string]: number } = {};
    links.forEach(link => {
      link.clicks.forEach(click => {
        const browser = getBrowserFromUserAgent(click.userAgent);
        browserCounts[browser] = (browserCounts[browser] || 0) + 1;
      });
    });

    const data = Object.entries(browserCounts).map(([name, value]) => ({ name, value }));
    setBrowserData(data);
  };

  const getBrowserFromUserAgent = (userAgent: string | null): string => {
    if (!userAgent) return 'Unknown';
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser();
    return browser.name || 'Unknown';
  };

  const copyToClipboard = (shortUrl: string) => {
    const fullShortUrl = `http://localhost:3000/u/${shortUrl}`;
    navigator.clipboard.writeText(fullShortUrl);
    toast({
      title: "Copied!",
      description: "Short URL copied to clipboard.",
    });
  };

  const deleteLink = async (id: string) => {
    try {
      const resp = await deleteURL(id);
      if (resp.status === 200) {
        setLinkData(prevData => prevData.filter(link => link.id !== id));
        createTop5();
        toast({
          title: "Success",
          description: "Link deleted successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: resp.data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting link:', error);
      toast({
        title: "Error",
        description: "Failed to delete link.",
        variant: "destructive",
      });
    }
  };

  if (loading || userLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">Analytics Dashboard</h1>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/dashboard/create-new-link">
            <Plus className="mr-2 h-4 w-4" /> Create New Link
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Links</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl sm:text-4xl font-bold">{linkData.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl sm:text-4xl font-bold">
              {linkData.reduce((sum, link) => sum + link.clickCount, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Clicks per Link</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl sm:text-4xl font-bold">
              {linkData.length > 0
                ? (linkData.reduce((sum, link) => sum + link.clickCount, 0) / linkData.length).toFixed(1)
                : '0'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Click Activity Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={clickTimeData} className='text-black'>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12, }} tickLine={{ stroke: '#666', }} axisLine={{ stroke: '#666' }} />
                <YAxis tick={{ fontSize: 12 }} tickLine={{ stroke: '#666' }} axisLine={{ stroke: '#666' }} />
                <Tooltip />
                <Line type="monotone" dataKey="clicks" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Browser Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={browserData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {browserData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Link Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <DataTable
              columns={[
                {
                  accessorKey: "name",
                  header: "Name",
                  cell: ({ row }) => <div className="hidden sm:table-cell">{row.original.name || 'N/A'}</div>,
                },
                {
                  accessorKey: "shortUrl",
                  header: "Short URL",
                  cell: ({ row }) => (
                    <Link 
                      className="font-medium text-xs sm:text-sm hover:underline text-primary truncate" 
                      href={`http://localhost:3000/u/${row.original.shortUrl}`} 
                      target="_blank"
                    >
                      {`http://localhost:3000/u/${row.original.shortUrl}`}
                    </Link>
                  ),
                },
                {
                  accessorKey: "fullUrl",
                  header: "Full URL",
                  cell: ({ row }) => (
                    <Link 
                    className="hidden md:table-cell max-w-xs font-medium text-xs sm:text-sm hover:underline text-primary truncate" 
                    href={row.original.fullUrl} 
                    target="_blank"
                  >
                    {row.original.fullUrl}
                  </Link>
                  ),
                },
                {
                  accessorKey: "createdAt",
                  header: "Created At",
                  cell: ({ row }) => (
                    <div className="hidden lg:table-cell">
                      {new Date(row.original.createdAt).toLocaleDateString()}
                    </div>
                  ),
                },
                {
                  accessorKey: "clickCount",
                  header: "Clicks",
                },
                {
                  id: "actions",
                  cell: ({ row }) => {
                    const link = row.original;
                    return (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => copyToClipboard(link.shortUrl)}>
                            <Copy className="mr-2 h-4 w-4" />
                            <span>Copy</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/edit-link/${link.id}`)}>
                            <Plus className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the shortened URL.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteLink(link.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    );
                  },
                },
              ]}
              data={top5Links}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashHome;