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
import { Outlet } from "react-router";
import { Link, useNavigate, useParams } from "@Router/index";
import { SaveOutlined, UploadOutlined } from "@ant-design/icons";
import { cloneDeep, debounce } from "lodash";
import { useEffect, useState } from "react";

import ActionModal from "@Components/ActionModal/ActionModal";
import AppProvider from "screens/AppProvider";
import BackButton from "@Components/BackButton";
import CourseSectionsNavigator from "./CourseSectionsNavigator";
import GenerateWithAI from "../CourseInformation/GenerateWithAiButton";
import Header from "@Components/Header";
import Image from "@Components/Image";
import MediaUpload from "@Components/MediaUpload";
import SetCourseRules from "./SetCourseRules";
import { updateCourseSectionItem } from "./utils";
import useMessage from "@Hooks/useMessage";
import { useModal } from "@Components/ActionModal/ModalContext";
import Tabs from "@Components/Tabs";
import { useCourseStore } from "./useCourseStore";
import useUpdateCourseForm from "./UploadItems/useUpdateCourseForm";

const { confirm } = Modal;

function CourseBuilderScreen() {
  const { id: courseId, itemId } = useParams();
  const { course, setCourse } = useCourseStore((s) => s);
  const { mutate: updateCourse, isLoading: savingCourse } =
    User.Queries.useUpdateCourse();
  const { data: courseDetails, isLoading: loadingCourse } =
    User.Queries.useGetCourseDetails(courseId + "", {
      enabled: !!courseId,
    });

  const { mutate: deleteSectionApi, isLoading: deletingSection } =
    User.Queries.useDeleteCourseSection();
  const { mutate: deleteSectionItemApi, isLoading: deletingSectionItem } =
    User.Queries.useDeleteCourseSectionItem();
  const navigate = useNavigate();

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

  const onAddNewItem = (
    type: string,
    item: Partial<Types.CourseSectionItem>,
    index: number
  ) => {
    // debugger;
    let COURSE = cloneDeep(course);
    const sectionId = COURSE.sections[index]._id;
    const newItem: Partial<Types.CourseSectionItem> = {
      title: {
        text: Constants.INITIAL_LANG_TEXT,
      },
      // _id: '',
      // fix later
      type,
      metadata: item.metadata,
      section: sectionId,
    };
    if (item._id) {
      COURSE.sections[index].items.forEach((i, itemIndex) => {
        if (i._id === item._id) {
          // @ts-ignore
          COURSE.sections[index].items[itemIndex] = {
            ...item,
            ...newItem,
            type,
          };
        }
      });
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

  useEffect(() => {
    setCourse(courseDetails);
  }, [courseDetails]);

  const updateCourseSection = (
    sectionId: string,
    item: Types.CourseSectionItem
  ) => {
    const COURSE = cloneDeep(course);
    COURSE.sections = updateCourseSectionItem(COURSE.sections, sectionId, item);
    setCourse(COURSE);
    // saveCourse(COURSE)
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

  const deleteSectionItem = (sectionId: string, itemId: string) => {
    const COURSE = cloneDeep(course);
    // COURSE.sections[sectionIndex].items.splice(itemIndex, 1)
    deleteSectionItemApi(
      {
        data: {
          courseId: courseId + "",
          sectionId: sectionId,
          itemId: itemId,
        },
      },
      {
        onSuccess: () => {
          const lastSection = course.sections.pop();
          const lastItem = lastSection?.items.pop();
          if (lastSection && lastItem && lastItem.type)
            navigate(`${lastItem.type}/${lastItem._id}`);
        },
      }
    );
  };

  const onReorderSections = (sections: Types.CourseSection[]) => {
    const COURSE = cloneDeep(course);
    COURSE.sections = sections;
    setCourse(COURSE);
  };
  // const { mutate: updateCourseStatus } = User.Queries.useUpdateCourseStatus(
  //   courseId + ''
  // )
  const items = course.sections.map((s) => s.items).flat();
  // console.log(course.sections, items, 'nodeee')
  const { mutate: publishCourse, isLoading: publishingCourse } =
    User.Queries.usePublishCourse();
  const { mutate: unpublishCourse, isLoading: unpublishingCourse } =
    User.Queries.useUnpublishCourse();
  const { openModal } = useModal();
  const { language, setLanguage } = useCourseStore((s) => s);
  const { onFormChange, updateItem } = useUpdateCourseForm(itemId + "");
  const item = useCourseStore((s) => s.currentItem);
  const [form] = Form.useForm();

  useEffect(() => {
    // console.log(item, "okokok");
    const i = {
      ...item,
    };
    if (!item.topic) {
      // @ts-ignore
      i.topic = null;
    }
    form.setFieldsValue(i);
  }, [item, language]);

  useEffect(() => {
    if (course.languages.length) {
      setLanguage(course.languages[0]);
    }
  }, [course.languages]);

  return (
    <AppProvider>
      <Header
        title={
          <span>
            {" "}
            <BackButton
              onClick={() => navigate("/admin/products/courses")}
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
                    okText: "Yes, Unpublish",
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
                onClick={() => saveCourse()}
                type="primary"
                style={{ marginRight: 10 }}
              >
                Save Changes
              </Button>
            </>
          ),
          // <Button
          //   onClick={() => saveCourse(course)}
          //   loading={loading}
          //   type="primary"
          //   icon={<SaveOutlined />}
          // >
          //   Save
          // </Button>
        ]}
      >
        <Form
          name="course builder"
          initialValues={item}
          onValuesChange={(changedValues, allValues) => {
            // console.log(allValues, "allValues");
            onFormChange({
              ...allValues,
            });
          }}
          form={form}
          layout="vertical"
        >
          {Constants.LANGUAGES.filter((l) =>
            course?.languages?.includes(l.value)
          ).map((l) => {
            return (
              <Button
                type={l.value === language ? "primary" : "default"}
                onClick={() => setLanguage(l.value)}
                size="small"
              >
                {l.label}
              </Button>
            );
          })}
          {Constants.LANGUAGES.filter((l) =>
            course?.languages?.includes(l.value)
          ).map((l) => {
            return (
              <div style={{ display: l.value === language ? "block" : "none" }}>
                <Row gutter={[16, 16]}>
                  <Col span={8}>
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
                                        <SetCourseRules
                                          onSubmit={(d) =>
                                            saveCourse({
                                              rules: d,
                                            })
                                          }
                                          data={course.rules}
                                        />,
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
                                  {/* <ActionModal
                                  title="Set Rules"
                                  cta={
                                    <Button block type="primary">
                                      Set Rules
                                    </Button>
                                  }
                                >
                                  <SetCourseRules
                                    onSubmit={d =>
                                      saveCourse({
                                        rules: d
                                      })
                                    }
                                    data={course.rules}
                                  />
                                </ActionModal> */}
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
                            deletingSectionItem ||
                            loadingCourse
                          }
                        >
                          <CourseSectionsNavigator
                            // language={language}
                            deleteSectionItem={deleteSectionItem}
                            deleteSection={deleteSection}
                            onAddNewItem={onAddNewItem}
                            onAddSection={onAddSection}
                            sections={course.sections}
                            onReorderSections={onReorderSections}
                          />
                        </Spin>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={16}>
                    {!course.sections.length ? (
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
                    ) : null}
                    <Card>
                      <Outlet
                        context={[items, updateCourseSection, saveCourse]}
                      />
                    </Card>
                  </Col>
                </Row>
              </div>
            );
          })}
        </Form>
      </Header>
    </AppProvider>
  );
}

export default CourseBuilderScreen;
