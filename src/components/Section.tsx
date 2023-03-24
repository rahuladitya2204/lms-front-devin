import { Col, Row, Typography } from 'antd'

interface SectionPropsI {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const { Title, Text } = Typography

function Section(props: SectionPropsI) {
  return (
    <Row>
      <Col span={24}>
        <Title style={{ marginTop: 0, marginBottom: 10 }} level={3}>
          {props.title}
        </Title>
        {props.subtitle ? (
          <Text style={{ marginTop: 0 }}>{props.subtitle}</Text>
        ) : null}
      </Col>
      <Col span={24}>{props.children}</Col>
    </Row>
  )
}

export default Section
