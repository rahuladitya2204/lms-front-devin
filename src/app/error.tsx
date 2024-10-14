"use client";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Result } from "antd";
import { useEffect } from "react";

export default function Error({ error }) {
  useEffect(() => {
    console.error("An error occurred:", error);
  }, [error]);

  return (
    <Result
      icon={
        <ExclamationCircleOutlined
          style={{ color: "#ff4d4f", fontSize: "72px" }}
        />
      }
      title="Some issue occurred"
      subTitle="Sorry, something went wrong."
      extra={
        <Button type="primary" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      }
    />
  );
}
