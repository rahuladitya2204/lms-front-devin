import {
  AppstoreOutlined,
  BookOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  DashboardOutlined,
  EditOutlined,
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
    permissions: [Enum.UserRolePermissions.VIEW_DASHBOARD],
    path: "/admin/dashboard",
  },
  {
    title: "Blogs",
    icon: <EditOutlined />,
    permissions: [
      Enum.UserRolePermissions.CREATE_BLOGS,
      Enum.UserRolePermissions.VIEW_BLOGS,
      Enum.UserRolePermissions.UPDATE_BLOGS,
    ],
    path: "/admin/blogs",
  },
  {
    title: "Products",
    icon: <BookOutlined />,
    permissions: [Enum.UserRolePermissions.GET_CATEGORY],
    path: "/admin/products",
    children: [
      {
        title: "Courses",
        permissions: [Enum.UserRolePermissions.GET_TESTS],
        path: "courses",
        // roles:[Enum.UserRole.TEST_MANAGER]
      },
      {
        title: "Tests",
        permissions: [Enum.UserRolePermissions.GET_TESTS],
        path: "test",
        // roles:[Enum.UserRole.TEST_MANAGER]
      },
      {
        title: "Test Series",
        path: "packages",
        permissions: [
          // Enum.UserRolePermissions.GET_,
          Enum.UserRolePermissions.GET_PACKAGE,
        ],
      },
      {
        title: "Exams",
        path: "category",
        permissions: [
          // Enum.UserRolePermissions.CREATE_CATEGORY,
          Enum.UserRolePermissions.GET_CATEGORY,
          // Enum.UserRolePermissions.CREATE_CATEGORY,
        ],
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
    permissions: [
      Enum.UserRolePermissions.VIEW_EVENTS,
      Enum.UserRolePermissions.CREATE_EVENTS,
      Enum.UserRolePermissions.UPDATE_EVENTS,
    ],
    path: "/admin/event",
  },
  {
    title: "Users",
    icon: <UsergroupAddOutlined />,
    path: "/admin/users",
    permissions: [Enum.UserRolePermissions.GET_USERS],
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
      {
        title: "Affiliates",
        path: "affiliates",
        // icon: <UserOutlined />
      },
    ],
  },
  {
    title: "Marketing",
    icon: <SoundOutlined />,
    path: "/admin/marketing",
    permissions: [Enum.UserRolePermissions.MANAGE_MARKETING],
    // roles: [Enum.UserRole.MARKETING_MANAGER],
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
    permissions: [Enum.UserRolePermissions.MANAGE_ASSET_LIBRARY],
    path: "/admin/asset-library",
  },
  {
    title: "Support Tickets",
    permissions: [Enum.UserRolePermissions.MANAGE_SUPPORT_TICKETS],
    icon: <CustomerServiceOutlined />,
    path: "/admin/tickets",
  },
  {
    title: "Settings",
    icon: <SettingOutlined />,
    permissions: [Enum.UserRolePermissions.MANAGE_SETTINGS],
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

export const MenuItems = (
  items: Types.MenuItemNode[],
  permissions: string[],
  isAdmin: boolean
) => {
  return items
    .filter((item) => {
      if (isAdmin) {
        return true;
      }
      // Check if the menu item has permissions
      if (item.permissions) {
        // If permissions are specified, check if the user has any of the required permissions
        return item.permissions.some((permission) =>
          permissions.includes(permission)
        );
      }
      // If no permissions are specified, the menu item should be visible
      return true;
    })
    .map((item, pIndex) => {
      const ARGS = [item.title, `${item.path}`, item.icon];
      const CHILDREN = item?.children
        ?.filter((childItem) => {
          if (isAdmin) {
            return true;
          }
          // Check if the child menu item has permissions
          if (childItem.permissions) {
            // If permissions are specified, check if the user has any of the required permissions
            return childItem.permissions.some((permission) =>
              permissions.includes(permission)
            );
          }
          // If no permissions are specified, the child menu item should be visible
          return true;
        })
        .map((childItem, cIndex) =>
          getItem(
            childItem.title,
            `${item.path}/${childItem.path}`,
            childItem.icon
          )
        );
      if (CHILDREN && CHILDREN.length > 0) {
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
