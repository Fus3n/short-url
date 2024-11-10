import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from '@/components/ui/data-table';
import { BASE_URL, getMe, User } from "@/lib/utils";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Copy, Plus, MoreHorizontal, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
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

import { deleteURL } from '@/lib/utils';
import Link from 'next/link';

interface LinkData {
  id: string;
  shortUrl: string;
  fullUrl: string;
  name: string | null;
  createdAt: string;
  clickCount: number;
}

const LinksManager = () => {
  const [user, setUser] = useState<User | null>(null);
  const [linkData, setLinkData] = useState<LinkData[]>([]);
  const [filteredLinkData, setFilteredLinkData] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    shortUrl: true,
    fullUrl: true,
    createdAt: true,
    clickCount: true,
    actions: true,
  });
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getMe();
        setUser(userData);

        if (userData) {
          const response = await axios.get(`/api/analytics/${userData.id}`);
          setLinkData(response.data.links);
          setFilteredLinkData(response.data.links);
        }
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
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = linkData.filter(link =>
      Object.values(link).some(value =>
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredLinkData(filtered);
  }, [searchTerm, linkData]);

  const copyToClipboard = (shortUrl: string) => {
    const fullShortUrl = `${BASE_URL}/u/${shortUrl}`;
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
        setFilteredLinkData(prevData => prevData.filter(link => link.id !== id));
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }: { row: { original: LinkData } }) => <div>{row.original.name || 'N/A'}</div>,
    },
    {
      accessorKey: "shortUrl",
      header: "Short URL",
      cell: ({ row }: { row: { original: LinkData } }) => (
        <Link 
          className="font-medium text-xs sm:text-sm hover:underline text-primary truncate" 
          href={`${BASE_URL}/u/${row.original.shortUrl}`} 
          target="_blank"
        >
          {`${BASE_URL}/u/${row.original.shortUrl}`}
        </Link>
      ),
    },
    {
      accessorKey: "fullUrl",
      header: "Full URL",
      cell: ({ row }: { row: { original: LinkData } }) => (
        <Link 
          className="hidden md:table-cell max-w-xs font-medium text-xs sm:text-sm hover:underline text-primary truncate" 
          href={row.original.fullUrl.startsWith('http') ? row.original.fullUrl : `https://${row.original.fullUrl}`} 
          target="_blank"
        >
          {row.original.fullUrl}
        </Link>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }: { row: { original: LinkData } }) => (
        <div>
          {new Date(row.original.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      accessorKey: "clickCount",
      header: "Clicks",
    },
    {
      accessorKey: "actions",
      header: "",
      id: "actions",
      cell: ({ row }: { row: { original: LinkData } }) => {
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
  ].filter(column => visibleColumns[column.accessorKey as keyof typeof visibleColumns]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>All Links</CardTitle>
          <div className="flex justify-between items-center py-4 pb-0">
            <Input
                placeholder="Search links..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <Filter className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {Object.keys(visibleColumns).map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column}
                    className="capitalize"
                    checked={visibleColumns[column as keyof typeof visibleColumns]}
                    onCheckedChange={(checked) =>
                      setVisibleColumns(prev => ({ ...prev, [column]: checked }))
                    }
                  >
                    {column}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredLinkData}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default LinksManager;