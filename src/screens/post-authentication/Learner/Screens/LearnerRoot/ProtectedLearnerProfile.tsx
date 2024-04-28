import ProtectedContent from "@Components/ProtectedComponent";
import { Enum, Learner } from "@adewaskar/lms-common";
import { UserOutlined } from "@ant-design/icons";
import { Alert } from "antd";
import LearnerProfile from "../Account/LearnerProfile";

interface ProtectedLearnerProfilePropsI {
  children: React.ReactNode;
}

export default function ProtectedLearnerProfile(
  props: ProtectedLearnerProfilePropsI
) {
  const { data: learner } = Learner.Queries.useGetLearnerDetails();
  return (
    <ProtectedContent
      title="Verification Required"
      isVerified={learner.profile.status === Enum.LearnerProfileStatus.COMPLETE}
      message={
        <Alert
          icon={<UserOutlined />}
          message="Please complete your profile to view test result"
        />
      }
      cta={<LearnerProfile />}
    >
      {props.children}
    </ProtectedContent>
  );
}
