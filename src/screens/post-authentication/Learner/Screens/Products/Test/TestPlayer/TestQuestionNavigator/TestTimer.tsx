import {
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  List,
  Progress,
  Row,
  Skeleton,
  Spin,
  Tag,
} from "antd";
import { CheckCircleTwoTone, InfoCircleOutlined } from "@ant-design/icons";
import { Fragment, useMemo } from "react";
import { Enum, Learner, Store } from "@adewaskar/lms-common";

import Countdown from "@Components/Countdown";
import { NavLink } from "@Router/index";
import { Typography } from "@Components/Typography";
import dayjs from "dayjs";
import styled from "styled-components";
import useBreakpoint from "@Hooks/useBreakpoint";
import useCountdownTimer from "@Hooks/useCountdownTimer";
import { useText } from "@Components/Editor/SunEditor/utils";

interface TestQuestionNavigatorType2PropsI {
  testId: string;
  questionId: string;
  language: string;
}

const { Text, Title } = Typography;

interface TestTimerPropsI {
  testId: string;
}

export default function TestTimer(props: TestTimerPropsI) {
  const { data: ep } = Learner.Queries.useGetEnrolledProductDetails({
    type: Enum.ProductType.TEST,
    id: props.testId + ''
  })
  const { data: test, isLoading: loadingTest } =
    Learner.Queries.useGetTestDetails(props.testId + "");
  const {
    data: {
      status: { startedAt, hasStarted, hasEnded },
    },
    isLoading: loadingStatus,
  } = Learner.Queries.useGetTestStatus(props.testId + "");

  const endingAt = useMemo(
    () => dayjs(startedAt).add(test.duration.value, "minutes").toString(),
    [startedAt, test]
  );

  const { percentLeft } = useCountdownTimer(endingAt);
  const { FormatLangText } = useText(ep.metadata.test.language);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 0,
      }}
      title="Time Spent"
    >
      {loadingTest || loadingStatus ? (
        <Skeleton.Button
          active
          shape="circle"
          style={{ width: 200, height: 200 }}
        />
      ) : hasStarted && !hasEnded ? (
        <Progress
          size={200}
          format={(percent) => {
            return (
              <Row>
                <Col span={24}>
                  {percent === 100 ? (
                    <Title type="secondary" style={{ fontSize: 18 }}>
                      Test has ended
                    </Title>
                  ) : (
                    <>
                      <Title type="secondary" style={{ fontSize: 18 }}>
                        {FormatLangText('TIME_REMAINING')}
                      </Title>
                      <Title style={{ marginTop: 0, fontSize: 25 }}>
                        <Countdown targetDate={endingAt} />
                      </Title>
                    </>
                  )}
                </Col>
              </Row>
            );
          }}
          type="circle"
          percent={Math.ceil(100 - percentLeft)}
        />
      ) : null}
    </div>
  );
}

