import {
  AppstoreOutlined,
  MailOutlined,
  UsergroupDeleteOutlined
} from '@ant-design/icons'

import { MenuProps } from 'antd'
import { Types } from '@invinciblezealorg/lms-common'

export const MENU_ITEMS: Types.MenuItemNode[] = [
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
        title: 'Users',
        path: 'users',
        icon: <AppstoreOutlined />
      }
    ]
  },
  {
    title: 'Website',
    icon: <UsergroupDeleteOutlined />,
    path: 'website',
  }
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
  
