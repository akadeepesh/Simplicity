"use client";
import React, { useState } from "react";
import Footer from "@/components/layout/footer";
import PoetriesCollection from "@/components/layout/poetries-collection";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
const Main = () => {
  const [showButton, setShowButton] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 500) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <div className="container max-w-2xl flex flex-col mt-14 md:mt-28">
        <PoetriesCollection />
      </div>
      {showButton && (
        <Button
          onClick={scrollToTop}
          size={"icon"}
          className="fixed group bottom-16 right-8 bg-transparent hover:bg-secondary transition-all duration-300 text-primary z-10"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ChevronUp
                  className="group-hover:text-[#21bbdc] transition-all duration-300"
                  size={20}
                />
              </TooltipTrigger>
              <TooltipContent>
                <div>Move to Top</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Button>
      )}
      <Footer />
    </div>
  );
};

export default Main;
