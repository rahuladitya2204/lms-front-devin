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
import CreateCustomContentComponent from "./CreateCustomContent";

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

  const deleteSectionItem = (itemId: string, cb) => {
    const COURSE = course;
    deleteSectionItemApi(
      {
        data: {
          courseId: courseId + "",
          itemId: itemId,
        },
      },
      {
        onSuccess: () => {
          const lastSection = COURSE.sections.pop();
          const lastItem = lastSection?.items.pop();
          if (lastSection && lastItem)
            navigate(`/admin/products/courses/${courseId}/builder/${lastItem.type}/${lastItem._id}`);
          cb && cb();
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
  const { setLanguage } = useCourseStore((s) => s);
  const [form] = Form.useForm();
  const { onFormChange, updateItem } = useUpdateCourseForm(itemId + "", form);
  const item = useCourseStore((s) => s.currentItem);

  useEffect(() => {
    if (course.languages.length) {
      setLanguage(course.languages[0]);
    }
  }, [course.languages]);

  // useEffect(() => {
  //   if (item && (item._id === itemId)) {
  //     form.setFieldsValue(item)
  //   }
  // }, [itemId]);

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
          <Tabs tabBarExtraContent={{
            right: <Button onClick={() => {
              confirm({
                title: "Are you sure?",
                // icon: <ExclamationCircleOutlined />,
                content: `You want to delete this chapter?`,
                onOk() {
                  deleteSectionItem(itemId + '', () => {
                    message.success('Chapter deleted successfully')
                  })
                },
                okText: "Delete Chapter",
              })
            }} danger size='small' type='primary'>Delete Chapter Item</Button>
          }}
            tabPosition="top"
            type="card"
            onTabClick={(e) => {
              setLanguage(e);
              console.log(e, "eee");
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
                      <Card
                      // extra={
                      //   <Button
                      //     onClick={() => {
                      //       openModal(<CreateCustomContentComponent />);
                      //     }}
                      //   >
                      //     Generate Content
                      //   </Button>
                      // }
                      >
                        <Outlet
                          context={[
                            items,
                            updateCourseSection,
                            saveCourse,
                            l.value,
                          ]}
                        />
                        {/* <AddTextItem language={l.value} /> */}

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
