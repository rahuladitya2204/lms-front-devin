"use client";
import LearnerRootScreenSkeleton from "@Screens/post-authentication/Learner/Screens/LearnerRoot/LearnerRootScreenSkeleton";
import ProductCategoryDetailSkeletonScreen from "@Screens/post-authentication/Learner/Screens/StoreScreen/ProductCategoryDetail/ProductCategoryDetailSkeleton";
import { Col, Divider, Row, Skeleton } from "@Lib/index";

export default function Loading() {
  return (
    <LearnerRootScreenSkeleton>
      <ProductCategoryDetailSkeletonScreen />
    </LearnerRootScreenSkeleton>
  );
}
