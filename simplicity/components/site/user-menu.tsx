"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark, LogOut, NotebookPen, Settings, User } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { UserAvatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type MenuUser = { name: string; username?: string | null; image?: string | null; email: string };

export function UserMenu({ user }: { user: MenuUser }) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="rounded-full outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Account menu"
      >
        <UserAvatar user={user} className="size-8" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{user.name}</span>
          <span className="truncate">{user.username ? `@${user.username}` : user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user.username ? (
          <DropdownMenuItem asChild>
            <Link href={`/@${user.username}`}>
              <User /> Profile
            </Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem asChild>
          <Link href="/library">
            <Bookmark /> Library
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/library?tab=drafts">
            <NotebookPen /> Drafts
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={async () => {
            await signOut();
            router.push("/");
            router.refresh();
          }}
        >
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
