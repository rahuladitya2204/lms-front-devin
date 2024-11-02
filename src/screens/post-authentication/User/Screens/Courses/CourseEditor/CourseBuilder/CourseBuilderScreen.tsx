import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Skeleton,
  Space,
  Spin,
  Tag,
  message,
} from "@Lib/index";
import { Constants, Enum, Types, User, Utils } from "@adewaskar/lms-common";
import { useNavigate, useParams } from "@Router/index";
import { UploadOutlined } from "@ant-design/icons";
import { cloneDeep } from "lodash";
import { useEffect } from "react";

import ActionModal from "@Components/ActionModal/ActionModal";
import AppProvider from "screens/AppProvider";
import BackButton from "@Components/BackButton";
import CourseSectionsNavigator from "./CourseSectionsNavigator";
import GenerateWithAI from "../CourseInformation/GenerateWithAiButton";
import Header from "@Components/Header";
import Image from "@Components/Image";
import MediaUpload from "@Components/MediaUpload";
import SetCourseRules from "./SetCourseRules";
import { useModal } from "@Components/ActionModal/ModalContext";
import Tabs from "@Components/Tabs";
import { useCourseStore } from "./useCourseStore";
import AddTextItem from "./UploadItems/AddTextItem/AddTextItem";
import { Outlet } from "react-router";
import useUpdateCourseForm from "./UploadItems/useUpdateCourseForm";
import { getReadingTime } from "./utils";

const { confirm } = Modal;

function CourseBuilderScreen() {
  const { id: courseId, itemId } = useParams();
  const [form] = Form.useForm();
  useUpdateCourseForm(form)
  const { mutate: updateCourse, isLoading: savingCourse } =
    User.Queries.useUpdateCourse();
  const { course, updateItem, currentItem } = useCourseStore(s => s)

  const { mutate: deleteSectionApi, isLoading: deletingSection } =
    User.Queries.useDeleteCourseSection();
  const navigate = useNavigate();

  const { data: courseDetails, isLoading: loadingCourse } =
    User.Queries.useGetCourseDetails(courseId + "", {
      enabled: !!courseId,
    });

  const { openModal } = useModal();
  const { setLanguage, setCourse } = useCourseStore((s) => s);


  useEffect(() => {
    setCourse(courseDetails)
  }, [courseDetails])

  useEffect(() => {
    form.setFieldsValue(currentItem)
  }, [currentItem])

  const saveCourse = () => {
    console.log("Saved");
    if (course._id) {
      updateCourse(
        {
          id: courseId + "",
          data: {
            sections: course.sections,
          },
        },
        {
          onSuccess: () => {
            message.open({
              type: "success",
              content: "Saved Course",
            });
          },
        }
      );
    }
  };

  useEffect(() => {
    if (!itemId) {
      const firstSection = course.sections.find((s) => s.items.length);
      if (firstSection && firstSection.items.length) {
        const firstItem = firstSection.items[0];
        if (firstItem.type) {
          navigate(`${firstItem.type}/${firstItem._id}`);
        }
      }
    }
  }, [course._id]);

  const { mutate: unpublishCourse, isLoading: unpublishingCourse } =
    User.Queries.useUnpublishCourse();

  useEffect(() => {
    if (course.languages.length) {
      setLanguage(course.languages[0]);
    }
  }, [course.languages]);

  const onAddSection = (section: Partial<Types.CourseSection>) => {
    console.log(section, "section");
    let COURSE = cloneDeep(course);
    if (section._id) {
      COURSE.sections.forEach((sec, index) => {
        if (sec._id === section._id) {
          COURSE.sections[index] = { ...sec, ...section };
        }
      });
    } else {
      // @ts-ignore
      const newSection: Types.CourseSection = {
        title: section.title,
        items: [],
        description: section.description,
      };
      COURSE.sections.push(newSection);
    }

    updateCourse(
      {
        id: courseId || "",
        data: {
          sections: COURSE.sections,
        },
      },
      {
        onSuccess: () => {
          message.open({
            type: "success",
            content: `Saved`,
          });
        },
      }
    );
  };


  const deleteSection = (sectionId: string) => {
    deleteSectionApi(
      {
        data: {
          courseId: courseId + "",
          sectionId: sectionId,
        },
      },
      {
        onSuccess: () => {
          message.success("Section Deleted");
          const lastSection = course.sections.pop();
          const lastItem = lastSection?.items.pop();
          if (lastSection && lastItem && lastItem.type)
            navigate(`${lastItem.type}/${lastItem._id}`);
        },
      }
    );
  };

  const onAddNewItem = (
    type: string,
    item: Partial<Types.CourseSectionItem>,
    index: number
  ) => {
    // debugger;
    let COURSE = cloneDeep(course);
    const newItem: Partial<Types.CourseSectionItem> = {
      ...item,
      type
    };
    // console.log(test, 'livviviv')

    if (item._id) {
      COURSE.sections[index].items.forEach(
        (i: Types.CourseSectionItem, itemIndex: number) => {
          if (i._id === item._id) {
            // @ts-ignore
            COURSE.sections[index].items[itemIndex] = {
              ...item,
              ...newItem,
              type
            };
          }
        }
      );
    } else {
      // @ts-ignore
      COURSE.sections[index].items.push(newItem);
    }
    updateCourse({
      id: courseId || "",
      data: {
        sections: COURSE.sections,
      },
      cb: (course) => {
        if (item._id) {
          return navigate(`${type}/${item._id}`);
        }
        const newlyAdedItem = [...course.sections[index].items].pop();
        navigate(`${type}/${newlyAdedItem?._id}`);
      },
    });
  };


  return (
    <AppProvider>
      <Header
        title={
          <span>
            {" "}
            <BackButton
              onClick={() => navigate(`/admin/products/courses/${courseId}/editor`)}
            />{" "}
            {course.title}
          </span>
        }
        extra={[
          // @ts-ignore
          course.status === Enum.CourseStatus.PUBLISHED ? (
            <Space>
              <Tag color="green">Course is Live</Tag>
              <Button
                onClick={() => {
                  confirm({
                    title: "Are you sure?",
                    content: `You want to unpublish this course, it will be moved to draft?`,
                    onOk() {
                      unpublishCourse({
                        courseId: course._id,
                      });
                    },
                    okText: "Delete",
                  });
                }}
                loading={unpublishingCourse}
                // disabled={!Utils.validatePublishCourse(course)}
                style={{ marginRight: 15 }}
                icon={<UploadOutlined />}
              >
                Publish Course
              </Button>
            </Space>
          ) : (
            <>
              {/* <Link to={`/admin/products/course/${course._id}/builder`}>
                <Button style={{ marginRight: 15 }} icon={<UploadOutlined />}>
                  Go to Course Builder
                </Button>
              </Link> */}
              <Button
                loading={savingCourse}
                htmlType="submit"
                onClick={form.submit}
                type="primary"
                style={{ marginRight: 10 }}
              >
                Save Changes
              </Button>
            </>
          ),
        ]}
      >
        <Form
          name="course builder"
          form={form}
          onFinish={saveCourse}
          layout="vertical"
          onValuesChange={(a, allValues: Types.CourseSectionItem) => {
            if (!allValues.metadata)
              allValues.metadata = {};
            // allValues.description.duration = getReadingTime(allValues.description.text.eng)
            allValues.metadata.duration = getReadingTime(allValues.description.text.eng)
            // console.log(allValues, '123123123');
            updateItem(itemId + '', allValues)
          }
          }
        >
          <Tabs
            tabPosition="top"
            type="card"
            onTabClick={(e) => {
              setLanguage(e);
            }}
            tabKey="course-builder"
            destroyInactiveTabPane={false}
            items={Constants.LANGUAGES.filter((l) =>
              course?.languages?.includes(l.value)
            )?.map((l) => {
              return {
                label: l.label,
                key: l.value,
                children: (
                  <Row gutter={[16, 16]}>
                    <Col span={7}>
                      <Row>
                        <Col span={24}>
                          <Form.Item>
                            {loadingCourse ? (
                              <Image
                                preview={false}
                                src={course.thumbnailImage}
                              />
                            ) : (
                              <MediaUpload
                                source={{
                                  type: "course.thumbnailImage",
                                  value: courseId + "",
                                }}
                                uploadType="image"
                                prefixKey={`courses/${courseId}/thumbnailImage`}
                                cropper={{ width: 330, height: 200 }}
                                width="100%"
                                // height="200px"
                                aspect={16 / 9}
                                renderItem={() => (
                                  <Image
                                    preview={false}
                                    src={course.thumbnailImage}
                                  />
                                )}
                                onUpload={(file) => {
                                  saveCourse({
                                    thumbnailImage: file.url,
                                  });
                                }}
                              />
                            )}
                            <Row
                              justify={"space-between"}
                              style={{ margin: "20px 0 0", marginTop: 20 }}
                              gutter={[20, 20]}
                            >
                              {loadingCourse ? (
                                <>
                                  <Col flex={1}>
                                    <Skeleton.Button block />
                                  </Col>
                                  <Col flex={1}>
                                    <Skeleton.Button block />
                                  </Col>{" "}
                                </>
                              ) : (
                                <>
                                  <Col flex={1}>
                                    <Button block>Preview</Button>
                                  </Col>
                                  <Col flex={1}>
                                    <Button
                                      onClick={() => {
                                        openModal(
                                          <SetCourseRules />,
                                          {
                                            title: "Set Rules",
                                          }
                                        );
                                      }}
                                      block
                                      type="primary"
                                    >
                                      Set Rules
                                    </Button>
                                  </Col>
                                </>
                              )}
                            </Row>
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Spin
                            tip="Please wait.."
                            spinning={
                              deletingSection ||
                              loadingCourse
                            }
                          >
                            <CourseSectionsNavigator
                              deleteSection={deleteSection}
                              onAddNewItem={onAddNewItem}
                              onAddSection={onAddSection}
                            />
                          </Spin>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={17}>
                      {/* {!course.sections.length ? (
                        <Alert
                          message="Generate course structure using AI"
                          description="You can generate course outline using our AI"
                          type="info"
                          showIcon
                          action={
                            <GenerateWithAI
                              courseId={course._id}
                              fields={["sections"]}
                              onValuesChange={({ sections }: any) => {
                                updateCourse(
                                  {
                                    id: courseId || "",
                                    data: {
                                      // @ts-ignore
                                      sections: sections.sections,
                                    },
                                  },
                                  {
                                    onSuccess: () => {
                                      navigate("");
                                    },
                                  }
                                );
                              }}
                            />
                          }
                        />
                      ) : null} */}
                      <Card>
                        <Outlet context={{ language: l.value }} />
                      </Card>
                    </Col>
                  </Row>
                ),
              };
            })}
          />
        </Form>
      </Header>
    </AppProvider>
  );
}

export default CourseBuilderScreen;
