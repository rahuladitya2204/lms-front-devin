import { Card, Col, Row } from 'antd'
import { Learner, Store } from '@adewaskar/lms-common'

import Header from '@Components/Header'
import Layout from '@Components/Layout'
import LearnerLogin from '@Learner/Screens/Login'
import { ModalProvider } from '@Components/ActionModal/ModalContext'
import { Outlet } from 'react-router'
import ThemeProvider from './ThemeProvider'

export default function LearnerFullPageHolder () {
  return (
    <ThemeProvider>
      <ModalProvider>
        <Layout
          style={{ minHeight: '100vh', paddingLeft: 10, paddingRight: 10 }}
        >
          <Outlet />
        </Layout>
      </ModalProvider>
    </ThemeProvider>
  )
}
