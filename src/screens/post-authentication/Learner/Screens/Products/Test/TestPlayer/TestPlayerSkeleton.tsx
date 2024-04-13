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
import TestPublicQuestionNavigator from "../PYQPlayer/PYQTestQuestionNavigator";
import { Typography } from "@Components/Typography";
import useBreakpoint from "@Hooks/useBreakpoint";
import { NavLink, useLocation, useNavigate, useParams } from "@Router/index";
import TestPlayerMoreInfo from "../PYQPlayer/PYQTestPlayerMoreInfo";
import TestQuestionNavigatorSkeleton from "../TestReview/TestQuestionNavigatorSkeleton";

// const ProctoringComponent = lazy(() => import('@Learner/Screens/Procturing/TestProcturing'));

interface TestPlayerPropsI {
  publicView?: boolean;
  children?: React.ReactNode;
}

export default function TestPlayerSkeleton(props: TestPlayerPropsI) {
  const { isTablet, isDesktop, isMobile } = useBreakpoint();

  return (
    <Header
      title={
        <Space>
          {!isMobile ? (
            <Skeleton.Button block active style={{ width: 100, height: 30 }} />
          ) : null}
        </Space>
      }
      subTitle={"asd"}
      //   extra={isDesktop ? [LanguagesSelect, ExitButton] : SideDrawer}
    >
      <Row>
        <Col span={1} />
        <Col span={22}>
          <Row gutter={[50, 30]}>
            <Col xs={24} lg={isDesktop ? 16 : 24}>
              <Fragment>
                <TestItemSkeleton />
                <Skeleton.Button
                  block
                  active
                  style={{ height: 300, marginTop: 20 }}
                />
              </Fragment>
            </Col>
            {isDesktop ? (
              <Col lg={8} md={0}>
                <Row gutter={[20, 20]}>
                  <Col span={24}>
                    <TestQuestionNavigatorSkeleton />
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
