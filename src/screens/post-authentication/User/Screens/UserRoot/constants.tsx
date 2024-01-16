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
} from '@ant-design/icons'

import { MenuProps } from 'antd'
import { Types } from '@adewaskar/lms-common'

export const MENU_ITEMS: Types.MenuItemNode[] = [
  {
    title: 'Dashboard',
    icon: <DashboardOutlined />,
    path: '/app/dashboard',
  },
  {
    title: 'Products',
    icon: <BookOutlined />,
    path: '/app/products',
    children: [
      {
        title: 'Tests',
        // icon: <PaperClipOutlined />,
        path: 'test',
      },
      {
        title: 'Packages',
        path: 'packages',
      },
      {
        title: 'Category',
        path: 'category',
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
    ]
  },
  {
    title: 'Events',
    icon: <CalendarOutlined />,
    path: '/app/event',
  },
  {
    title: 'Users',
    icon: <UsergroupAddOutlined />,
    path: '/app/users',
    children: [
      {
        title: 'Learners',
        path: 'learners',
        // icon: <UserOutlined />
      },
      {
        title: 'Users',
        path: 'users',
        // icon: <UserOutlined />
      }
    ]
  },
  {
    title: 'Marketing',
    icon: <SoundOutlined />,
    path: '/app/marketing',
    children: [
      {
        title: 'Campaign',
        path: 'campaign',
        // icon: <AppstoreOutlined />
      },
      {
        title: 'Affiliate Program',
        path: 'affiliate',
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
    title: 'Asset Library',
    icon: <FolderOpenOutlined />,
    path: '/app/asset-library',
  },
  {
    title: 'Support Tickets',
    icon: <CustomerServiceOutlined />,
    path: '/app/tickets',
  },
  {
    title: 'Settings',
    icon: <SettingOutlined />,
    path: '/app/settings',
    children: [
      {
        title: 'My Profile',
        path: 'profile',
        icon: <AppstoreOutlined />
      },
      {
        title: 'Org Account',
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
  
