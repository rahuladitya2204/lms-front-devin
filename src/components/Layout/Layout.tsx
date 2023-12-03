import { LayoutProps, Layout as LibLayout } from 'antd'

interface PropsI extends LayoutProps {}
export const Layout = (props: PropsI) => {
  return <LibLayout {...props} />
}
export const Sider = LibLayout.Sider
export const Footer = LibLayout.Footer
export const Header = LibLayout.Header
export const Content = LibLayout.Content
