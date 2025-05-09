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
import { Constants, Enum, Learner, Store, Utils } from "@adewaskar/lms-common";
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
import { Title } from "@Components/Typography/Typography";
import { ProductDetailSignup } from "../../../StoreScreen/ProductCategoryDetail/ProductCategoryDetail";

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
  // const isProcturingOn = test.rules.procturing.enabled;
  // console.log(questionId, test.sections, "test.sections");

  useEffect(() => {
    if (test.sections[0]?.items[0] && !questionId) {
      const item = test.sections[0].items[0];
      const itemId = item._id;
      navigate(
        props.isServer
          ? `/test/${testId}/previous-year-questions/${Utils.getQuestionSlugFromID(
            item
          )}`
          : `/app/test/${testId}/previous-year-questions/${Utils.getQuestionSlugFromID(
            item
          )}`
      );
    }
    if (test.languages.length) {
      setLang(test.languages[0]);
    }
  }, [test.sections, questionId]);

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
            navigate(
              props.isServer ? `/test/${testId}` : `/app/test/${testId}`
            );
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
      <QuestionNavigator
        isServer={props.isServer}
        questionId={questionId + ""}
        testId={testId + ""}
      />
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
          {/* {" "}
          <NavLink to={`../app/test/${testId}/result`} title={test.title}>
            <Button type="primary" icon={<ArrowLeftOutlined />} />
          </NavLink>{" "} */}
          <Title style={{ fontSize: 20 }}>
            {!isMobile ? test.title : null}
          </Title>
        </Space>
      }
      subTitle={"asd"}
      extra={isDesktop ? [LanguagesSelect, ExitButton] : SideDrawer}
    >
      {/* <ProductDetailSignup
        product={{
          type: "category",
          id: test.category,
        }}
      /> */}
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
                      language={lang}
                      isServer={props.isServer}
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
