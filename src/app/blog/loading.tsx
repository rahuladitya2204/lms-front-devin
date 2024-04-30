"use client";

import { LearnerBlogsSKeletonScreen } from "@Screens/post-authentication/Learner/Screens/Blog/BlogsScreen";
import LearnerRootScreen from "@Screens/post-authentication/Learner/Screens/LearnerRoot/LearnerRootScreen";
import { Skeleton } from "antd";

export default function Loading() {
  return (
    <LearnerRootScreen noSignIn isServer>
      <LearnerBlogsSKeletonScreen />
    </LearnerRootScreen>
  );
}
