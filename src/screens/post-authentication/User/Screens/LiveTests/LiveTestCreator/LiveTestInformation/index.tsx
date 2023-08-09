import { Button, Card, Col, Form, Row } from 'antd'
import { Constants, Types } from '@adewaskar/lms-common'
import { EyeOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons'
import { Fragment, useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router'

import LiveTestDetailsEditor from './LiveTestDetailsEditor/LiveTestDetails'
import LiveTestLandingPageEditor from './LiveTestLandingPage/LiveTestLandingPageEditor'
import Header from '@Components/Header'
import Tabs from '@Components/Tabs'
import { User } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'

function LiveTestInformationEditor(props: any) {
  const { id } = useParams()
  const liveTestId = id + ''
  const [liveTest, setLiveTest] = useState(Constants.INITIAL_LIVE_TEST_DETAILS)

  const { data: liveTestDetails } = User.Queries.useGetLiveTestDetails(
    liveTestId,
    {
      enabled: !!liveTestId
    }
  )

  useEffect(
    () => {
      setLiveTest(liveTestDetails)
    },
    [liveTestDetails]
  )
  return (
    <Fragment>
      {/* <Form onFinish={saveLiveTest} form={form} layout="vertical" autoComplete="off"> */}
      <Tabs
        // defaultActiveKey="1"
        items={[
          {
            label: `Details`,
            active: true,
            key: 'details',
            children: (
              <LiveTestDetailsEditor
                saveLiveTest={props.saveLiveTest}
                liveTest={props.liveTest}
                liveTestId={props.liveTestId}
              />
            )
          },
          {
            label: `Landing Page`,
            key: 'landing-page',
            children: (
              <LiveTestLandingPageEditor
                saveLiveTest={props.saveLiveTest}
                liveTest={props.liveTest}
                liveTestId={props.liveTestId}
              />
            )
          }
          // {
          //   label: `Pricing`,
          //   key: 'pricing',
          //   children: (
          //     <LiveTestPricingEditor
          //       saveLiveTest={props.saveLiveTest}
          //       liveTest={props.liveTest}
          //       liveTestId={props.liveTestId}
          //     />
          //   )
          // },
          // {
          //   label: `Advanced`,
          //   key: 'advanced',
          //   children: (
          //     <LiveTestAdvancedSettings
          //       saveLiveTest={props.saveLiveTest}
          //       liveTest={props.liveTest}
          //       liveTestId={props.liveTestId}
          //     />
          //   )
          // }
        ]}
      />

      <Outlet />
    </Fragment>
  )
}

export default LiveTestInformationEditor
