"use client";

import { ChevronDown } from "lucide-react";
import Avatar from "boring-avatars";

import { User } from "@/lib/utils";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

import { logout } from "@/lib/utils";

import { LogOut, Settings, User as UserIcon } from "lucide-react";

const ProfileDropDown = ({ user }: { user: User | null }) => {
  const router = useRouter();
  const { toast } = useToast();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex gap-3 items-center p-2 px-4 cursor-pointer rounded-sm hover:bg-muted">
          <Avatar name={user?.name ?? ""} variant="beam" size={36} />
          <p className="text-lg font-bold">{user?.name}</p>
          <ChevronDown />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="/dashboard/profile" className="flex items-center">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/dashboard/profile" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button
            variant={"ghost"}
            className="w-full text-md h-5 justify-start m-0 p-0 pr-4"
            onClick={async () => {
              const success = await logout();
              if (success) {
                router.push("/login");
              } else {
                toast({
                  title: "Error",
                  description: "Could not log out",
                  variant: "destructive",
                });
              }
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropDown;
