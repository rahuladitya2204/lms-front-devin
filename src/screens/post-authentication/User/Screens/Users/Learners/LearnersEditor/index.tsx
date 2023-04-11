import { Button, Card, Tabs } from 'antd'
import { Constants, Learner, Types } from '@adewaskar/lms-common'
import { Fragment, useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router'

import Header from '@Components/Header'
import LearnerDetailsEditor from './LearnersDetailsEditor'
import { UploadOutlined } from '@ant-design/icons'
import { User } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'

function LearnerEditor() {
  const message = useMessage();
  const { id: learnerId } = useParams()
  const [learner, setLearner] = useState(Constants.INITIAL_LEARNER_DETAILS)
  const {
    mutate: updateLearner,
    isLoading: loading
  } = User.Queries.useUpdateLearner()
  const { data } = User.Queries.useGetLearnerDetails(learnerId + '', {
    enabled: !!learnerId
  })

  useEffect(
    () => {
      setLearner(data)
    },
    [data]
  )

  const saveLearner = () => {
    updateLearner({
      id: learnerId + '',
      data: learner
    }, {
      onSuccess: () => {
        message.open({
          type: 'success',
          content: 'Saved Learner Details'
        })
      }
    })
  }

  const onFormUpdate = (data: Partial<Types.Learner>) => {
    setLearner({
      ...learner,
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
                  formData={learner}
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
