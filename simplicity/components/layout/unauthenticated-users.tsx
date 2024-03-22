import React from "react";

const UnauthenticatedUserPage = ({
  ErrorMessage,
}: {
  ErrorMessage: string;
}) => {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-2rem)]">
      <div className="flex flex-col justify-center items-center gap-4">
        <img
          src="/leaves.png"
          height={"150rem"}
          width={"150rem"}
          alt="UnAuthenticated Error Image"
        />
        {ErrorMessage}
      </div>
    </div>
  );
};

export default UnauthenticatedUserPage;
