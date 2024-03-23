import { Button, Card, Form, Tabs } from 'antd'
import { Constants, Learner, Types } from '@invinciblezealorg/lms-common'
import { Fragment, useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router'

import Header from '@User/Screens/UserRoot/UserHeader'
import LearnerDetailsEditor from './LearnersDetailsEditor'
import { UploadOutlined } from '@ant-design/icons'
import { User } from '@invinciblezealorg/lms-common'
import useMessage from '@Hooks/useMessage'

function LearnerEditor() {
  const message = useMessage()
  const { id: learnerId } = useParams()
  const [learner, setLearner] = useState(Constants.INITIAL_LEARNER_DETAILS)
  const {
    mutate: updateLearner,
    isLoading: loading
  } = User.Queries.useUpdateLearner()
  useEffect(
    () => {
      form.setFieldsValue(learner)
    },
    [learner]
  )

  const saveLearner = (data: Types.Learner) => {
    updateLearner(
      {
        id: learnerId + '',
        data: data
      },
      {
        onSuccess: () => {
          message.open({
            type: 'success',
            content: 'Saved Learner Details'
          })
        }
      }
    )
  }
  const [form] = Form.useForm()
  return (
    <Header
      hideBack
      title="Learner Editor"
      extra={[
        <Fragment>
          <Button
            loading={loading}
            type="primary"
            onClick={form.submit}
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
          items={[
            {
              label: `Profile Details`,
              key: '1',
              children: <LearnerDetailsEditor />
            }
          ]}
        />

        <Outlet />
      </Card>
    </Header>
  )
}

export default LearnerEditor
