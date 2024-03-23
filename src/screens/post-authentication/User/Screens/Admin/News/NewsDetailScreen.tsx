import { Card, Col, List, Row } from 'antd'
import { Text, Title } from '@Components/Typography/Typography'

import { Types } from '@invinciblezealorg/lms-common'

export default function NewsDetailScreen(props: { data: Types.News }) {
  const { data } = props
  console.log(data, 'doppop')
  return (
    <Row>
      <Col span={24}>
        <Row gutter={[20, 20]}>
          {data.summary.map(item => {
            return (
              <Col span={24}>
                <Card title={item.title}>
                  <List
                    dataSource={item.items}
                    renderItem={r => <Title level={5}>{r}</Title>}
                  />
                </Card>
              </Col>
            )
          })}
        </Row>
      </Col>
    </Row>
  )
}
