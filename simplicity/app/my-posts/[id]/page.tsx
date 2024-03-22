"use client";
import UnauthenticatedUserPage from "@/components/layout/unauthenticated-users";
import YourPosts from "@/components/layout/your-posts";
import { Authenticated, Unauthenticated } from "convex/react";

const PostPage = () => {
  return (
    <div>
      <Authenticated>
        <YourPosts />
      </Authenticated>
      <Unauthenticated>
        <UnauthenticatedUserPage ErrorMessage="You need to Sign in to access your poetries" />
      </Unauthenticated>
    </div>
  );
};

export default PostPage;
