import { Button, Card, Col, Form, Row } from 'antd'
import { Constants, Types } from '@adewaskar/lms-common'
import { EyeOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons'
import { Fragment, useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router'

import Header from '@Components/Header'
import Tabs from '@Components/Tabs'
import TestDetailsEditor from './TestDetailsEditor/TestDetails'
import TestLandingPageEditor from './TestLandingPage/TestLandingPageEditor'
import TestPricingEditor from '../TestPricingEditor/TestPricingEditor'
import { User } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'

function TestInformationEditor(props: any) {
  const { id } = useParams()
  const testId = id + ''
  const [test, setTest] = useState(Constants.INITIAL_LIVE_TEST_DETAILS)

  const { data: testDetails } = User.Queries.useGetTestDetails(
    testId,
    {
      enabled: !!testId
    }
  )

  useEffect(
    () => {
      setTest(testDetails)
    },
    [testDetails]
  )
  return (
    <Fragment>
      {/* <Form onFinish={saveTest} form={form} layout="vertical" autoComplete="off"> */}
      <Tabs
        // defaultActiveKey="1"
        items={[
          {
            label: `Details`,
            active: true,
            key: 'details',
            children: (
              <TestDetailsEditor
                saveTest={props.saveTest}
                test={props.test}
                testId={props.testId}
              />
            )
          },
          {
            label: `Landing Page`,
            key: 'landing-page',
            children: (
              <TestLandingPageEditor
                saveTest={props.saveTest}
                test={props.test}
                testId={props.testId}
              />
            )
          },
          {
            label: `Pricing`,
            key: 'pricing',
            children: (
              <TestPricingEditor
                saveTest={props.saveTest}
                test={props.test}
                testId={props.testId}
              />
            )
          }
          // {
          //   label: `Advanced`,
          //   key: 'advanced',
          //   children: (
          //     <TestAdvancedSettings
          //       saveTest={props.saveTest}
          //       test={props.test}
          //       testId={props.testId}
          //     />
          //   )
          // }
        ]}
      />

      <Outlet />
    </Fragment>
  )
}

export default TestInformationEditor
