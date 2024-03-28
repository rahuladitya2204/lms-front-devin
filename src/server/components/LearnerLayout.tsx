"use client";
import { Alert, Button, FloatButton } from "antd";
import { Enum, Learner, Store, Utils } from "@adewaskar/lms-common";
import { Fragment, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useParams } from "react-router";

import ActionModal from "@Components/ActionModal/ActionModal";
import AppProvider from "screens/AppProvider";
import { CustomerServiceOutlined } from "@ant-design/icons";
import Layout from "@Components/Layout";
import ThemeProvider from "screens/ThemeProvider";
import { Typography } from "@Components/Typography";
// import { useBlockBackButton } from "@User/Screens/Event/LiveSessionPlayer/User/hooks";
// import CreateTicket from "@Learner/Screens/Tickets/CreateTicket";
import LearnerProfile from "@Learner/Screens/Account/LearnerProfile";
import LearnerFooter from "@Learner/Screens/LearnerRoot/LearnerFooter";
import useServerBreakpoint from "@ServerHooks/useServerBreakpoint";
import LearnerHeader from "./LearnerHeader";

// TODO: export this
//  useAuthentication store provider
//  useGetLearnerDetails query
//  useLogoutLearner (if query)
//  useGetOrgDetails
//  useGetCartDetails (if any)

const { Title } = Typography;

export interface LearnerLayoutProps {}

export default function LearnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // useBlockBackButton();

  // const { orgId } = useParams();
  // const [params] = useSearchParams();
  // const userAuthToken = params.get("userAuthToken");
  // useEffect(() => {
  //   if (userAuthToken) {
  //     Utils.Storage.SetItem("userType", `learner`);
  //     Utils.Storage.SetItem("learner-auth-token", userAuthToken);
  //   }
  // }, [userAuthToken]);

  // useEffect(() => {
  //   if (orgId) {
  //     Utils.Storage.SetItem("orgId", orgId + "");
  //   }
  // }, [orgId]);

  const { isMobile } = useServerBreakpoint();
  const isSignedIn = Store.useAuthentication((s) => s.isSignedIn);
  const { data: learner } = Learner.Queries.useGetLearnerDetails();
  return (
    <ThemeProvider showLoadingScreen={false} type="learner">
      {/* <ApplyFavicon faviconUrl={ brand} /> */}
      <AppProvider>
        {isSignedIn ? (
          !isMobile ? (
            <ActionModal
              width={600}
              title={
                <Title style={{ marginTop: 0 }} level={3}>
                  Raise a ticket
                </Title>
              }
              cta={
                <FloatButton
                  style={{ width: 60, height: 60 }}
                  shape="circle"
                  type="primary"
                  icon={<CustomerServiceOutlined size={5600} />}
                />
              }
            >
              {/* <CreateTicket /> */}
            </ActionModal>
          ) : null
        ) : null}
        <Layout style={{ paddingBottom: 0, display: "flex" }}>
          {!isMobile && isSignedIn ? (
            <Fragment>
              {learner.profile.status ===
                Enum.LearnerProfileStatus.INCOMPLETE ||
              learner.profile.status ===
                Enum.LearnerProfileStatus.PARTIAL_COMPLETE ? (
                <Alert
                  action={
                    <ActionModal
                      height={600}
                      width={300}
                      title="Complete your profile"
                      cta={<Button size="small">Complete Profile</Button>}
                    >
                      <LearnerProfile />
                    </ActionModal>
                  }
                  message="Your profile is incomplete please fill details"
                  banner
                  type="error"
                  closable
                />
              ) : null}
            </Fragment>
          ) : null}
          <div style={{ flex: 1, paddingBottom: 50 }}>
            <LearnerHeader>{children}</LearnerHeader>
          </div>
          <LearnerFooter />
        </Layout>
      </AppProvider>
    </ThemeProvider>
  );
}
