import { Card, Col, Row } from 'antd'

export default function AffiliateDashboard () {
  return (
    <Row gutter={[20, 20]}>
      <Col span={6}>
        <Card title="Total Earning">1212</Card>
      </Col>
      <Col span={6}>
        <Card title="Pending Earnings">1212</Card>
      </Col>
      <Col span={6}>
        <Card title="Paid Earnings">1212</Card>
      </Col>
      <Col span={6}>
        <Card title="Next Payout Date">12 Dec 2023</Card>
      </Col>
    </Row>
  )
}
