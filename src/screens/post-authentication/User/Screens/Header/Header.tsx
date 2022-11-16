/*eslint-disable */

import { Anchor, Col, PageHeader, Row } from 'antd'
import useGlobal from '@Store/useGlobal'

interface HeaderPropsI {
  children?: React.ReactNode;
  title?: string;
  extra?: React.ReactNode[];
}

function Header(props: HeaderPropsI) {
  const { isDrawerOpen, setDrawerOpen } = useGlobal(state => state)
  return (
    <PageHeader
      // ghost={false}
      extra={props.extra}
      title={props.title || 'LMS'}
    >
      {props.children}
    </PageHeader>
  )
}

export default Header
