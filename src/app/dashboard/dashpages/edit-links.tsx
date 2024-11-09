'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { Loader2 } from "lucide-react";

interface LinkData {
  id: string;
  userId: string;
  shortUrl: string;
  fullUrl: string;
  name: string | null;
  newShortUrl: string | null;
}

interface EditLinkProps {
  id: string;
}

const EditLink: React.FC<EditLinkProps> = ({ id }) => {
  const { toast } = useToast();
  const [linkData, setLinkData] = useState<LinkData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLinkData = async () => {
      try {
        const response = await axios.get(`/api/url/info/${id}`);
        setLinkData({...response.data, newShortUrl: response.data.shortUrl});
      } catch (error) {
        console.error('Error fetching link data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch link data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLinkData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedData = {
        ...linkData!,
        newShortUrl: linkData?.shortUrl === linkData?.newShortUrl ? null : linkData?.newShortUrl
      };
      await axios.put(`/api/url/update/${id}`, updatedData);
      toast({
        title: "Success",
        description: "Link updated successfully.",
      });
      router.push('/dashboard');
    } catch (error) {
      // const err = error as AxiosError;
      console.error('Error updating link:', error);
      const err = error as { response: { data: { error: string } } };
      toast({
        title: "Error",
        description: "Failed to update link: " + err.response?.data.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Link</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={linkData?.name || ''}
                  onChange={(e) => { 
                    setLinkData({ ...linkData!, name: e.target.value });
                  }}
                  placeholder="Link name (optional)"
                  autoComplete='off'
                />
              </div>
              <div>
                <Label htmlFor="fullUrl">Full URL</Label>
                <Input
                  id="fullUrl"
                  value={linkData?.fullUrl || ''}
                  onChange={(e) => { 
                    setLinkData({ ...linkData!, fullUrl: e.target.value }); 
                  }}
                  placeholder="https://example.com"
                  required
                  autoComplete='off'
                />
              </div>
              <div>
                <Label htmlFor="shortUrl">Short URL</Label>
                <Input
                  id="shortUrl"
                  value={linkData?.newShortUrl !== null ? linkData?.newShortUrl : linkData?.shortUrl}
                  onChange={(e) => {
                    setLinkData({ ...linkData!, newShortUrl: e.target.value }); 
                  }}
                  placeholder="custom-short-url"
                  required
                  
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Link
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditLink;