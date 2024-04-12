"use client";
import { Space, Spin } from "antd";

import FullPageHolder from "screens/FullPageHeader";
import OrgLogo from "./OrgLogo";

function LoadingScreen(props: any) {
  return (
    <FullPageHolder>
      <Space
        align="center"
        style={{
          display: "flex",
          flex: 1,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Space align="center">
          <OrgLogo />
          <Spin />
        </Space>
      </Space>
    </FullPageHolder>
  );
}

export default LoadingScreen;
