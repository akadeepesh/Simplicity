import Image from "next/image";
import React from "react";

const UnauthenticatedUserPage = ({
  ErrorMessage,
}: {
  ErrorMessage: string;
}) => {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-2rem)]">
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
