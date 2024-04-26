"use client";
import LearnerRootScreenSkeleton from "@Screens/post-authentication/Learner/Screens/LearnerRoot/LearnerRootScreenSkeleton";
import ProductCategoryDetailSkeletonScreen from "@Screens/post-authentication/Learner/Screens/StoreScreen/ProductCategoryDetail/ProductCategoryDetailSkeleton";

export default function Loading() {
  return (
    <LearnerRootScreenSkeleton>
      <ProductCategoryDetailSkeletonScreen />
    </LearnerRootScreenSkeleton>
  );
}
