import { Card } from "antd";
import CourseCurriculum from "./CourseCurriculum";
import CourseOverview from "./CourseOverview";
import CourseReviews from "./CourseReviews/CourseReviews";
import Tabs from "@Components/Tabs";
import { Types } from "@adewaskar/lms-common";

interface CourseDetailsPropsI {
  course: Types.Course;
}

function CourseDetails(props: CourseDetailsPropsI) {
  return (
    <Card bodyStyle={{ paddingTop: 0 }}>
      <Tabs
        tabKey="course-detail"
        items={[
          {
            key: "overview",
            label: `Overview`,
            children: <CourseOverview course={props.course} />,
          },
        ]}
        style={{ fontSize: 30 }}
        size="middle"
      />
    </Card>
  );
}

export default CourseDetails;
