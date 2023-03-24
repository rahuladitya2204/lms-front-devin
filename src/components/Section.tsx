import { Col, Row, Typography } from 'antd'

interface SectionPropsI {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const { Title } = Typography

function Section(props: SectionPropsI) {
  return (
    <Row>
      <Col span={24}>
        <Title level={3}>{props.title}</Title>
      </Col>
      <Col span={24}>{props.children}</Col>
    </Row>
  )
}

export default Section
