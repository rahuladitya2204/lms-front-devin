import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Modal,
  Row,
  Skeleton,
  Spin,
  Tag,
  message,
} from "@Lib/index";
import * as React from "react";
import { Constants, Enum, Types, Utils } from "@adewaskar/lms-common";
import {
  ExportOutlined,
  InfoCircleOutlined,
  LinkOutlined,
  MenuOutlined,
  SafetyCertificateOutlined,
  SaveOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "@Router/index";

import ActionDrawer from "@Components/ActionDrawer";
import BackButton from "@Components/BackButton";
import Tabs from "@Components/Tabs";
import TestInformationEditor from "./TestInformation";
import TestLearners from "./TestLearners/TestLearners";
import { User } from "@adewaskar/lms-common";
import useBreakpoint from "@Hooks/useBreakpoint";
import useMessage from "@Hooks/useMessage";

const { confirm } = Modal;

const TestEditor = () => {
  const { id } = useParams();
  const testId = id + "";
  const [form] = Form.useForm();
  const { mutate: updateTestApi, isLoading: loading } =
    User.Queries.useUpdateTest();

  const { data: test, isFetching: loadingTest } =
    User.Queries.useGetTestDetails(testId, {
      enabled: !!testId,
    });

  const { mutate: publishTest, isLoading: publishingTest } =
    User.Queries.usePublishTest();

  useEffect(() => {
    if (test.live.scheduledAt) {
      console.log(test, "fff");
      // @ts-ignore
      test.live.scheduledAt = dayjs(test.live.scheduledAt);
    }

    form.setFieldsValue(test);
  }, [test]);

  // const saveTest = (e: Partial<Types.Test>) => {
  //   setTest({
  //     ...test,
  //     ...e,
  //   });
  // };
  const updateTest = (test: Types.Test) => {
    updateTestApi(
      {
        id: testId,
        data: test,
      },
      {
        onSuccess: () => {
          message.open({
            type: "success",
            content: "Saved",
          });
        },
      }
    );
  };
  const { validatePublishTest } = Utils.useValidateTest(test);
  const navigate = useNavigate();
  // const { isMobile } = useBreakpoint();
  const MainNavTabs = (
    <Tabs
      tabKey="test-creator"
      // navigateWithHash
      onTabClick={(e) => {
        if (e === "builder") {
          navigate(`../${test._id}/builder`);
        }
      }}
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
          children: <TestInformationEditor />,
        },

        {
          label: (
            <span>
              <UserOutlined />
              Learners
            </span>
          ),
          key: "learners",
          children: <TestLearners testId={test._id + ""} />,
        },
        {
          label: (
            <span>
              <SafetyCertificateOutlined />
              Certificate
            </span>
          ),
          key: "certificate",
          children: null,
          //   (
          //   <TestCertificate
          //     testId={test._id}
          //     test={test}
          //     saveTest={saveTest}
          //   />
          // )
        },
      ]}
    />
  );
  return (
    <Spin spinning={publishingTest}>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Card
            title={
              <span>
                <BackButton
                  disabled={!test.category}
                  onClick={() =>
                    navigate(`/admin/products/test?test-list=${test.category}`)
                  }
                />{" "}
                {test.title}
                {test.status === Enum.TestStatus.PUBLISHED ? (
                  <Tag style={{ marginLeft: 10 }} color="green">
                    Test is published
                  </Tag>
                ) : (
                  <Button
                    disabled={!validatePublishTest()}
                    onClick={() => {
                      confirm({
                        title: "Are you sure?",
                        content: `You want to publish this Test?`,
                        onOk() {
                          publishTest({
                            testId: test._id + "",
                          });
                        },
                        okText: "Yes, Publish",
                      });
                    }}
                    style={{ marginLeft: 15 }}
                    icon={<UploadOutlined />}
                  >
                    Publish Test
                  </Button>
                )}
              </span>
            }
            extra={[
              <Link to={`/admin/products/test/${test._id}/builder`}>
                <Button
                  disabled={!(test._id && test.category)}
                  icon={<ExportOutlined />}
                  style={{ marginRight: 10 }}
                >
                  Go to Test Builder
                </Button>
              </Link>,
              <Button
                loading={loading}
                type="primary"
                onClick={form.submit}
                icon={<SaveOutlined />}
              >
                Save as draft
              </Button>,
              //   isMobile?<ActionDrawer cta={<Button icon={<MenuOutlined/>}></Button>}>
              //   {MainNavTabs}
              // </ActionDrawer>:null
            ]}
          >
            <Form onFinish={updateTest} layout="vertical" form={form}>
              {MainNavTabs}
            </Form>
          </Card>
        </Col>
        {/* <Col span={20}>
          <TestInformationEditor />
        </Col> */}
      </Row>
    </Spin>
  );
};

const MemoedTestEditor = React.memo(TestEditor);

export default MemoedTestEditor;
