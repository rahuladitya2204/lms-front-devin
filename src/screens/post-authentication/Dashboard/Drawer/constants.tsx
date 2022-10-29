import { AppstoreOutlined, MailOutlined, UsergroupDeleteOutlined } from '@ant-design/icons'

export const MENU_ITEMS = [
  {
    title: 'Home',
    icon: <MailOutlined />,
    path: 'home'
  },
  {
    title: 'Courses',
    icon: <MailOutlined />,
    path: 'courses',
    children: [
      {
        title: 'All Courses',
        path: '',
        icon: <AppstoreOutlined />
      },
      {
        title: 'Packages',
        path: '',
        icon: <AppstoreOutlined />
      },
      {
        title: 'Question Bank',
        path: '',
        icon: <AppstoreOutlined />
      }
    ]
  },
  {
    title: 'Users',
    icon: <UsergroupDeleteOutlined />,
    path: 'courses',
    children: [
      {
        title: 'Learners',
        path: '',
        icon: <AppstoreOutlined />
      },
      {
        title: 'Admins',
        path: '',
        icon: <AppstoreOutlined />
      },
      {
        title: 'Instructors',
        path: '',
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
        path: '',
        icon: <AppstoreOutlined />
      },
      {
        title: 'Website Builder',
        path: '',
        icon: <AppstoreOutlined />
      }
    ]
  }
]
