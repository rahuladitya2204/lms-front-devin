import { Button, Card, Tabs } from 'antd'
import {  UploadOutlined } from '@ant-design/icons'
import { Outlet, useNavigate, useParams } from 'react-router'
import { Fragment, useEffect, useState } from 'react'

import { Learner } from '@Types/Learner.types'
import LearnerDetailsEditor from './LearnersDetailsEditor'
import { useGetLearnerDetails, useUpdateLearner } from '@User/Api/queries'
import { INITIAL_LEARNER_DETAILS } from 'constant'

function LearnerEditor() {
  const { id: instructorId } = useParams()
  const navigate = useNavigate()
  const [instructor, setLearner] = useState(INITIAL_LEARNER_DETAILS)
  const { mutate: updateLearner, isLoading: loading } = useUpdateLearner()
  const { data } = useGetLearnerDetails(instructorId + '', {
    enabled: !!`instructorId`
  })

  useEffect(
    () => {
      setLearner(data)
    },
    [data]
  )

  const saveLearner = () => {
    updateLearner({
      id: instructorId + '',
      data: instructor
    })
  }

  const onFormUpdate = (data: Partial<Learner>) => {

    setLearner({
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
            onClick={saveLearner}
            icon={<UploadOutlined />}
          >
            Save Learner
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
              <LearnerDetailsEditor
                formData={instructor}
                onFormUpdate={onFormUpdate}
              />
            )
          },
          // {
          //   label: `Courses`,
          //   key: '2',
          //   children: `Content of Tab Pane 2`
          // },
          // {
          //   label: `Purchase History`,
          //   key: '3',
          //   children: `Content of Tab Pane 3`
          // },
          // {
          //   label: `Advanced`,
          //   key: '4',
          //   children: `Content of Tab Pane 3`
          // }
        ]}
      />

      <Outlet />
    </Card>
  )
}

export default LearnerEditor
