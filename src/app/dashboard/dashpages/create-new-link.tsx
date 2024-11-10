"use client";
import React, { useState, useEffect } from "react";

import { Input, InputProps } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { Link2Icon } from "lucide-react";

import { cn, getMe, User } from "@/lib/utils";

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from 'next/navigation';
import axios from "axios";

import { Loader2, CopyIcon, ChartAreaIcon, ClipboardCheckIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export type InputWithIconProps = React.InputHTMLAttributes<HTMLInputElement>;

const InputWithIcon = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex h-10 items-center rounded-md border border-input pl-3 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2",
          className
        )}
      >
        <Link2Icon className="h-[18px] w-[18px]" />
        <input
          {...props}
          type="search"
          ref={ref}
          className="w-full p-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    );
  }
);

InputWithIcon.displayName = "InputWithIcon";

const CreateNewLink = () => {
  const { toast } = useToast();
  const { push } = useRouter(); 
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const [newUrl, setNewUrl] = useState("");


  useEffect(() => {
    getMe()
      .then(setUser)
      .catch((err) => {
        console.log(err);
        push("/login");
        toast({
          title: "Error",
          description: "Something went wrong, unable to authenticate.",
          variant: "destructive",
        })
      });
  }, []) 

  async function submitUrl(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const fullUrl = data.get("fullUrl");
    const title = data.get("title");

    if (fullUrl) {
      setLoading(true);
      if (!user) {
        push("/login");
      }
      const res = await axios.post("/api/url/shorten", { fullUrl, title, userId: user?.id });
      if (res.status === 200) {
        setNewUrl(res.data.newUrl.shortUrl)
        // push("/dashboard");
        setDialogOpen(true);
        toast({
          title: "Success",
          description: "Link created successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong, unable to create link.",
          variant: "destructive",
        })
      }
    }
    setLoading(false);
  }

  function copyURLToClipboard() {
    // get current base url
    const baseUrl = window.location.origin;
    const newUrlCopy: string = `${baseUrl}/u/${newUrl}`
    navigator.clipboard.writeText(newUrlCopy)
    setUrlCopied(true);
  }

  return (
    <>
    <Dialog modal open={dialogOpen} defaultOpen={dialogOpen} onOpenChange={setDialogOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Your link is ready! 🎉</DialogTitle>
        <DialogDescription>
          Copy the link below to share it or choose a platform to share it to.
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-center gap-4">
        <Button className="flex gap-2" variant={"outline"} onClick={() => push("/dashboard")}>
          <ChartAreaIcon size={14}/> View Details
        </Button>
        <Button className="flex gap-2" onClick={copyURLToClipboard}>
          {urlCopied ? <ClipboardCheckIcon size={14}/> : <CopyIcon size={14}/>} {urlCopied ? "Copied" : "Copy Link"}
        </Button>
      </div>
    </DialogContent>
  </Dialog>

    <form onSubmit={submitUrl} className="container mx-auto px-6 py-10 w-full max-w-4xl flex flex-col gap-8">
        <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Create new</h1>
        <div className="flex flex-col gap-4">
            <Label htmlFor="fullUrl" className="text-muted-foreground text-md">Destination</Label>
            <InputWithIcon disabled={loading} name="fullUrl" type="url" className="w-full h-12" placeholder="https://my-long-url.com/long" autoComplete="off"/>
        </div>

        <div className="flex flex-col gap-4">
            <Label htmlFor="title" className="text-muted-foreground text-md">Title (optional)</Label>
            <Input disabled={loading} name="title" type="text" className="w-full h-12" autoComplete="off"/>
        </div>
        <Button 
            disabled={loading}
            type="submit" 
            className="w-full text-md"
          >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Shorten
        </Button>
    </form>
    </>
  );
};

export default CreateNewLink;
