import { Enum, Types } from "@adewaskar/lms-common";
import { Tag } from "antd";
import { useMemo } from "react";

export default function UserAccountStatusTag({ user }: { user: Types.User }) {
  const StatusTag = useMemo(() => {
    let status = <Tag color="green-inverse">Active</Tag>;
    if (user.status === Enum.UserAccountStatus.DELETED) {
      return <Tag color="red-inverse">Deleted</Tag>;
    }
    if (user.status === Enum.UserAccountStatus.INACTIVE) {
      return <Tag color="red-inverse">Inactive</Tag>;
    }
    return status;
  }, [user]);
  return StatusTag;
}
