import { Col, Menu, Row } from "antd";
import { Constants, Enum, Store, User } from "@adewaskar/lms-common";
import Layout, { Content, Sider } from "@Components/Layout";
import { MENU_ITEMS, MenuItems } from "./constants";
import { Outlet } from "react-router";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import AppProvider from "screens/AppProvider";
import { ModalProvider } from "@Components/ActionModal/ModalContext";
import OrgLogo from "@Components/OrgLogo";
import ProtectedContent from "@Components/ProtectedComponent";
import ThemeProvider from "screens/ThemeProvider";
import { UserLogin } from "../Login";
import { UserOutlined } from "@ant-design/icons";
import { compareArrays } from "@Components/Editor/SunEditor/utils";
import styled from "@emotion/styled";
import useBreakpoint from "@Hooks/useBreakpoint";
import MonitoringComponent from "@Components/monitoring/MonitoringComponent";

const LogoHolder = styled.div`
  padding: 20px;
  display: flex;
  justify-content: center;
`;

// const { Content, Sider } = Layout

const UserRootScreen: React.FC = () => {
  const { isDesktop } = useBreakpoint();
  const { isSignedIn } = Store.useAuthentication((s) => s);

  return (
    <ThemeProvider>
      <ModalProvider>
        <MonitoringComponent>
          <Layout style={{ minHeight: "100vh" }}>
            {isDesktop ? <AppSider /> : null}
            <Layout className="site-layout">
              <Content style={{ margin: "0 16px" }}>
                <Row gutter={[20, 20]}>
                  <Col span={24}>
                    <ProtectedContent
                      width={300}
                      title="Login"
                      cta={<UserLogin />}
                      isVerified={isSignedIn}
                    >
                      <Outlet />
                    </ProtectedContent>
                  </Col>
                </Row>
              </Content>
            </Layout>
          </Layout>
        </MonitoringComponent>
      </ModalProvider>
    </ThemeProvider>
  );
};

export const AppSider = () => {
  const [collapsed, setCollapsed] = useState(false);
  const isAdminPortal = Store.useGlobal((s) => s);
  const navigate = useNavigate();
  const {
    data: { roles },
  } = User.Queries.useGetUserDetails();
  const isAdmin = isAdminPortal && roles.includes(Enum.UserRole.ADMIN);
  const menuItems = [...MENU_ITEMS];
  if (isAdmin) {
    menuItems.unshift({
      title: "Admin",
      icon: <UserOutlined />,
      path: "admin",
      children: [
        {
          title: "News",
          // icon: <PaperClipOutlined />,
          path: "news",
          // roles: [Enum.UserRole.NEWS_MANAGER],
        },
        {
          title: "Topics",
          // icon: <PaperClipOutlined />,
          path: "topics",
        },
        {
          title: "Texts",
          // icon: <PaperClipOutlined />,
          path: "texts",
        },
        {
          title: "Organisations",
          // icon: <PaperClipOutlined />,
          path: "organisation",
          // roles: [Enum.UserRole.ORG_MANAGER],
        },
      ],
    });
  }

  const permissions = roles
    .map((r) => Constants.USER_ROLES.find((rr) => rr.slug === r))
    .flat()
    .map((r) => r?.permissions)
    .flat();
  const filteredMenuItems = menuItems
    .map((mItem) => {
      // @ts-ignore
      mItem.children = mItem?.children?.filter(
        // @ts-ignore
        (u) => {
          const P = (u?.roles || [])
            .map((r) => Constants.USER_ROLES.find((rr) => rr.slug === r))
            .flat();
          return (
            compareArrays(P || [], permissions) ||
            roles.find((r) => Enum.UserRole.ADMIN)
          );
        }
      );
      return mItem;
    })
    .filter(
      (u) =>
        compareArrays(u.roles || [], roles) ||
        roles.find((r) => Enum.UserRole.ADMIN)
    );
  const { isDesktop } = useBreakpoint();
  return (
    <Sider
      collapsible={isDesktop}
      theme="light"
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <LogoHolder>
        <OrgLogo width="150px" quality="high" />
      </LogoHolder>
      <Menu
        onClick={(e) => navigate(e.key)}
        theme="light"
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={MenuItems(filteredMenuItems, permissions, isAdmin)}
      />
    </Sider>
  );
};

export default UserRootScreen;
