"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toggleFollow } from "@/lib/actions/engagement";
import { useRequireAuth } from "@/components/site/viewer-context";
import { Button } from "@/components/ui/button";

export function FollowButton({
  userId,
  initialFollowing,
  size = "default",
}: {
  userId: string;
  initialFollowing: boolean;
  size?: "sm" | "default";
}) {
  const router = useRouter();
  const requireAuth = useRequireAuth();
  const [following, setFollowing] = React.useState(initialFollowing);
  const [hover, setHover] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  return (
    <Button
      size={size}
      variant={following ? "outline" : "default"}
      disabled={pending}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => {
        if (!requireAuth()) return;
        const prev = following;
        setFollowing(!prev);
        startTransition(async () => {
          const res = await toggleFollow(userId);
          if (!res.ok) {
            setFollowing(prev);
            toast.error(res.error);
          } else {
            router.refresh();
          }
        });
      }}
      className={following && hover ? "border-destructive/40 text-destructive" : undefined}
    >
      {following ? (hover ? "Unfollow" : "Following") : "Follow"}
    </Button>
  );
}
