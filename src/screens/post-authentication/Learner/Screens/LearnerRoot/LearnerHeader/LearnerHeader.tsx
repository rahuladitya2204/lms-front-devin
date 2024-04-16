import {
  AutoComplete,
  Avatar,
  Badge,
  Button,
  Col,
  Divider,
  Dropdown,
  Grid,
  Layout,
  Menu,
  Modal,
  Row,
  Skeleton,
  Space,
  Spin,
  Tag,
  Tooltip,
  message,
} from "@Lib/index";
import {
  BookOutlined,
  CalendarOutlined,
  DesktopOutlined,
  EditOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  VerifiedOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Fragment, useMemo } from "react";
import { Learner, Store, Types, Utils } from "@adewaskar/lms-common";
import { Link, NavLink } from "@Router/index";

import ActionDrawer from "@Components/ActionDrawer";
import ActionModal from "@Components/ActionModal/ActionModal";
import AppImage from "@Components/Image";
import CoinImage from "../../Account/LearnerWallet/CoinImage";
import Header from "@Components/Header";
import LoginScreen from "@Learner/Screens/Login";
import OrgLogo from "@Components/OrgLogo";
import { Outlet } from "react-router";
import SearchLearnerCourses from "@Components/SearchLearnerCourses";
import useBreakpoint from "@Hooks/useBreakpoint";
import useMessage from "@Hooks/useMessage";
import { useModal } from "@Components/ActionModal/ModalContext";

import { useRouter } from "next/navigation";

const { confirm } = Modal;

const { Content } = Layout;
import { Typography } from "@Components/Typography";
const { Text } = Typography;

export interface LearnerHeaderClientProps {
  children?: React.ReactNode;
  isServer?: boolean;
}

const LearnerHeaderClient = ({
  children,
  isServer,
}: LearnerHeaderClientProps) => {
  const { mutate: logoutLearner, isLoading: loggingOut } =
    Learner.Queries.useLogoutLearner();
  const { data: organisation } = Learner.Queries.useGetOrgDetails();
  const isAdmin = Store.useGlobal((s) => s.isAdmin);
  const { data: user, isFetching: loadingLearnerDetails } =
    Learner.Queries.useGetLearnerDetails();
  const { isSignedIn, isLoading: loadingAuth } = Store.useAuthentication(
    (s) => s
  );

  const enrolledProducts = {
    test: user.enrolledProducts.filter(
      (i) => i.enrolledProduct.type === "test"
    ),
    event: user.enrolledProducts.filter(
      (i) => i.enrolledProduct.type === "event"
    ),
    course: user.enrolledProducts.filter(
      (i) => i.enrolledProduct.type === "course"
    ),
  };
  // console.log(enrolledProducts.test, "kya baat hai");
  const {
    data: { items },
  } = Learner.Queries.useGetCartDetails();
  const screen = useBreakpoint();
  // console.log(screen, 'scrrrr')
  const isMobileOrTablet = screen.isMobile || screen.isTablet;
  const router = useRouter();

  const contentLoading = loadingAuth || loadingLearnerDetails;

  const logout = (cb?: Function) => {
    confirm({
      title: "Are you sure?",
      icon: <LogoutOutlined />,
      content: `You want to logout?`,
      onOk() {
        logoutLearner({
          onSuccess: async () => {
            message.open({
              type: "success",
              content: "Logged Out successfully.",
            });
            router.push("/app/store");
          },
        });
      },
      okText: "Yes, Logout",
    });
  };
  const menuItems = useMemo(() => {
    const MENU_ITEMS = [
      { label: "Home", key: "store", icon: <ShopOutlined /> },
    ];
    if (enrolledProducts.test && enrolledProducts.test.length) {
      MENU_ITEMS.push({
        label: "My Tests",
        key: "test",
        icon: <EditOutlined />,
      });
    }
    if (enrolledProducts.event && enrolledProducts.event.length) {
      MENU_ITEMS.push({
        label: "My Events",
        key: "event",
        icon: <EditOutlined />,
      });
    }
    if (enrolledProducts.course && enrolledProducts.course.length) {
      MENU_ITEMS.push({
        label: "My Courses",
        key: "courses",
        icon: <EditOutlined />,
      });
    }
    if (isMobileOrTablet && isSignedIn) {
      MENU_ITEMS.unshift({
        label: "Wallet",
        key: "wallet",
        icon: <WalletOutlined />,
      });
      if (organisation.affiliate.enabled) {
        MENU_ITEMS.push({
          label: user.affiliate ? "Affiliate Program" : "Become an affiliate",
          key: "../affiliate",
          icon: <VerifiedOutlined />,
        });
      }
    }
    return MENU_ITEMS;
  }, [isMobileOrTablet, isSignedIn, enrolledProducts]);
  const HeaderButtonSkeleton = (
    <Skeleton.Button
      active
      style={{ width: 97, height: 32, borderRadius: 15 }}
    />
  );
  const { openModal } = useModal();
  const WalletButton = contentLoading ? (
    HeaderButtonSkeleton
  ) : (
    <NavLink
      title={`Wallet`}
      to={`/app/wallet`}
      children={({ isActive }) => {
        return contentLoading ? (
          HeaderButtonSkeleton
        ) : (
          <Tooltip
            title={
              !user.wallet.balance.value
                ? "Please recharge your wallet for purchases"
                : `Wallet Balance: ${Utils.UnitTypeToStr(user.wallet.balance)}`
            }
          >
            <Button
              style={{ paddingTop: 2, paddingLeft: 5 }}
              color="blue-inverse"
              // size={screen.isMobile?'small':'middle'}
            >
              <Row justify={"center"} align={"middle"}>
                <Col style={{ marginTop: -1 }}>
                  <CoinImage width={20} />
                </Col>
                <Col>
                  <Text style={{ fontSize: 16, marginLeft: 5 }} strong>
                    {user.wallet.balance.value
                      ? Utils.UnitTypeToStr(user.wallet.balance)
                      : "My Wallet"}
                  </Text>
                </Col>
              </Row>
            </Button>
          </Tooltip>
        );
      }}
    />
  );
  // Define the extraContent
  const extraContent = (
    <Space>
      {screen.isDesktop && isSignedIn ? (
        <Space style={{ marginLeft: 45 }}>
          {contentLoading ? (
            <Row gutter={[8, 0]}>
              <Col>{HeaderButtonSkeleton}</Col>
              <Col>{HeaderButtonSkeleton}</Col>
            </Row>
          ) : (
            menuItems.map((item, index) => (
              <NavLink
                title={item.label}
                anchor={isServer}
                key={index}
                to={`/app/${item.key}`}
                style={{ margin: "0 5px" }}
                children={({ isActive }) => (
                  <Button
                    style={{ borderRadius: 15 }}
                    size="middle"
                    icon={item.icon}
                    type={isActive ? "primary" : "default"}
                  >
                    {item.label}
                  </Button>
                )}
              />
            ))
          )}
          {} {/* <Divider orientation="right" /> */}
        </Space>
      ) : null}
      {/* {contentLoading ? <Skeleton.Avatar active style={{ width: 32, height: 32 }} /> : } */}
      <Fragment>
        {isMobileOrTablet ? (
          contentLoading ? (
            <Skeleton.Avatar active style={{ width: 32, height: 32 }} />
          ) : (
            <Fragment>
              {isSignedIn ? WalletButton : null}
              {isSignedIn ? (
                <ActionDrawer
                  width={300}
                  extra={(closeDrawer) => [
                    <Button
                      icon={<LogoutOutlined />}
                      loading={loggingOut}
                      onClick={() => {
                        logout(closeDrawer);
                      }}
                      type="primary"
                      block
                    >
                      Logout
                    </Button>,
                  ]}
                  cta={<Button icon={<MenuOutlined />} />}
                >
                  <Menu
                    defaultSelectedKeys={["1"]}
                    // defaultOpenKeys={['sub1']}
                    mode="inline"
                    onClick={(e) => {
                      router.push(e.key);
                    }}
                    // theme="dark"
                    // inlineCollapsed={collapsed}
                    items={menuItems}
                  />
                </ActionDrawer>
              ) : null}
            </Fragment>
          )
        ) : null}
      </Fragment>
      <NavLink
        to={isServer ? "/blog" : "/app/blog"}
        children={({ isActive }) => {
          return (
            <Button
              style={{ borderRadius: 15 }}
              icon={<BookOutlined />}
              type={isActive ? "primary" : "default"}
              style={{ margin: "0 10px" }}
              // onClick={() =>cons
            >
              Blogs
            </Button>
          );
        }}
      ></NavLink>
      {!isSignedIn ? (
        contentLoading ? (
          <Skeleton.Button style={{ width: 97, height: 32 }} active />
        ) : (
          <Button
            icon={<LoginOutlined />}
            type="primary"
            style={{ margin: "0 10px" }}
            onClick={() =>
              openModal(<LoginScreen />, {
                width: 300,
                title: "Login",
              })
            }
          >
            Login
          </Button>
        )
      ) : null}

      {isSignedIn && !isMobileOrTablet && (
        <Space>
          {!screen.isMobile ? <>{WalletButton}</> : null}
          {contentLoading ? (
            <Skeleton.Button
              shape="circle"
              style={{ width: 32, height: 32 }}
              active
            />
          ) : (
            <Dropdown
              trigger={["click"]}
              placement="bottomLeft"
              overlay={
                <Menu>
                  {user.name ? (
                    <Menu.Item
                      key="account"
                      icon={
                        <Avatar src={user.image} style={{ marginRight: 10 }}>
                          {Utils.getFirstLettersOfName(user.name)}
                        </Avatar>
                      }
                      // onClick={() => router.push('../app/account')}
                    >
                      {user?.name}
                    </Menu.Item>
                  ) : null}
                  {/* <Menu.Item
                  key="account"
                >
                  My Account
                </Menu.Item> */}
                  <Menu.Item
                    key="support"
                    icon={<UserOutlined />}
                    onClick={() => router.push("/app/tickets")}
                  >
                    Help and Support
                  </Menu.Item>
                  {organisation.affiliate.enabled ? (
                    <Menu.Item
                      key="affiliate"
                      icon={<VerifiedOutlined />}
                      onClick={() => window.open(`/affiliate`, "_blank")}
                    >
                      {user.affiliate
                        ? "Affiliate Program"
                        : "Become an affiliate"}
                    </Menu.Item>
                  ) : null}

                  <Menu.Item
                    icon={<LogoutOutlined />}
                    key="logout"
                    onClick={() => logout()}
                  >
                    Logout
                  </Menu.Item>
                </Menu>
              }
            >
              <Button shape="circle" icon={<UserOutlined />} />
            </Dropdown>
          )}
        </Space>
      )}
    </Space>
  );

  return (
    <Header
      hideBack
      title={
        <Space style={{ cursor: "pointer" }}>
          <Link title={organisation.name} to={isServer ? "/" : "/app/store"}>
            <OrgLogo showName />
          </Link>
          {!isMobileOrTablet ? (
            <Space style={{ display: "flex", marginLeft: 25 }} align="center">
              {loadingLearnerDetails ? (
                <Skeleton.Button active style={{ width: 460, height: 32 }} />
              ) : (
                <SearchLearnerCourses />
              )}
            </Space>
          ) : null}
          {/* <Search
              placeholder="Search Courses"
              // onSearch={onSearch}
              style={{ width: 200 }}
            /> */}
        </Space>
      }
      // bgColor="#fff"
      extra={extraContent}
      // className="site-layout-background"
      style={{ padding: 0, flex: 1 }}
    >
      <Content style={{ margin: "0 16px" }}>
        <Spin tip="Please wait.. Logging you out." spinning={loggingOut}>
          <Row style={{ paddingTop: 20 }}>
            <Col xs={1} sm={2} />
            <Col xs={22} sm={20}>
              {children ? children : <Outlet />}
            </Col>
            <Col xs={1} sm={2} />
          </Row>
        </Spin>
      </Content>
    </Header>
  );
};

export default LearnerHeaderClient;
