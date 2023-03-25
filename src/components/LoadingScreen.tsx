import { Space, Spin } from 'antd'

import OrgLogo from './OrgLogo'

function LoadingScreen(props: any) {
  return (
    <Space
      align="center"
      style={{
        display: 'flex',
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}
    >
      <Space align="center">
        <OrgLogo />
        <Spin />
      </Space>
    </Space>
  )
}

export default LoadingScreen
