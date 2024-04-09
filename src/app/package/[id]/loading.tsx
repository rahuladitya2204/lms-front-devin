"use client";
import LearnerRootScreenSkeleton from "@Screens/post-authentication/Learner/Screens/LearnerRoot/LearnerRootScreenSkeleton";
import PackageDetailViewerSkeleton from "@Screens/post-authentication/Learner/Screens/Products/Package/PackageDetailsViewer/PackageDetailSkeleton";
import ProductCategoryDetailSkeletonScreen from "@Screens/post-authentication/Learner/Screens/StoreScreen/ProductCategoryDetail/ProductCategoryDetailSkeleton";
import { Col, Divider, Row, Skeleton } from "@Lib/index";

export default function Loading() {
  return (
    <LearnerRootScreenSkeleton>
      <PackageDetailViewerSkeleton />
    </LearnerRootScreenSkeleton>
  );
}
