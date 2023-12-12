import { Card, Col, Row, Skeleton } from 'antd'

import { Fragment } from 'react'

export default function TestItemSkeleton () {
  const SkelArray = [1, 1, 1, 1]
  return (
    <Card
      title={<Skeleton.Button style={{height:25}} active />}
      style={{ minHeight: '80vh' }}
      extra={[
        <Row gutter={[10, 20]}>
          <Col>
            <Skeleton.Button active style={{ width: 60, height: 22 }} size="small" />
          </Col>
          <Col>
            <Skeleton.Button active style={{ width: 60, height: 22 }} size="small" />
          </Col>
        </Row>
      ]}
    >
      {' '}
      <Skeleton style={{ marginBottom: 25 }} active paragraph={{ rows: 1 }} />
      <Row gutter={[10, 20]}>
        <Col span={24}>
          <Skeleton.Button active style={{ height: 20 }} block />
        </Col>
        {SkelArray.map(() => (
          <Col span={24}>
            <Row gutter={[10, 20]}>
              <Col>
                <Skeleton.Avatar active size={20} shape={'circle'} />
              </Col>
              <Col flex={1}>
                <Skeleton.Button active style={{ height: 20 }} block />
              </Col>
            </Row>
          </Col>
        ))}
      </Row>
    </Card>
  )
}
