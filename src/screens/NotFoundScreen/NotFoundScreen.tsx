import { Button, Result } from 'antd'

import Image from '@Components/Image'
import React from 'react'
import notFound from './image.svg'

const NotFoundScreen: React.FC = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}
  >
    <Image width={'100%'} style={{ flex: 1 }} src={notFound} />
  </div>
)

export default NotFoundScreen
