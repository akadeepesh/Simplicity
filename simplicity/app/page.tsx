"use client";

import { useUser } from "@clerk/clerk-react";
import React from "react";
import { Code } from "@/components/typography/code";
import { Link } from "@/components/typography/link";
import { Authenticated, Unauthenticated } from "convex/react";
import Footer from "@/components/layout/footer";

function SignedInContent() {
  const { user } = useUser();

  return (
    <>
      <p>Welcome {user?.fullName ?? "N/A"}!</p>
      <p>
        Click the button below and open this page in another window - this data
        is persisted in the Convex cloud database!
      </p>
      <p>
        Edit <Code>convex/myFunctions.ts</Code> to change your backend
      </p>
      <p>
        Edit <Code>app/page.tsx</Code> to change your frontend
      </p>
      <p>
        Check out <Link href="/simple">My page</Link>
      </p>
      <p>
        To build a full page layout copy one of the included{" "}
        <Link target="_blank" href="/layouts">
          layouts
        </Link>
      </p>
      <p>
        Click the button below and open this page in another window - this data
        is persisted in the Convex cloud database!
      </p>
      <p>
        Edit <Code>convex/myFunctions.ts</Code> to change your backend
      </p>
      <p>
        Edit <Code>app/page.tsx</Code> to change your frontend
      </p>
      <p>
        Check out <Link href="/simple">My page</Link>
      </p>
      <p>
        To build a full page layout copy one of the included{" "}
        <Link target="_blank" href="/layouts">
          layouts
        </Link>
      </p>
    </>
  );
}
const Main = () => {
  return (
    <div>
      <main className="container mt-10 max-w-2xl flex flex-col gap-8">
        <h1 className="text-4xl font-extrabold my-8 text-center">
          Convex + Next.js + Clerk Auth
        </h1>
        <Authenticated>
          <SignedInContent />
        </Authenticated>
        <Unauthenticated>
          <p>Click one of the buttons in the top right corner to sign in.</p>
        </Unauthenticated>
      </main>
      <Footer />
    </div>
  );
};

export default Main;
