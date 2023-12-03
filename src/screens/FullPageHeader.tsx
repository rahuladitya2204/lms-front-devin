import Layout from '@Components/Layout'
import ThemeProvider from './ThemeProvider'

// @ts-ignore
export default function FullPageHolder (props) {
  return (
    <ThemeProvider>
      <Layout style={{ minHeight: '100vh' }}>{props.children}</Layout>
    </ThemeProvider>
  )
}
