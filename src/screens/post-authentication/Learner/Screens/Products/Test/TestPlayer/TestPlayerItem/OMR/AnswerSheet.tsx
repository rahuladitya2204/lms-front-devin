import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Image,
  Modal,
  Radio,
  Row,
  Skeleton,
  Space,
  Spin,
  Typography,
  message,
} from "@Lib/index";
import { Enum, Learner, Store } from "@adewaskar/lms-common";
import OMRComponent, { OMRSKeleton } from "./OMRComponent";
import React, { useEffect } from "react";
import { Text, Title } from "@Components/Typography/Typography";
import { useNavigate, useParams } from "@Router/index";

import ActionModal from "@Components/ActionModal/ActionModal";
const AnswerSheetFiles = React.lazy(() => import("./AnswerSheetFiles"));
// import AnswerSheetFiles from './AnswerSheetFiles'
import AppImage from "@Components/Image";
import Header from "@Components/Header";
import LearnerLogin from "@Learner/Screens/Login";
import ProductCheckoutButton from "@Components/CheckoutButton";
import { ReloadOutlined } from "@ant-design/icons";
import TestEnrolledCta from "../../../TestDetail/TestEnrolledCta";
import { openWindow, useText } from "@Components/Editor/SunEditor/utils";
import useBreakpoint from "@Hooks/useBreakpoint";
import useMessage from "@Hooks/useMessage";
import { useModal } from "@Components/ActionModal/ModalContext";
import { useQueryClient } from "@tanstack/react-query";
import { LogEvent } from "@ServerHooks/useDehydration";

const onfirm = Modal.confirm;

interface OMRComponentPropsI {
  testId?: string;
  closeModal?: Function;
}

const AnswerSheet: React.FC<OMRComponentPropsI> = ({
  testId: TEST_ID,
  closeModal,
}) => {
  const qc = useQueryClient();
  const params = useParams();
  const testId = (TEST_ID || params.testId) + "";
  const { data: test, isLoading: loadingTest } =
    Learner.Queries.useGetTestDetails(testId, Enum.TestDetailMode.TEST);
  const isEnrolled = Learner.Queries.useIsLearnerEnrolledToProduct({
    type: Enum.ProductType.TEST,
    id: test._id,
  });
  const { isFetching: loadingEnrolledProduct, data: ep } =
    Learner.Queries.useGetEnrolledProductDetails({
      type: Enum.ProductType.TEST,
      id: test._id,
    });
  const {
    data: { status },
  } = Learner.Queries.useGetTestResult(testId, {
    enabled: !!ep?.metadata?.test.endedAt,
  });
  const { mutate: startTest, isLoading: startingTest } =
    Learner.Queries.useStartTest(testId + "");
  const allLoading = loadingTest || loadingEnrolledProduct;
  const { openModal } = useModal();
  const { isMobile } = useBreakpoint();
  const navigate = useNavigate();
  const { mutate: endTest, isLoading: submittingTest } =
    Learner.Queries.useEndTest(testId + "");
  const { isDesktop } = useBreakpoint();
  const { FormatLangText } = useText(ep.metadata.test.language);
  const SubmitTestButton = (
    <Button
      disabled={!ep.metadata.test.responses.length}
      block={!isDesktop}
      onClick={() => {
        LogEvent("Test", "End Test::Clicked", `${test.title}}`, {
          testId: test._id,
          clickedFrom: "Answer Sheet",
        });
        confirm({
          title: "Are you sure?",
          // icon: <ExclamationCircleOutlined />,
          content: `You want to submit this test?`,
          onOk() {
            endTest(undefined, {
              onSuccess: () => {
                LogEvent("Test", "End Test::Success", `${test.title}}`, {
                  testId: test._id,
                  clickedFrom: "Answer Sheet",
                });
                message.open({
                  type: "success",
                  content: `Test Submitted Successfully`,
                });
                navigate("../completed");
              },
            });
          },
          okText: FormatLangText('YES_SUBMIT'),
        });
      }}
      type="primary"
      danger
      loading={submittingTest}
    >
      {FormatLangText('SUBMIT_TEST')}
    </Button>
  );

  const UploadAnswerSheetButton = (
    <Button
      onClick={() => {
        console.log(isMobile, "momom");
        if (isMobile) {
          openWindow(
            `/app/test/${testId}/upload-answer-sheet`,
            (refetchTestStatus: boolean) => {
              // debugger;
              if (refetchTestStatus) {
                message.open({
                  type: "success",
                  content: `Answer Sheet Recorded successfully`,
                });
                qc.invalidateQueries([`GET_TEST_STATUS`, testId]);
              }
            }
          );
        } else {
          openModal(<AnswerSheetFiles testId={testId + ""} />);
        }
      }}
      block
    >
      {FormatLangText('UPLOAD_ANSWER_SHEET')}
    </Button>
  );

  if (allLoading) {
    return <OMRSKeleton />;
  }
  return (
    <Header title={test.title}>
      <Row gutter={[20, 20]}>
        <Col xs={0} sm={0} md={1} />
        <Col xs={24} sm={24} md={22}>
          <>
            <div>
              {isEnrolled ? (
                <TestEnrolledCta testId={testId}>
                  <Card title="Answer Sheet" extra={UploadAnswerSheetButton}>
                    <OMRComponent testId={testId} />
                    {ep.metadata.test.responses.length ? (
                      <Alert
                        type="info"
                        message={`Please confirm your filled bubble count, Filled bubbles: ${ep.metadata.test.responses.length}`}
                      />
                    ) : null}
                    <Divider />
                    <Row justify={"space-between"}>
                      <Col flex={1}>
                        <Alert
                          action={!isMobile ? SubmitTestButton : null}
                          style={{ marginBottom: 10, marginRight: 10 }}
                          message={
                            ep.metadata.test.responses.length
                              ? "Once submitted, you won't be able to resubmit, Please double check your answers and click on Save Answers."
                              : "None of the responses have been recorded, Please click on Save Answers before submitting"
                          }
                          type="error"
                          showIcon
                        />
                      </Col>
                      {isMobile ? (
                        <Col xs={isMobile ? 24 : ""}>{SubmitTestButton}</Col>
                      ) : null}
                    </Row>
                  </Card>
                </TestEnrolledCta>
              ) : (
                <Card>
                  <Row gutter={[20, 20]}>
                    <Col span={24}>
                      <AppImage
                        width={"100%"}
                        height={200}
                        preview={false}
                        src={test.thumbnailImage}
                      />
                    </Col>
                    <Col span={24}>
                      <ProductCheckoutButton
                        ctaText="Click here to enroll and fill answer sheet"
                        onSuccess={() => {
                          // message.open({
                          //   type: 'success',
                          //   content: `You have enrolled successfully`,
                          //   particle: true
                          // })
                          startTest(
                            {
                              language: `eng`,
                            },
                            {
                              onSuccess: (rr) => {
                                console.log("STARTED TEST", rr);
                                message.open({
                                  type: "success",
                                  content: "All the best!",
                                });
                                // navigate('../player')
                              },
                            }
                          );
                        }}
                        product={{ type: "test", id: testId + "" }}
                        block
                        type="primary"
                      >
                        {/* {isFree?'Try Now':'Buy Now'} */}
                      </ProductCheckoutButton>
                    </Col>
                  </Row>
                </Card>
              )}
            </div>
          </>
        </Col>
        <Col xs={0} sm={0} md={1}>
          {" "}
        </Col>
      </Row>
    </Header>
  );
};

export default AnswerSheet;
