"use client";
import {
  Alert,
  Button,
  Col,
  FloatButton,
  Row,
  Skeleton,
  Space,
  Spin,
} from "antd";
import { Enum, Learner, Store, Utils } from "@adewaskar/lms-common";
import { Fragment, useEffect } from "react";
import { useOutletContext } from "react-router";
import { useParams } from "@Router/index";
import { useSearchParams } from "next/navigation";
import ActionModal from "@Components/ActionModal/ActionModal";
import AppProvider from "screens/AppProvider";
import CreateTicket from "../Tickets/CreateTicket";
import { CustomerServiceOutlined } from "@ant-design/icons";
import Layout, { Content } from "@Components/Layout";
import LearnerFooter from "./LearnerFooter";
import LearnerHeader from "./LearnerHeader/LearnerHeaderClient";
import LearnerProfile from "../Account/LearnerProfile";
import ThemeProvider from "screens/ThemeProvider";
import { Typography } from "@Components/Typography";
import { useBlockBackButton } from "@User/Screens/Event/LiveSessionPlayer/User/hooks";
import useBreakpoint from "@Hooks/useBreakpoint";
import useDehydration from "@ServerHooks/useDehydration";
import Header from "@Components/Header";

const { Title } = Typography;

export interface LearnerRootScreenSkeletonProps {
  children?: React.ReactNode;
}

const LearnerRootScreenSkeleton = ({
  children,
}: LearnerRootScreenSkeletonProps) => {
  // useBlockBackButton()
  useDehydration();

  const { orgId } = useParams();
  const searchParams = useSearchParams();
  const userAuthToken = searchParams.get("userAuthToken");
  useEffect(() => {
    if (userAuthToken) {
      Utils.Storage.SetItem("userType", `learner`);
      Utils.Storage.SetItem("learner-auth-token", userAuthToken);
    }
  }, [userAuthToken]);

  useEffect(() => {
    if (orgId) {
      Utils.Storage.SetItem("orgId", orgId + "");
    }
  }, [orgId]);
  const { isMobile } = useBreakpoint();
  const outletcontext = useOutletContext<any>();
  const isSignedIn = Store.useAuthentication((s) => s.isSignedIn);
  const { data: learner } = Learner.Queries.useGetLearnerDetails();
  const screen = useBreakpoint();
  const isMobileOrTablet = screen.isMobile || screen.isTablet;
  return (
    <>
      <AppProvider>
        <Layout
          style={{ paddingBottom: 0, display: "flex", minHeight: "100vh" }}
        >
          <div style={{ flex: 1, paddingBottom: 50 }}>
            <Header
              extra={<Skeleton.Button active style={{ width: 150 }} />}
              hideBack
              title={
                <Space style={{ cursor: "pointer" }}>
                  <Skeleton.Button active style={{ width: 150 }} />
                  {!isMobileOrTablet ? (
                    <Space
                      style={{ display: "flex", marginLeft: 25 }}
                      align="center"
                    >
                      <Skeleton.Button
                        active
                        style={{ width: 460, height: 32 }}
                      />
                    </Space>
                  ) : null}
                  {/* <Search
              placeholder="Search Courses"
              // onSearch={onSearch}
              style={{ width: 200 }}
            /> */}
                </Space>
              }
              // className="site-layout-background"
              style={{ padding: 0, flex: 1 }}
            >
              <Content style={{ margin: "0 16px" }}>
                <Row style={{ paddingTop: 20 }}>
                  <Col xs={1} sm={2} />
                  <Col xs={22} sm={20}>
                    {children}
                  </Col>
                  <Col xs={1} sm={2} />
                </Row>
              </Content>
            </Header>
          </div>
          <LearnerFooter />
        </Layout>
      </AppProvider>
    </>
  );
};

export default LearnerRootScreenSkeleton;
