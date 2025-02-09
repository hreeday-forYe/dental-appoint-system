import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { useGetUserProfileQuery } from "@/app/slices/userApiSlice";
import { Link } from "react-router-dom";
import { LogoutButton } from "..";
const HeaderDropdown = () => {
  const { data } = useGetUserProfileQuery();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none border-none focus:outline-none focus:border-none active:outline-none">
        <Avatar className="bg-gray-200 shadow-sm">
          <AvatarImage src={data?.user.avatar?.url}  className="rounded-full"/>
          <AvatarFallback>
            <User/>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[20]">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="group">
          <Link to={"/profile"} className="group-hover:cursor-pointer">
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem className="group">
          <LogoutButton className="bg-red-400">Logout</LogoutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderDropdown;
