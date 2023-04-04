import { Button, Card, Tabs } from 'antd'
import { Constants, Types } from '@adewaskar/lms-common'
import { Fragment, useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router'

import Header from '@Components/Header'
import InstructorDetailsEditor from './InstructorDetailsEditor'
import { UploadOutlined } from '@ant-design/icons'
import { User } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'

function InstructorEditor() {
  const { message, context } = useMessage()
  const { id: instructorId } = useParams()
  const [instructor, setInstructor] = useState(
    Constants.INITIAL_INSTRUCTOR_DETAILS
  )
  const {
    mutate: updateInstructor,
    isLoading: loading
  } = User.Queries.useUpdateInstructor()
  const { data } = User.Queries.useGetInstructorDetails(instructorId + '', {
    enabled: !!`instructorId`
  })

  useEffect(
    () => {
      setInstructor(data)
    },
    [data]
  )

  const saveInstructor = () => {
    updateInstructor(
      {
        id: instructorId + '',
        data: instructor
      },
      {
        onSuccess: () => {
          console.log('Saving Instructor!')
          message.open({
            type: 'success',
            content: 'Saved'
          })
        }
      }
    )
  }

  const onFormUpdate = (data: Partial<Types.Instructor>) => {
    setInstructor({
      ...instructor,
      ...data
    })
  }

  return (
    <Header
      title="Instructor Editor"
      extra={[
        <Fragment>
          <Button
            loading={loading}
            type="primary"
            onClick={saveInstructor}
            icon={<UploadOutlined />}
          >
            Save Instructor
          </Button>
        </Fragment>
      ]}
    >
      {context}
      <Card>
        <Tabs
          defaultActiveKey="1"
          // onChange={onChange}
          items={[
            {
              label: `Profile Details`,
              key: '1',
              children: (
                <InstructorDetailsEditor
                  formData={instructor}
                  onFormUpdate={onFormUpdate}
                />
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
    </Header>
  )
}

export default InstructorEditor
