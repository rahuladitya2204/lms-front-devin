import { Button, Card, Tabs } from 'antd'
import { Constants, Types } from '@adewaskar/lms-common'
import { Fragment, useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router'

import Header from '@Components/Header'
import LearnerDetailsEditor from './LearnersDetailsEditor'
import { UploadOutlined } from '@ant-design/icons'
import { User } from '@adewaskar/lms-common'

function LearnerEditor() {
  const { id: instructorId } = useParams()
  const [instructor, setLearner] = useState(Constants.INITIAL_LEARNER_DETAILS)
  const {
    mutate: updateLearner,
    isLoading: loading
  } = User.Queries.useUpdateLearner()
  const { data } = User.Queries.useGetLearnerDetails(instructorId + '', {
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

  const onFormUpdate = (data: Partial<Types.Learner>) => {
    setLearner({
      ...instructor,
      ...data
    })
  }

  return (
    <Header
      hideBack
      title="Learner Editor"
      extra={[
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
      ]}
    >
      {' '}
      <Card>
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
            }
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
    </Header>
  )
}

export default LearnerEditor
