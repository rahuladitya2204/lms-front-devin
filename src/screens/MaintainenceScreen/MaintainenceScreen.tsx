import { Button, Col, Row, Typography } from 'antd'

import Image from '@Components/Image'
import underMaintainenceImg from './image.svg'

const { Title } = Typography

export default function MaintainenceScreen () {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Row justify={'center'}>
        <Col span={10}>
          <Image src={underMaintainenceImg} />
        </Col>
        <Col span={2} />
        <Col span={12}>
          <Title>Under Maintenance</Title>
          <Title style={{ fontSize: 20, marginBottom: 20 }} type="secondary">
            We'll be back
          </Title>
          <Button type="primary" size="large">
            Notify me{' '}
          </Button>
        </Col>
      </Row>
    </div>
  )
}
