import { Button, Card, Tabs } from 'antd'
import { EyeOutlined, UploadOutlined } from '@ant-design/icons'
import {
  INITIAL_INSTRUCTOR_DETAILS,
  useGetInstructorDetails,
  useUpdateInstructor
} from '../../../../../../network/Instructor/queries'
import { Outlet, useNavigate, useParams } from 'react-router'
import { Fragment, useEffect, useState } from 'react'

import { Instructor } from '../../../../../../types/Instructor.types'
import InstructorDetailsEditor from './InstructorDetailsEditor'

function InstructorEditor() {
  const { id: instructorId } = useParams()
  const navigate = useNavigate()
  const [instructor, setInstructor] = useState(INITIAL_INSTRUCTOR_DETAILS)
  const { mutate: updateInstructor, isLoading: loading } = useUpdateInstructor()
  const { data } = useGetInstructorDetails(instructorId + '', {
    enabled: !!`instructorId`
  })

  useEffect(
    () => {
      setInstructor(data)
    },
    [data]
  )

  const saveInstructor = () => {
    updateInstructor({
      id: instructorId + '',
      data: instructor
    })
  }

  const onFormUpdate = (data: Partial<Instructor>) => {
    console.log(data, 'data')
    setInstructor({
      ...instructor,
      ...data
    })
  }

  return (
    <Card
      extra={
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
      }
    >
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
  )
}

export default InstructorEditor
