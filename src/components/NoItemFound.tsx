import { Card, Col, Row } from 'antd'

import Image from './Image'

interface NoItemFoundProps {}

export default function NoItemFound(props: NoItemFoundProps) {
  return (
    <Row>
      <Col span={24}>
        {/* <Card> */}
        <Image src={'no-item-found.svg'} />
        {/* </Card> */}
      </Col>
    </Row>
  )
}
