"use client";
import LearnerRootScreenSkeleton from "@Screens/post-authentication/Learner/Screens/LearnerRoot/LearnerRootScreenSkeleton";
import ProductCategoryDetailSkeletonScreen from "@Screens/post-authentication/Learner/Screens/StoreScreen/ProductCategoryDetail/ProductCategoryDetailSkeleton";
import { Col, Divider, Row, Skeleton } from "@Lib/index";
import TestDetailSkeletonScreen from "@Screens/post-authentication/Learner/Screens/Products/Test/TestDetail/TestDetailSkeletonScreen";
import { BlogDetailSkeletonScreen } from "@Screens/post-authentication/Learner/Screens/Blog/BlogDetail";
import LearnerRootScreen from "@Screens/post-authentication/Learner/Screens/LearnerRoot/LearnerRootScreen";

export default function Loading() {
  return (
    <LearnerRootScreen noSignIn isServer>
      <BlogDetailSkeletonScreen />
    </LearnerRootScreen>
  );
}
