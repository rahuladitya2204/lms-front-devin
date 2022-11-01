/*eslint-disable */

import { Anchor, PageHeader } from 'antd'

import { MenuUnfoldOutlined } from '@ant-design/icons'
import useGlobal from '../../../../../store/useGlobal'

interface HeaderPropsI {
  children?: React.ReactNode;
  title?: string;
  extra?: React.ReactNode[];
}

function Header(props: HeaderPropsI) {
  const { isDrawerOpen, setDrawerOpen } = useGlobal(state => state)
  return (
    <PageHeader
      onBack={() => null}
      extra={props.extra}
      title={props.title || 'LMS'}
      backIcon={
        <MenuUnfoldOutlined onClick={() => setDrawerOpen(!isDrawerOpen)} />
      }
    >
      {props.children}
    </PageHeader>
  )
}

export default Header
