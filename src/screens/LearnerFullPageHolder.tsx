import { Card, Col, Row } from 'antd'
import { Learner, Store } from '@adewaskar/lms-common'

import Header from '@Components/Header'
import Layout from '@Components/Layout'
import LearnerLogin from '@Learner/Screens/Login'
import { ModalProvider } from '@Components/ActionModal/ModalContext'
import { Outlet } from 'react-router'
import ThemeProvider from './ThemeProvider'
import { useBlockBackButton } from '@User/Screens/Event/LiveSessionPlayer/User/hooks'

export default function LearnerFullPageHolder () {
  useBlockBackButton()
  const isSignedIn = Store.useAuthentication(s => s.isSignedIn)
  return (
    <ThemeProvider>
      <ModalProvider>
        <Layout
          style={{ minHeight: '100vh', paddingLeft: 10, paddingRight: 10 }}
        >
          {isSignedIn ? (
            <Outlet />
          ) : (
            <Row justify={'center'} align={'middle'}>
              <Col>
                <Card style={{ marginTop: 120, width: 300 }}>
                  <LearnerLogin />
                </Card>
              </Col>
            </Row>
          )}
        </Layout>
      </ModalProvider>
    </ThemeProvider>
  )
}
