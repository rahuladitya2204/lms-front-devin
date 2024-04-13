"use client";
import {
  Alert,
  Button,
  Card,
  Col,
  Collapse,
  Modal,
  Progress,
  Row,
  Select,
  Skeleton,
  Space,
  Spin,
  Tag,
  Timeline,
} from "antd";
import {
  ArrowLeftOutlined,
  LogoutOutlined,
  MenuOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Constants, Enum, Learner, Store } from "@adewaskar/lms-common";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router";

import ActionDrawer from "@Components/ActionDrawer";
import Header from "@Components/Header";
import ProctoringComponent from "@Learner/Screens/Procturing/TestProcturing";
import TestItemSkeleton from "../TestReview/TestItemSkeleton";
import TestPublicQuestionNavigator from "./PYQTestQuestionNavigator";
import { Typography } from "@Components/Typography";
import useBreakpoint from "@Hooks/useBreakpoint";
import { NavLink, useLocation, useNavigate, useParams } from "@Router/index";
import TestPlayerMoreInfo from "./PYQTestPlayerMoreInfo";
import TestPlayerSkeleton from "../TestPlayer/TestPlayerSkeleton";

// const ProctoringComponent = lazy(() => import('@Learner/Screens/Procturing/TestProcturing'));

const { confirm } = Modal;

interface TestPlayerPropsI {
  publicView?: boolean;
  children?: React.ReactNode;
  isServer?: boolean;
}

export default function TestPublicPlayer(props: TestPlayerPropsI) {
  const { testId, questionId } = useParams();
  const [lang, setLang] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { data: test, isLoading } = Learner.Queries.useGetTestDetails(
    testId + "",
    Enum.TestDetailMode.RESULT
  );

  useEffect(() => {
    if (test.languages.length) {
      setLang(test.languages[0]);
    }
  }, [test]);
  const isProcturingOn = test.rules.procturing.enabled;

  useEffect(() => {
    if (test.sections[0]?.items[0] && !questionId) {
      const itemId = test.sections[0].items[0]._id;
      navigate(`${itemId}`);
    }
    if (test.languages.length) {
      setLang(test.languages[0]);
    }
  }, [test.sections]);

  const { isTablet, isDesktop, isMobile } = useBreakpoint();

  const ExitButton = (
    <Button
      style={{ width: isDesktop ? 100 : "100%" }}
      block={!isDesktop}
      onClick={() => {
        confirm({
          title: "Are you sure?",
          // icon: <ExclamationCircleOutlined />,
          content: `You want to exit reviewing?`,
          onOk() {
            navigate(`/app/test/${testId}`);
          },
          okText: "Yes, Exit",
        });
      }}
      icon={<LogoutOutlined />}
      type="primary"
      danger
    >
      Exit
    </Button>
  );
  const QuestionNavigator = TestPublicQuestionNavigator;
  const SideDrawer = (
    <ActionDrawer
      footer={() => [
        // UpdatingTestStatus,
        ExitButton,
      ]}
      cta={<Button icon={<MenuOutlined />} />}
    >
      <QuestionNavigator questionId={questionId + ""} testId={testId + ""} />
    </ActionDrawer>
  );
  const LanguagesSelect = (
    <Select
      style={{ width: 150, marginRight: 15 }}
      value={lang}
      onChange={setLang}
      options={test.languages.map((l) => {
        return {
          label: Constants.LANGUAGES?.find((language) => language.value === l)
            ?.label,
          value: l,
        };
      })}
    />
  );
  const ChildrenWithLanguage = props.children
    ? React.cloneElement(props.children, {
        language: lang,
        isServer: props.isServer,
      })
    : null;
  return isLoading ? (
    <TestPlayerSkeleton />
  ) : (
    <Header
      title={
        <Space>
          {" "}
          <NavLink to={`../app/test/${testId}/result`}>
            <Button type="primary" icon={<ArrowLeftOutlined />} />
          </NavLink>{" "}
          {!isMobile ? test.title : null}
        </Space>
      }
      subTitle={"asd"}
      extra={isDesktop ? [LanguagesSelect, ExitButton] : SideDrawer}
    >
      <Row>
        <Col span={1} />
        <Col span={22}>
          <Row gutter={[50, 30]}>
            <Col xs={24} lg={isDesktop ? 16 : 24}>
              <Fragment>
                {ChildrenWithLanguage ? (
                  ChildrenWithLanguage
                ) : (
                  <Outlet context={{ language: lang }} />
                )}
                <TestPlayerMoreInfo
                  language={lang}
                  itemId={questionId + ""}
                  test={test}
                />
              </Fragment>
            </Col>
            {isDesktop ? (
              <Col lg={8} md={0}>
                <Row gutter={[20, 20]}>
                  <Col span={24}>
                    <QuestionNavigator
                      questionId={questionId + ""}
                      testId={testId + ""}
                    />
                  </Col>
                </Row>
              </Col>
            ) : null}
          </Row>
        </Col>
        <Col span={1} />
      </Row>
    </Header>
  );
}
