import { Card, Col, Row } from 'antd'
import { Learner, Store } from '@adewaskar/lms-common'

import Layout from '@Components/Layout'
import LearnerLogin from '@Learner/Screens/Login'
import { ModalProvider } from '@Components/ActionModal/ModalContext'
import { Outlet } from 'react-router'
import ThemeProvider from './ThemeProvider'

export default function LearnerFullPageHolder () {
  const isSignedIn = Store.useAuthentication(s => s.isSignedIn)
  return (
    <ThemeProvider>
      <ModalProvider>
        <Layout style={{ minHeight: '100vh' }}>
          {isSignedIn ? (
            <Outlet />
          ) : (
            <Row justify={'center'} align={'middle'}>
              <Col>
                <Card style={{ width: 300,marginTop:100 }}>
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
