import { Enum, Types } from "@adewaskar/lms-common";

import { Tag } from "antd";
import { useMemo } from "react";

interface BlogStatusTagPropsI {
  blog: Types.Blog;
}
export default function BlogStatusTag({ blog }: BlogStatusTagPropsI) {
  if (blog.status === Enum.BlogStatus.PUBLISHED) {
    return <Tag color="green-inverse">Published</Tag>;
  }

  if (blog.status === Enum.BlogStatus.DRAFT) {
    return <Tag color="blue-inverse">Draft</Tag>;
  }

  //   if (blog.status === Enum.BlogStatus.) {
  //     return <Tag color="red">Ended</Tag>
  //   }

  //   if (blog.status === Enum.BlogStatus.IN_PROGRESS) {
  //     return <Tag color="green-inverse">Submitted</Tag>
  //   }

  return `-`;
}
