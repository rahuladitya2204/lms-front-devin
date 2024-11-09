import {
  Alert,
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Modal,
  Row,
  Space,
  Spin,
  Tag,
  message,
} from "@Lib/index";
import { Constants, Enum, Types, User } from "@adewaskar/lms-common";
import { Outlet } from "react-router";
import { Link, useNavigate, useParams } from "@Router/index";

import ActionModal from "@Components/ActionModal/ActionModal";
import AppProvider from "screens/AppProvider";
import BackButton from "@Components/BackButton";
import Header from "@Components/Header";
import Image from "@Components/Image";
import MediaUpload from "@Components/MediaUpload";
import MoreButton from "@Components/MoreButton";
import PrintPrompt from "./PrintPrompt";
import SetTestRules from "./SetTestRules";
import TestOutline from "./TestOutline";
import TestSectionsNavigator from "./TestSectionsNavigator";
import { updateTestSectionItem } from "@User/Screens/Courses/CourseEditor/CourseBuilder/utils";
import { useEffect, useMemo } from "react";
import useMessage from "@Hooks/useMessage";
import { useModal } from "@Components/ActionModal/ModalContext";
import useTestBuilderUI from "./hooks/useTestBuilder";
import { useTestStore } from "./hooks/useTestStore";
import TestCreatorFromBank from "./TestCreatorFromBank";
import { htmlToText } from "html-to-text";
import { promises } from "dns";
import { cloneDeep } from "lodash";

const { confirm } = Modal;

function TestBuilderScreen() {
  const { mutate: updateTest, isLoading: savingTest } =
    User.Queries.useUpdateTest();

  const { mutate: generateTestFromPDF, isLoading: generatingTestFromPDF } =
    User.Queries.useGenerateTestFromPDF();

  const { test, setTest } = useTestStore((s) => s);

  const { id: testId, itemId } = useParams();
  const {
    data: testDetails,
    isFetching: loadingTest,
    isLoading: loadingTestFirst,
  } = User.Queries.useGetTestDetails(testId + "", {
    enabled: !!testId,
  });
  const { mutate: deleteSectionApi, isLoading: deletingSection } =
    User.Queries.useDeleteTestSection();
  const { getNavigator } = useTestBuilderUI();
  const { mutate: deleteSectionItemApi, isLoading: deletingSectionItem } =
    User.Queries.useDeleteTestSectionItem();
  const navigate = useNavigate();
  const { mutate: generateTestInfo } = User.Queries.useGetGenerativeTestInfo(
    testId + ""
  );
  const onAddSection = (section: Partial<Types.TestSection>) => {
    console.log(section, "section");
    let TEST = test;
    if (section._id) {
      TEST.sections.forEach((sec, index) => {
        if (sec._id === section._id) {
          TEST.sections[index] = { ...sec, ...section };
        }
      });
    } else {
      // @ts-ignore
      const newSection: Types.TestSection = {
        title: section.title + "",
        items: [],
      };
      TEST.sections.push(newSection);
    }

    updateTest(
      {
        id: testId || "",
        data: {
          sections: TEST.sections,
        },
      },
      {
        onSuccess: (test) => {
          // if (item._id) {
          //   return navigate(`${item._id}`)
          // }
          const newlyAdedItem = test.sections.pop().items.pop();
          console.log(test.sections, "newlyAdedItem");
          navigate(
            `/admin/products/test/${TEST._id}/builder/${newlyAdedItem?._id}`
          );
        },
      }
    );
  };

  const onAddNewItem = (item: Partial<Types.TestQuestion>, index: number) => {
    // debugger;
    let TEST = test;
    const newItem: Partial<Types.TestQuestion> = {
      ...item,
    };
    // console.log(test, 'livviviv')

    if (item._id) {
      TEST.sections[index].items.forEach(
        (i: Types.TestQuestion, itemIndex: number) => {
          if (i._id === item._id) {
            // @ts-ignore
            TEST.sections[index].items[itemIndex] = {
              ...item,
              ...newItem,
            };
          }
        }
      );
    } else {
      // @ts-ignore
      TEST.sections[index].items.push(newItem);
    }
    updateTest(
      {
        id: testId || "",
        data: {
          sections: TEST.sections,
        },
      },
      {
        onSuccess: (test) => {
          // if (item._id) {
          //   return navigate(`${item._id}`)
          // }
          const newlyAdedItem = [...test.sections[index].items].pop();
          // console.log(test.sections, 'newlyAdedItem')
          navigate(
            `/admin/products/test/${TEST._id}/builder/${newlyAdedItem?._id}`
          );
        },
      }
    );
  };

  useEffect(() => {
    setTest(testDetails);
  }, [testDetails]);

  const saveTest = () => {
    const Data = test;
    if (test._id) {
      updateTest(
        {
          id: testId + "",
          data: Data,
        },
        {
          onSuccess: () => {
            message.open({
              type: "success",
              content: "Saved Changes",
            });
          },
        }
      );
    }
  };
  const firstSection = test.sections.find((s) => s.items.length);
  const firstItem = firstSection?.items[0];
  useEffect(() => {
    if (!itemId) {
      const firstSection = test.sections.find((s) => s.items.length);
      if (firstSection && firstSection.items.length) {
        const firstItem = firstSection.items[0];
        if (firstItem.type) {
          navigate(`/admin/products/test/${testId}/builder/${firstItem._id}`);
        }
      }
    }
  }, [test._id]);

  const updateTestSection = (itemId: string, item: Types.TestQuestion) => {
    item._id = itemId;
    const TEST = test;
    TEST.sections = updateTestSectionItem(TEST.sections, item);

    setTest({
      sections: TEST.sections,
    });
  };

  const deleteSection = (sectionId: string) => {
    deleteSectionApi(
      {
        data: {
          testId: testId + "",
          sectionId: sectionId,
        },
      },
      {
        onSuccess: () => {
          const lastSection = test.sections.pop();
          const lastItem = lastSection?.items.pop();
          if (lastSection && lastItem)
            navigate(`/admin/products/test/${testId}/builder/${lastItem._id}`);
        },
      }
    );
  };

  const deleteSectionItem = (sectionId: string, itemId: string) => {
    const TEST = test;
    deleteSectionItemApi(
      {
        data: {
          testId: testId + "",
          // sectionId: sectionId,
          itemId: itemId,
        },
      },
      {
        onSuccess: () => {
          const lastSection = test.sections.pop();
          const lastItem = lastSection?.items.pop();
          if (lastSection && lastItem)
            navigate(`/admin/products/test/${testId}/builder/${lastItem._id}`);
        },
      }
    );
  };

  const onReorderSections = (sections: Types.TestSection[]) => {
    const TEST = test;
    TEST.sections = sections;
    setTest(TEST);
  };
  const { mutate: unpublishTest, isLoading: unpublishingTest } =
    User.Queries.useUnpublishTest();
  const isTestEnded =
    test.live.enabled && test.status === Enum.TestStatus.ENDED;
  const { openModal } = useModal();
  const langs = test.languages;
  const { mutateAsync: translateQuestion, isLoading: translatingQuestion } =
    User.Queries.useTranslateQuestion();

  const { mutateAsync: rephraseQuestion, isLoading: rephrasingQuestions } =
    User.Queries.useRephraseText();
  return (
    <AppProvider>
      <Header
        title={
          <span>
            {" "}
            {/* <Link to={`/admin/products/test/${testId}/editor`}> */}
            <BackButton
              onClick={() => navigate(`/admin/products/test/${testId}/editor`)}
              // @ts-ignore
              disabled={!test.category}
            />
            {/* </Link> */}
            <Space>
              {test.title}{" "}
              {test.live.enabled ? (
                <Tag color="blue-inverse">Live Test</Tag>
              ) : null}
              {/* {!isAssignedTopics ? (
                <Alert message="Topic assigning is pending" />
              ) : null} */}
            </Space>
          </span>
        }
        extra={[
          <Row>
            {" "}
            {/* <Col span={24}>
              {!test.sections.length ? null : (
                <ActionModal
                  title="Reset Test Outline"
                  width={900}
                  cta={
                    <Button
                      style={{ marginRight: 20 }}
                      danger
                      type="primary"
                      size="small"
                    >
                      Reset Test Outline
                    </Button>
                  }
                >
                  <TestOutline testId={testId + ''} />
                </ActionModal>
                // <ActionModal
                //       title="Reset Test Outline"
                //       width={900}
                //       cta={
                //         <Button  style={{marginRight:20}} danger type='primary' size="small">Reset Test Outline</Button>
                //       }
                //     >
                //       <TestOutline testId={testId + ''} />
                //     </ActionModal>
              )}
            </Col> */}
          </Row>,
          test.status === Enum.TestStatus.PUBLISHED ? (
            <Space>
              {" "}
              <Tag color="green">Test is Published</Tag>{" "}
            </Space>
          ) : (
            <Space>
              {isTestEnded ? <Tag color="green">Test has ended</Tag> : null}
            </Space>
          ),
          <Dropdown.Button
            loading={savingTest || translatingQuestion || rephrasingQuestions}
            onClick={() => saveTest()}
            trigger={["click"]}
            menu={{
              items: [
                {
                  label: "Generate Test Outline",
                  key: "generate-outline",
                  onClick: () =>
                    openModal(<TestOutline testId={testId + ""} />, {
                      width: 760,
                    }),
                },
                // {
                //   label: "Generate Test From PDF",
                //   key: "generate-test-from-pdf",
                //   onClick: () =>
                //     generateTestFromPDF(
                //       {
                //         testId: testId + "",
                //       },
                //       {
                //         onSuccess: (d) => {
                //           message.success("Test Generated Successfully");
                //           console.log("Done", d);
                //         },
                //       }
                //     ),
                // },
                // {
                //   key: "translate-question",
                //   label: (
                //     <>
                //       Translate to{" "}
                //       {langs
                //         .map(
                //           (l) =>
                //             Constants.LANGUAGES.find((o) => o.value === l)
                //               ?.label
                //         )
                //         .join(", ")}
                //     </>
                //   ),
                //   onClick: async () => {
                //     const promises = test.sections
                //       .map((section, secIndex) => {
                //         return section.items.map((item) => {
                //           return langs.map(async (language) => {
                //             const O = item.title.text;
                //             const lng = Object.keys(O).find((key) =>
                //               htmlToText(O[key])
                //             );
                //             const body = {
                //               title: item.title.text[lng],
                //               itemId: item._id,
                //               options: item.options.map(
                //                 (option) => option.text[lng]
                //               ),
                //               language: Constants.LANGUAGES.find(
                //                 (o) => o.value === language
                //               )?.label,
                //             };
                //             const translation = await translateQuestion(body);
                //             if (translation && translation.title) {
                //               translation.language = language;
                //               translation.itemId = body.itemId;
                //               return translation;
                //             }
                //             return null;
                //           });
                //         });
                //       })
                //       .flat(2); // Flatten the array of promises

                //     const translations = (await Promise.all(promises)).filter(
                //       Boolean
                //     ); // Filter out null results

                //     const TTEST = cloneDeep(test);

                //     // Group translations by section and item
                //     const translationMap = {};
                //     translations.forEach((translation) => {
                //       if (!translationMap[translation.itemId]) {
                //         translationMap[translation.itemId] = [];
                //       }
                //       translationMap[translation.itemId].push(translation);
                //     });

                //     // Update the test sections with the translations
                //     TTEST.sections.forEach((section) => {
                //       section.items.forEach((item) => {
                //         const itemTranslations = translationMap[item._id] || [];
                //         itemTranslations.forEach((translation) => {
                //           if (translation && translation.title) {
                //             item.title.text[translation.language] =
                //               translation.title;
                //             item.options.forEach((option, index) => {
                //               if (translation.options[index]) {
                //                 option.text[translation.language] =
                //                   translation.options[index];
                //               }
                //             });
                //           }
                //         });
                //       });
                //     });

                //     setTest(TTEST);
                //   },
                // },
                // {
                //   key: "rephrase-question",
                //   label: <>Rephrase Questions</>,
                //   onClick: async () => {
                //     console.log("tulurrrr", langs);
                //     const promises = test.sections
                //       .map((section, secIndex) => {
                //         return section.items.map((item) => {
                //           return langs.map(async (language) => {
                //             const O = item.title.text;
                //             const lng = Object.keys(O).find((key) =>
                //               htmlToText(O[key])
                //             );
                //             const body = {
                //               title: O[lng],
                //               itemId: item._id,
                //               language: language,
                //             };

                //             const rephrasedText: string =
                //               await rephraseQuestion({
                //                 text: body.title,
                //               });

                //             const rephrased: any = {
                //               title: rephrasedText,
                //             };
                //             if (rephrasedText) {
                //               rephrased.language = language;
                //               rephrased.itemId = body.itemId;
                //               return rephrased;
                //             }
                //             return null;
                //           });
                //         });
                //       })
                //       .flat(2); // Flatten the array of promises

                //     const translations = (await Promise.all(promises)).filter(
                //       Boolean
                //     ); // Filter out null results

                //     const TTEST = cloneDeep(test);

                //     // Group translations by section and item
                //     const translationMap = {};
                //     translations.forEach((translation) => {
                //       if (!translationMap[translation.itemId]) {
                //         translationMap[translation.itemId] = [];
                //       }
                //       translationMap[translation.itemId].push(translation);
                //     });

                //     // Update the test sections with the translations
                //     TTEST.sections.forEach((section) => {
                //       section.items.forEach((item) => {
                //         const itemTranslations = translationMap[item._id] || [];
                //         itemTranslations.forEach((translation) => {
                //           if (translation && translation.title) {
                //             console.log(item.title, translation, "opopop");
                //             item.title.text[translation.language] =
                //               translation.title;
                //           }
                //         });
                //       });
                //     });
                //     console.log(translationMap, "translationMap");
                //     setTest(TTEST);
                //   },
                // },
                {
                  label: "Create Test using Bank",
                  key: "generate-test-from-bank",
                  onClick: () =>
                    openModal(
                      <TestCreatorFromBank
                        sections={test.sections}
                        testId={testId + ""}
                      />,
                      {
                        width: 900,
                        keyboard: false,
                        title: "Create Test From Bank",
                      }
                    ),
                },
                {
                  label: `Print Action`,
                  key: "print-test",
                  onClick: () =>
                    openModal(<PrintPrompt testId={testId + ""} />, {
                      title: "Print",
                    }),
                },
                // {
                //   label: "Generate Criterias",
                //   key: "gen-criterias",
                //   onClick: () => generateTestInfo({ fields: ["criteria"] }),
                // },
                // {
                //   label: "Generate Topics",
                //   key: "gen-topics",
                //   onClick: () => generateTestInfo({ fields: ["topic"] }),
                // },
                // {
                //   key: 'enter-answers',
                //   label: (
                //     <ActionModal
                //       title="Enter Answers"
                //       width={800}
                //       cta={
                //         <Button type="text" style={{ marginRight: 10 }}>
                //           Enter Answers
                //         </Button>
                //       }
                //     >
                //       <EnterAnswers />
                //     </ActionModal>
                //   )
                // },
                {
                  key: "revert",
                  label: "Revert to draft",
                  onClick: () => {
                    confirm({
                      title: "Are you sure?",
                      // icon: <ExclamationCircleOutlined />,
                      content: `You want to Unpublish this test, It will be moved to Draft?`,
                      onOk() {
                        unpublishTest({
                          testId: testId + "",
                        });
                        message.open({
                          type: "success",
                          content: "Test has been moved to draft",
                        });
                      },
                      okText: "Yes, Unpublish",
                    });
                  },
                },
                // {
                //   label: (
                //     <ActionModal
                //       title="Generate Test Outline"
                //       width={1000}
                //       cta={
                //         <Button type="text" style={{ marginRight: 10 }}>
                //           Generate Test Outline
                //         </Button>
                //       }
                //     >
                //       <TestOutline testId={testId + ''} />
                //     </ActionModal>
                //   ),
                //   key: 'generate-test-outline'
                //   // icon: <DeleteOutlined />
                // }
                // {
                //   label: (
                //     <ActionModal
                //       title="Reset Test Outline"
                //       width={900}
                //       cta={
                //         <Button
                //           style={{ marginRight: 20 }}
                //           danger
                //           type="text"
                //         >
                //           Reset Test Outline
                //         </Button>
                //       }
                //     >
                //       <TestOutline testId={testId + ''} />
                //     </ActionModal>
                //   ),
                //   key: 'reset'
                //   // icon: <DeleteOutlined />
                // }
                // {
                //   label: `Enter Test Json`,
                //   key: 'enter-test-json'
                //   // icon: <DeleteOutlined />
                // }
              ],
            }}
            type="primary"
            // shape="circle"
            style={{ marginRight: 10 }}
          >
            Save Changes
          </Dropdown.Button>,
        ]}
      >
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card bodyStyle={{ maxHeight: "82vh", overflowY: "scroll" }}>
              <Row>
                <Col span={24}>
                  <Form.Item>
                    <MediaUpload
                      source={{
                        type: "test.thumbnailImage",
                        value: testId + "",
                      }}
                      uploadType="image"
                      compress={{ maxWidth: 330, maxHeight: 200, quality: 0.9 }}
                      prefixKey={`Tests/${testId}/thumbnailImage`}
                      cropper={{ width: 330, height: 200 }}
                      // width="100%"
                      height="200px"
                      aspect={16 / 9}
                      renderItem={() => (
                        <Image
                          height={200}
                          preview={false}
                          src={test.thumbnailImage}
                        />
                      )}
                      onUpload={(file) => {
                        setTest({
                          thumbnailImage: file.url,
                        });
                      }}
                    />
                    <Row
                      justify={"space-between"}
                      style={{ margin: "20px 0 0", marginTop: 20 }}
                      gutter={[20, 20]}
                    >
                      <Col flex={1}>
                        <Button block>Preview</Button>
                      </Col>
                      <Col flex={1}>
                        <Button
                          onClick={() => {
                            openModal(<SetTestRules testId={testId + ""} />, {
                              title: `Set Rules`,
                            });
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
                        <SetTestRules testId={testId + ''} />
                      </ActionModal> */}{" "}
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Spin
                    tip="Please wait.."
                    spinning={
                      deletingSection ||
                      getNavigator().loading ||
                      deletingSectionItem ||
                      loadingTest
                    }
                  >
                    <TestSectionsNavigator
                      testId={testId + ""}
                      deleteSectionItem={deleteSectionItem}
                      deleteSection={deleteSection}
                      onAddNewItem={onAddNewItem}
                      onAddSection={onAddSection}
                      sections={test.sections}
                      onReorderSections={onReorderSections}
                    />
                  </Spin>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={18}>
            <Row gutter={[20, 20]}>
              {/* <Col span={24}>
                <Alert
                  // style={{ marginTop: 30 }}
                  message="Enter Question in JSON"
                  // description="You can generate test outline using our AI"
                  type="warning"
                  showIcon
                  action={[
                    // <ActionModal
                    //   title="Reset Test Outline"
                    //   width={900}
                    //   cta={
                    //     <Button
                    //       type="primary"
                    //       style={{ marginRight: 10 }}
                    //       size="small"
                    //     >
                    //       Generate Test Outline
                    //     </Button>
                    //   }
                    // >
                    //   <TestOutline testId={testId + ''} />
                    // </ActionModal>,
                    <ActionModal
                      title="Enter Test Content in  JSON"
                      width={900}
                      cta={
                        <Button type="primary" size="small">
                          Enter JSON
                        </Button>
                      }
                    >
                      <EnterTestJson testId={testId + ''} />
                    </ActionModal>
                  ]}
                />
              </Col>{' '} */}
              <Col span={24}>
                <Spin spinning={loadingTest}>
                  <Outlet
                    context={{ updateTestSection, sections: test.sections }}
                  />
                </Spin>
              </Col>
            </Row>
          </Col>
        </Row>
      </Header>
    </AppProvider>
  );
}

export default TestBuilderScreen;
