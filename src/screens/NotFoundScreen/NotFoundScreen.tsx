import Image from "@Components/Image";
import React from "react";

const NotFoundScreen: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <img
        alt="Not Found"
        width={"100%"}
        style={{ flex: 1 }}
        src={"/images/404.svg"}
      />
    </div>
  );
};

export default NotFoundScreen;
