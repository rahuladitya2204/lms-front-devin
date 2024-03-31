import { Button, Card, Col, Form, Row, Spin } from 'antd'
import { Constants, Types } from '@adewaskar/lms-common'
import { EyeOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons'
import { Fragment, useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import { useParams } from '@Router/index'

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
  const [test, setTest] = useState(Constants.INITIAL_TEST_DETAILS)

  const {
    data: testDetails,
    isFetching: loadingTest
  } = User.Queries.useGetTestDetails(testId, {
    enabled: !!testId
  })

  useEffect(
    () => {
      setTest(testDetails)
    },
    [testDetails]
  )
  return (
    <Spin spinning={loadingTest}>
      <Tabs
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
    </Spin>
  )
}

export default TestInformationEditor
