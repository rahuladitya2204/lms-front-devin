import { Button, Card, Form, Tabs } from 'antd'
import { Fragment, useEffect } from 'react'
import { Outlet, useParams } from 'react-router'

import Header from '@Components/Header'
import InstructorDetailsEditor from './InstructorDetailsEditor'
import { Types } from '@adewaskar/lms-common'
import { UploadOutlined } from '@ant-design/icons'
import { User } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'

function InstructorEditor() {
  const message = useMessage()
  const { id: instructorId } = useParams()
  const [form] = Form.useForm()
  const {
    mutate: updateInstructor,
    isLoading: loading
  } = User.Queries.useUpdateInstructor()

  const { data: instructor } = User.Queries.useGetInstructorDetails(
    instructorId + '',
    {
      enabled: !!instructorId
    }
  )
  useEffect(
    () => {
      form.setFieldsValue(instructor)
    },
    [instructor]
  )

  const saveInstructor = (data: Types.Instructor) => {
    updateInstructor(
      {
        id: instructorId + '',
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
      title="Instructor Editor"
      extra={[
        <Fragment>
          <Button
            loading={loading}
            type="primary"
            onClick={form.submit}
            icon={<UploadOutlined />}
          >
            Save Instructor
          </Button>
        </Fragment>
      ]}
    >
      <Form
        form={form}
        onFinish={saveInstructor}
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
                  <InstructorDetailsEditor instructorId={instructor._id} />
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

export default InstructorEditor
