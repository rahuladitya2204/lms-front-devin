import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Spin,
  Tag,
  message,
} from "antd";
import {
  ClockCircleOutlined,
  EyeOutlined,
  InfoCircleFilled,
  InfoCircleOutlined,
  SafetyCertificateOutlined,
  SaveOutlined,
  SettingOutlined,
  ToolOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Constants, Enum, Types, Utils } from "@adewaskar/lms-common";
import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "@Router/index";
import AppProvider from "screens/AppProvider";
import BackButton from "@Components/BackButton";
import { Course } from "@adewaskar/lms-common/lib/cjs/types/types/Courses.types";
import CourseCertificate from "./CourseInformation/CourseAdvancedSettings/CourseCertificate/CourseCertificateScreen";
import CourseDrip from "./CourseDrip/CourseDrip";
import CourseInformationEditor from "./CourseInformation";
import CourseLearners from "./CourseLearners/CourseLearners";
import Tabs from "@Components/Tabs";
import { User } from "@adewaskar/lms-common";
import useMessage from "@Hooks/useMessage";
import { useCourseStore } from "./CourseBuilder/useCourseStore";

const { confirm } = Modal;

function CourseEditor() {
  const [form] = Form.useForm();
  const { id } = useParams();
  const { mutate: updateCourse, isLoading: loading } = User.Queries.useUpdateCourse();
  const courseId = id + "";
  const setCourse = useCourseStore(s => s.setCourse)

  const saveCourse = (course: Types.Course) => {
    updateCourse({ id: courseId, data: course }, {
      onSuccess: (data) => {
        setCourse(data)
        message.success('Course Updated successfully')
      }
    })
  }

  const { data: course, isLoading: loadingCourse } = User.Queries.useGetCourseDetails(courseId, {
    enabled: !!courseId,
  });

  const { mutate: publishCourse, isLoading: publishingCourse } =
    User.Queries.usePublishCourse();


  useEffect(() => {
    form.setFieldsValue(course)
  }, [course]);


  const navigate = useNavigate();
  return (
    <AppProvider>
      <Spin spinning={publishingCourse || loadingCourse}>
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <Card
              title={
                <span>
                  <BackButton
                    onClick={() => navigate(`/admin/products/course`)}
                  />{" "}
                  {course.title}
                </span>
              }
              extra={[
                course.status === Enum.CourseStatus.PUBLISHED ? (
                  <Tag color="green">Course is Live</Tag>
                ) : !course.sections.length ? (
                  null
                ) : (
                  <Button
                    disabled={!Utils.validatePublishCourse(course)}
                    onClick={() => {
                      confirm({
                        title: "Are you sure?",
                        content: `You want to publish this course?`,
                        onOk() {
                          console.log(course, "course");
                          publishCourse({
                            courseId: course._id,
                          });
                        },
                        okText: "Yes, Publish",
                      });
                    }}
                    style={{ marginRight: 15 }}
                    icon={<UploadOutlined />}
                  >
                    Publish Course
                  </Button>
                ),
                <Link to={`/admin/products/course/${course._id}/builder`}>
                  <Button style={{ marginRight: 15 }} icon={<UploadOutlined />}>
                    Go to Course Builder
                  </Button>
                </Link>,
                <Button
                  loading={loading}
                  onClick={form.submit}
                  type="primary"
                  htmlType='submit'
                  icon={<SaveOutlined />}
                >
                  Save as draft
                </Button>,
              ]}
            >
              <Form onFinish={saveCourse} layout='vertical' form={form}>

                <Tabs
                  tabKey="course-editor"
                  tabPosition={"left"}
                  style={{ minHeight: "100vh" }}
                  items={[
                    {
                      label: (
                        <span>
                          <InfoCircleOutlined />
                          Information
                        </span>
                      ),
                      key: "information",
                      children: (
                        <CourseInformationEditor
                          saveCourse={saveCourse}
                          course={course}
                          courseId={courseId}
                        />
                      ),
                    },
                    {
                      label: (
                        <span>
                          <UserOutlined />
                          Learners
                        </span>
                      ),
                      key: "learners",
                      children: <CourseLearners courseId={course._id} />,
                    },
                  ]}
                />
              </Form>
            </Card>
          </Col>
          {/* <Col span={20}>
          <CourseInformationEditor />
        </Col> */}
        </Row>
      </Spin>
    </AppProvider>
  );
}

export default CourseEditor;
