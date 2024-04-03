import Image from "next/image";
import React from "react";

const UnauthenticatedUserPage = ({
  ErrorMessage,
  className = "",
}: {
  ErrorMessage: string;
  className?: string;
}) => {
  return (
    <div
      className={`flex justify-center items-center h-[calc(100vh-2rem)] ${className}`}
    >
      <div className="flex flex-col justify-center items-center gap-4">
        <Image
          src="/leaves.png"
          height={200}
          width={200}
          alt="UnAuthenticated Error Image"
        />
        {ErrorMessage}
      </div>
    </div>
  );
};

export default UnauthenticatedUserPage;
