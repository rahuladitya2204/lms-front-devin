import {
  AppstoreOutlined,
  BookOutlined,
  FileOutlined,
  FundProjectionScreenOutlined,
  MailOutlined,
  SettingOutlined,
  SoundOutlined,
  ToolOutlined,
  UsergroupAddOutlined,
  UsergroupDeleteOutlined
} from '@ant-design/icons'

import { MenuProps } from 'antd'
import { Types } from '@adewaskar/lms-common'

export const MENU_ITEMS: Types.MenuItemNode[] = [

  {
    title: 'Courses',
    icon: <BookOutlined />,
    path: 'courses',
    children: [
      {
        title: 'All Courses',
        path: '',
        // icon: <AppstoreOutlined />
      },
    ]
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
      }
    ]
  },
  {
    title: 'Builder',
    icon: <FundProjectionScreenOutlined />,
    path: 'builder',
    children: [
      {
        title: 'App Builder',
        path: 'app',
        icon: <AppstoreOutlined />
      },
      {
        title: 'Website Builder',
        path: 'builder',
        icon: <ToolOutlined />
      }
    ]
  },
  {
    title: 'Asset Library',
    icon: <FileOutlined />,
    path: 'asset-library',
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
        title: 'Website Builder',
        path: 'builder',
        icon: <ToolOutlined />
      }
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
  
