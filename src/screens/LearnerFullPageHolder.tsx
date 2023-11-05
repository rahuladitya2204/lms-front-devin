import { Layout } from 'antd'
import { Outlet } from 'react-router'
import ThemeProvider from './ThemeProvider'

export default function LearnerFullPageHolder () {
  return (
    <ThemeProvider>
      <Layout style={{ minHeight: '100vh' }}>
        <Outlet />
      </Layout>
    </ThemeProvider>
  )
}
