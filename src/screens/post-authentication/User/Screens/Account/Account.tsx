import { Button, Card, Tabs } from 'antd'
import { Fragment, useEffect, useState } from 'react'

import Header from '@Components/Header'
import { INITIAL_ORG_DETAILS } from 'constant.ts'
import { Organisation } from '@Types/Organisation'
import { Outlet } from 'react-router'
import { UploadOutlined } from '@ant-design/icons'
import UserProfile from './Profile'

function UserAccount () {
  return (
    <Header
      title="My Account"
      extra={[
        <Fragment>
          {/* <Button
            loading={loading}
            type="primary"
            onClick={saveInstructor}
            icon={<UploadOutlined />}
          >
            Save Account
          </Button> */}
        </Fragment>
      ]}
    >
      <Card>
        <Tabs
          defaultActiveKey="1"
          // onChange={onChange}
          items={[
            {
              label: `Profile Details`,
              key: '1',
              children: (
                <UserProfile
                //   formData={instructor}
                //   onFormUpdate={onFormUpdate}
                />
              )
            },
            {
              label: `Referral`,
              key: '2',
              children: `Content of Tab Pane 2`
            },
            {
              label: `Purchase History`,
              key: '3',
              children: `Content of Tab Pane 3`
            },
            {
              label: `Advanced`,
              key: '4',
              children: `Content of Tab Pane 3`
            }
          ]}
        />

        <Outlet />
      </Card>
    </Header>
  )
}

export default UserAccount
