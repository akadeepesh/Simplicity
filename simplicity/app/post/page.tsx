"use client";

import Post from "@/components/layout/post-poetry";
import UnauthenticatedUserPage from "@/components/layout/unauthenticated-users";
import { Authenticated, Unauthenticated } from "convex/react";
import React from "react";

const PostPoetry = () => {
  return (
    <>
      <Authenticated>
        <div className="flex justify-center items-center h-[calc(100vh-2rem)]">
          <Post />
        </div>
      </Authenticated>
      <Unauthenticated>
        <UnauthenticatedUserPage ErrorMessage="Only Authenticated Users Can Post A Poetry" />
      </Unauthenticated>
    </>
  );
};

export default PostPoetry;
