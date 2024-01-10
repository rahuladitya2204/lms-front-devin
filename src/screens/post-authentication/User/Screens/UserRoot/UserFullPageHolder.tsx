import Layout from '@Components/Layout'
import { ModalProvider } from '@Components/ActionModal/ModalContext'
import { Outlet } from 'react-router'
import ThemeProvider from 'screens/ThemeProvider'

export default function UserFullPageHolder () {
  return (
    <ThemeProvider>
      <ModalProvider>
        <Layout style={{ minHeight: '100vh' }}>
          <Outlet />
        </Layout>
      </ModalProvider>
    </ThemeProvider>
  )
}
