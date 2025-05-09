import { Card, Tabs } from 'antd'

import EmailSettingScreen from '../EmailSetting/EmailSettingScreen'
import { Fragment } from 'react'
import Header from '@Components/Header'
import LearnerSetting from './LearnerSetting'
import OrgProfile from './OrgProfile'
import { Outlet } from 'react-router'
import TicketCategorysScreen from '../SupportTickets/TicketCategoriesScreen'
import UserProfile from './UserProfile'

function UserAccount () {
  return (
    <Header
      title="My Account"
      extra={[
        <Fragment>
          {/* <Button
            loading={loading}
            type="primary"
            onClick={saveUser}
            icon={<UploadOutlined />}
          >
            Save Account
          </Button> */}
        </Fragment>
      ]}
    >
      <Card>
        <Tabs
          defaultActiveKey="1123"
          // onChange={onChange}
          items={[
            {
              label: `Org Details`,
              key: '1123',
              children: <OrgProfile />
            },
            {
              label: `Learner`,
              key: '1112323',
              children: <LearnerSetting />
            },
            // {
            //   label: `Profile Details`,
            //   key: '1',
            //   children: <UserProfile />
            // },
            // {
            //   label: `Referral`,
            //   key: '2',
            //   children: `Content of Tab Pane 2`
            // },
            // {
            //   label: `Purchase History`,
            //   key: '3',
            //   children: `Content of Tab Pane 3`
            // },
            {
              label: `Ticket Support`,
              key: '4',
              children: <TicketCategorysScreen />
            },
            {
              label: `Email Comunication`,
              key: '5',
              children: <EmailSettingScreen />
            }
          ]}
        />

        <Outlet />
      </Card>
    </Header>
  )
}

export default UserAccount
