"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import Footer from "@/components/layout/footer";
import SignedInContent from "@/components/layout/singed-in-content";

const Main = () => {
  return (
    <div>
      <main className="container max-w-2xl flex flex-col mt-28">
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
