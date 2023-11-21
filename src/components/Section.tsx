import { Col, Row, Typography } from 'antd'

interface SectionPropsI {
  children: React.ReactNode;
  title: string | React.ReactNode;
  subtitle?: string;
  extra?: React.ReactNode[];
}

const { Title, Text } = Typography

function Section(props: SectionPropsI) {
  return (
    <Row>
      <Col span={24}>
        <Row justify={'space-between'} align={'middle'}>
          <Col>
            {' '}
            <Title style={{ marginTop: 0 }} level={2}>
              {props.title}
            </Title>
          </Col>
          {props.extra ? <Col>{props.extra}</Col> : null}
        </Row>
        {props.subtitle ? (
          <Text style={{ marginTop: 0 }}>{props.subtitle}</Text>
        ) : null}
      </Col>
      <Col span={24}>{props.children}</Col>
    </Row>
  )
}

export default Section
