import { Layout } from 'antd'
import { Outlet } from 'react-router'
import ThemeProvider from './ThemeProvider'

// @ts-ignore
export default function FullPageHolder (props) {
  return (
    <ThemeProvider>
      <Layout style={{ minHeight: '100vh' }}>{props.children}</Layout>
    </ThemeProvider>
  )
}
