import { Button, Card, Form, Tabs } from 'antd'
import { Fragment, useEffect } from 'react'
import { Outlet, useParams } from 'react-router'

import Header from '@User/Screens/UserRoot/UserHeader'
import { Types } from '@adewaskar/lms-common'
import { UploadOutlined } from '@ant-design/icons'
import { User } from '@adewaskar/lms-common'
import UserDetailsEditor from './UserDetailsEditor'
import useMessage from '@Hooks/useMessage'

function UserEditor() {
  const message = useMessage()
  const { id: userId } = useParams()
  const [form] = Form.useForm()
  const {
    mutate: updateUser,
    isLoading: loading
  } = User.Queries.useUpdateUser()

  const { data: user } = User.Queries.useGetAppUserDetails(
    userId + ''
    // {
    //   enabled: !!userId
    // }
  )
  useEffect(
    () => {
      form.setFieldsValue(user)
    },
    [user]
  )

  const saveUser = (data: Partial<Types.User>) => {
    updateUser(
      {
        id: userId + '',
        data
      },
      {
        onSuccess: () => {
          message.open({
            type: 'success',
            content: 'Saved'
          })
        }
      }
    )
  }

  return (
    <Header
      title="User Editor"
      extra={[
        <Fragment>
          <Button
            loading={loading}
            type="primary"
            onClick={form.submit}
            icon={<UploadOutlined />}
          >
            Save User
          </Button>
        </Fragment>
      ]}
    >
      <Form
        form={form}
        onFinish={saveUser}
        layout="vertical"
        autoComplete="off"
      >
        <Card>
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                label: `Profile Details`,
                key: '1',
                children: (
                  <UserDetailsEditor saveUser={saveUser} userId={user._id} />
                )
              },
              {
                label: `Courses`,
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
      </Form>
    </Header>
  )
}

export default UserEditor
