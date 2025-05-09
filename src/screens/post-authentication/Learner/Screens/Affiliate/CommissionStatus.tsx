import { Enum } from "@adewaskar/lms-common";
import { Tag } from "antd";
import { useMemo } from "react";

interface CommissionStatusTagPropsI {
  status: Enum.CommissionStatus;
}

export function CommissionStatusTag(props: CommissionStatusTagPropsI) {
  const StatusTag = useMemo(() => {
    switch (props.status) {
      case Enum.CommissionStatus.PENDING: {
        return <Tag color="orange">Added to wallet</Tag>;
      }

      case Enum.CommissionStatus.ADD_TO_WALLET: {
        return <Tag color="orange">Added to wallet</Tag>;
      }

      case Enum.CommissionStatus.SUCCESSFUL: {
        return <Tag color="green">Added to Wallet</Tag>;
      }

      // case Enum.CommissionStatus.FAILED: {
      //   return <Tag color="red">Failed</Tag>
      // }
    }
  }, [props.status]);
  return StatusTag;
}
