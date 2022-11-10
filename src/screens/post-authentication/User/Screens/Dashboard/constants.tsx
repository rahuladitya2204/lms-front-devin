import {
  AppstoreOutlined,
  MailOutlined,
  UsergroupDeleteOutlined
} from '@ant-design/icons'

import { MenuProps } from 'antd'
import { MenuItemNode } from '@Types/Common.types'

export const MENU_ITEMS: MenuItemNode[] = [
  {
    title: 'Home',
    icon: <MailOutlined />,
    path: 'home',
  },
  {
    title: 'Courses',
    icon: <MailOutlined />,
    path: '',
    children: [
      {
        title: 'All Courses',
        path: 'user/dashboard/courses',
        icon: <AppstoreOutlined />
      },
      // {
      //   title: 'Packages',
      //   path: 'packages',
      //   icon: <AppstoreOutlined />
      // },
      // {
      //   title: 'Question Bank',
      //   path: 'question-bank',
      //   icon: <AppstoreOutlined />
      // }
    ]
  },
  {
    title: 'Users',
    icon: <UsergroupDeleteOutlined />,
    path: '',
    children: [
      // {
      //   title: 'Learners',
      //   path: 'learners',
      //   icon: <AppstoreOutlined />
      // },
      // {
      //   title: 'Admins',
      //   path: 'users',
      //   icon: <AppstoreOutlined />
      // },
      {
        title: 'Learners',
        path: 'user/dashboard/users/learners',
        icon: <AppstoreOutlined />
      },
      {
        title: 'Instructors',
        path: 'user/dashboard/users/instructors',
        icon: <AppstoreOutlined />
      }
    ]
  },
  {
    title: 'Website',
    icon: <UsergroupDeleteOutlined />,
    path: 'website',
    children: [
      {
        title: 'Website Pages',
        path: 'pages',
        icon: <AppstoreOutlined />
      },
      {
        title: 'Website Builder',
        path: 'builder',
        icon: <AppstoreOutlined />
      }
    ]
  }
]

export const HEADER_ITEMS: MenuItemNode[] = [
  {
    title: 'Courses',
    icon: <MailOutlined />,
    path: 'home'
  },
  {
    title: 'Courses',
    icon: <MailOutlined />,
    path: '',
    children: [
      {
        title: 'All Courses',
        path: 'user/dashboard/courses',
        icon: <AppstoreOutlined />
      },
      {
        title: 'Packages',
        path: 'packages',
        icon: <AppstoreOutlined />
      },
      {
        title: 'Question Bank',
        path: 'question-bank',
        icon: <AppstoreOutlined />
      }
    ]
  },
  {
    title: 'Users',
    icon: <UsergroupDeleteOutlined />,
    path: 'users',
    children: [
      {
        title: 'Learners',
        path: 'learners',
        icon: <AppstoreOutlined />
      },
      {
        title: 'Admins',
        path: 'users',
        icon: <AppstoreOutlined />
      },
      {
        title: 'Instructors',
        path: 'instructors',
        icon: <AppstoreOutlined />
      }
    ]
  },
  {
    title: 'Website',
    icon: <UsergroupDeleteOutlined />,
    path: 'website',
    children: [
      {
        title: 'Website Pages',
        path: 'pages',
        icon: <AppstoreOutlined />
      },
      {
        title: 'Website Builder',
        path: 'builder',
        icon: <AppstoreOutlined />
      }
    ]
  }
]


export const MenuItems = (items:MenuItemNode[]) => {
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
  
