import { Button, Card, Tabs } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router'
import {
  useGetLearnerDetails,
  useUpdateLearner
} from '@User/Api/Learner/queries'

import Header from '@Components/Header'
import { INITIAL_LEARNER_DETAILS } from 'constant.ts'
import LearnerDetailsEditor from './LearnersDetailsEditor'
import { Types } from '@adewaskar/lms-common'
import { UploadOutlined } from '@ant-design/icons'

function LearnerEditor() {
  const { id: instructorId } = useParams()
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
