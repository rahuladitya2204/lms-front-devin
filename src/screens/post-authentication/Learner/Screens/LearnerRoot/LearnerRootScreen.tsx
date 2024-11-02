"use client";
import { Alert, Button, FloatButton } from "@Lib/index";
import { Enum, Learner, Store, Utils } from "@adewaskar/lms-common";
import { Fragment, Suspense, useEffect } from "react";
import { useOutletContext } from "react-router";
import { useParams } from "@Router/index";
import { useSearchParams } from "@Router/index";
import ActionModal from "@Components/ActionModal/ActionModal";
import AppProvider from "screens/AppProvider";
import CreateTicket from "../Tickets/CreateTicket";
import { CustomerServiceOutlined } from "@ant-design/icons";
import Layout from "@Components/Layout";
import LearnerFooter from "./LearnerFooter";
import LearnerProfile from "../Account/LearnerProfile";
import ThemeProvider from "screens/ThemeProvider";
import { Typography } from "@Components/Typography";

import useBreakpoint from "@Hooks/useBreakpoint";
import useDehydration from "@ServerHooks/useDehydration";

import LearnerHeaderClient from "./LearnerHeader/LearnerHeader";
import SubscriptionPlansModal from "@User/Screens/ExtraComponents/SubscriptionPlans";

const { Title } = Typography;

export interface LearnerRootScreenProps {
  children?: React.ReactNode;
  isServer?: boolean;
  noSignIn?: boolean;
}

const LearnerRootScreen = ({ children, isServer }: LearnerRootScreenProps) => {
  // const isServer = getIsServer();
  // console.log(isServer, "isServer");
  // useBlockBackButton()
  useDehydration();

  const { orgId } = useParams();
  const [searchParams] = useSearchParams();
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
  // console.log(outletcontext, "outletcontext");
  return (
    <Suspense>
      <ThemeProvider
        showLoadingScreen={outletcontext?.showLoadingScreen}
        type="learner"
      >
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
                <CreateTicket />
              </ActionModal>
            ) : null
          ) : null}
          {!learner.subscription ? <SubscriptionPlansModal /> : null}
          <Layout
            style={{ paddingBottom: 0, display: "flex", minHeight: "100vh" }}
          >
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
              <LearnerHeaderClient isServer={isServer} children={children} />
            </div>
            <LearnerFooter isServer={isServer} />
          </Layout>
        </AppProvider>
      </ThemeProvider>
    </Suspense>
  );
};

export default LearnerRootScreen;
