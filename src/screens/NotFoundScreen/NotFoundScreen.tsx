import { Button, Result } from 'antd'

import Image from '@Components/Image'
import LoadingScreen from '@Components/LoadingScreen'
import React from 'react'
import { Store } from '@adewaskar/lms-common'

const NotFoundScreen: React.FC = () => {
  const isAliasValid = Store.useGlobal(s => s.isAliasValid)
  return isAliasValid ? (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}
    >
      <Image width={'100%'} style={{ flex: 1 }} src={'/images/404.svg'} />
    </div>
  ) : (
    <LoadingScreen />
  )
}

export default NotFoundScreen
