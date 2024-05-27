import Layout from "@Components/Layout";
import { ModalProvider } from "@Components/ActionModal/ModalContext";
import { Outlet } from "react-router";
import ProtectedContent from "@Components/ProtectedComponent";
import { Store } from "@adewaskar/lms-common";
import ThemeProvider from "screens/ThemeProvider";
import { UserLogin } from "../Login";
import MonitoringComponent from "@Components/monitoring/MonitoringComponent";

export default function UserFullPageHolder() {
  const { isSignedIn } = Store.useAuthentication((s) => s);
  return (
    <ThemeProvider>
      <ModalProvider>
        <MonitoringComponent>
          <Layout style={{ minHeight: "100vh" }}>
            <ProtectedContent
              width={300}
              title="Login"
              cta={<UserLogin />}
              isVerified={isSignedIn}
            >
              <Outlet />
            </ProtectedContent>
          </Layout>
        </MonitoringComponent>
      </ModalProvider>
    </ThemeProvider>
  );
}
