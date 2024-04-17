import LearnerRootScreenSkeleton from "@Screens/post-authentication/Learner/Screens/LearnerRoot/LearnerRootScreenSkeleton";
import HomeScreenSkeleton from "@Screens/post-authentication/Learner/Screens/StoreScreen/HomeScreen/HomeScreenSkeleton";

export default function Loading() {
  return (
    <LearnerRootScreenSkeleton>
      <HomeScreenSkeleton />
    </LearnerRootScreenSkeleton>
  );
}
