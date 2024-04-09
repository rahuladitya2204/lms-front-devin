import {
  AppstoreOutlined,
  BookOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  DashboardOutlined,
  FolderOpenOutlined,
  FundProjectionScreenOutlined,
  MoneyCollectOutlined,
  PaperClipOutlined,
  SettingOutlined,
  SoundOutlined,
  UsergroupAddOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Enum, Types } from "@adewaskar/lms-common";

import { MenuProps } from "@Lib/index";

export const MENU_ITEMS: Types.MenuItemNode[] = [
  {
    title: "Dashboard",
    icon: <DashboardOutlined />,
    path: "/admin/dashboard",
  },
  {
    title: "Products",
    icon: <BookOutlined />,
    roles: [Enum.UserRole.PRODUCT_MANAGER],
    path: "/admin/products",
    children: [
      {
        title: "Tests",
        // icon: <PaperClipOutlined />,
        path: "test",
        // roles:[Enum.UserRole.TEST_MANAGER]
      },
      {
        title: "Packages",
        path: "packages",
      },
      {
        title: "Category",
        path: "category",
        // icon: <AppstoreOutlined />
      },
      // {
      //   title: 'News',
      //   path: '/news',
      //   // icon: <AppstoreOutlined />
      // },
      // {
      //   title: 'Courses',
      //   path: 'courses',
      // },
    ],
  },
  {
    title: "Events",
    icon: <CalendarOutlined />,
    path: "/admin/event",
  },
  {
    title: "Users",
    icon: <UsergroupAddOutlined />,
    path: "/admin/users",
    roles: [Enum.UserRole.USER_MANAGER],
    children: [
      {
        title: "Learners",
        path: "learners",
        // icon: <UserOutlined />
      },
      {
        title: "Users",
        path: "users",
        // icon: <UserOutlined />
      },
    ],
  },
  {
    title: "Marketing",
    icon: <SoundOutlined />,
    path: "/admin/marketing",
    roles: [Enum.UserRole.MARKETING_MANAGER],
    children: [
      {
        title: "Campaign",
        path: "campaign",
        // icon: <AppstoreOutlined />
      },
      {
        title: "Affiliate Program",
        path: "affiliate",
        // icon: <AppstoreOutlined />
      },
      {
        title: "Templates",
        path: "templates",
        // icon: <AppstoreOutlined />
      },
      {
        title: "Promo Codes",
        path: "promo-codes",
        // icon: <AppstoreOutlined />
      },
    ],
  },
  // {
  //   title: 'Website & App',
  //   icon: <FundProjectionScreenOutlined />,
  //   path: 'builder',
  //   children: [
  //     {
  //       title: 'Website Builder',
  //       path: 'website',
  //       icon: <AppstoreOutlined />
  //     },
  //     {
  //       title: 'App Builder',
  //       path: 'app',
  //       icon: <AppstoreOutlined />
  //     },
  //   ]
  // },
  {
    title: "Asset Library",
    icon: <FolderOpenOutlined />,
    path: "/admin/asset-library",
  },
  {
    title: "Support Tickets",
    icon: <CustomerServiceOutlined />,
    path: "/admin/tickets",
  },
  {
    title: "Settings",
    icon: <SettingOutlined />,
    roles: [Enum.UserRole.ORG_MANAGER],
    path: "/admin/settings",
    children: [
      {
        title: "My Profile",
        path: "profile",
        icon: <AppstoreOutlined />,
      },
      {
        title: "Org Account",
        path: "account",
        icon: <AppstoreOutlined />,
      },
      {
        title: "Payments",
        path: "payments",
        icon: <MoneyCollectOutlined />,
      },
    ],
  },
];

export const MenuItems = (items: Types.MenuItemNode[]) => {
  return items.map((item, pIndex) => {
    const ARGS = [item.title, `${item.path}`, item.icon];
    const CHILDREN = item?.children?.map((childItem, cIndex) =>
      getItem(childItem.title, `${item.path}/${childItem.path}`, childItem.icon)
    );
    if (CHILDREN) {
      // @ts-ignore
      ARGS.push(CHILDREN);
    }
    // @ts-ignore
    return getItem(...ARGS);
  });
};

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}
