import {
  AppstoreOutlined,
  BookOutlined,
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
} from '@ant-design/icons'

import { MenuProps } from 'antd'
import { Types } from '@adewaskar/lms-common'

export const MENU_ITEMS: Types.MenuItemNode[] = [
  {
    title: 'Dashboard',
    icon: <DashboardOutlined />,
    path: 'dashboard',
  },
  {
    title: 'Products',
    icon: <BookOutlined />,
    path: 'products',
    children: [
      {
        title: 'Courses',
        path: 'courses',
        // icon: <AppstoreOutlined />
      },
      {
        title: 'Testss',
        // icon: <PaperClipOutlined />,
        path: 'test',
      },
      {
        title: 'Packages',
        path: 'packages',
        // icon: <AppstoreOutlined />
      },
    ]
  },
  {
    title: 'Live Sessions',
    icon: <VideoCameraOutlined />,
    path: 'live-session',
  },
  {
    title: 'Users',
    icon: <UsergroupAddOutlined />,
    path: 'users',
    children: [
      {
        title: 'Learners',
        path: 'learners',
        // icon: <UserOutlined />
      },
      {
        title: 'Instructors',
        path: 'instructors',
        // icon: <UserOutlined />
      }
    ]
  },
  {
    title: 'Marketing',
    icon: <SoundOutlined />,
    path: 'marketing',
    children: [
      {
        title: 'Campaign',
        path: 'campaign',
        // icon: <AppstoreOutlined />
      },
      {
        title: 'Templates',
        path: 'templates',
        // icon: <AppstoreOutlined />
      },
      {
        title: 'Promo Codes',
        path: 'promo-codes',
        // icon: <AppstoreOutlined />
      }
    ]
  },
  {
    title: 'Website & App',
    icon: <FundProjectionScreenOutlined />,
    path: 'builder',
    children: [
      {
        title: 'Website Builder',
        path: 'website',
        icon: <AppstoreOutlined />
      },
      {
        title: 'App Builder',
        path: 'app',
        icon: <AppstoreOutlined />
      },
    ]
  },
  {
    title: 'Asset Library',
    icon: <FolderOpenOutlined />,
    path: 'asset-library',
  },
  {
    title: 'Support Tickets',
    icon: <CustomerServiceOutlined />,
    path: 'tickets',
  },
  {
    title: 'Settings',
    icon: <SettingOutlined />,
    path: 'settings',
    children: [
      {
        title: 'My Account',
        path: 'account',
        icon: <AppstoreOutlined />
      },
      {
        title: 'Payments',
        path: 'payments',
        icon: <MoneyCollectOutlined />
      },
    ]
  },
]


export const MenuItems = (items:Types.MenuItemNode[]) => {
  return items.map((item, pIndex) => {
    const ARGS = [item.title, `${item.path}`, item.icon]
    const CHILDREN = item?.children?.map((childItem, cIndex) =>
      getItem(childItem.title, `${item.path}/${childItem.path}`, childItem.icon)
    )
    if (CHILDREN) {
      // @ts-ignore
      ARGS.push(CHILDREN)
    }
    // @ts-ignore
    return getItem(...ARGS)
  })
}


type MenuItem = Required<MenuProps>['items'][number];



function getItem(
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[],
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
    } as MenuItem;
}
  
