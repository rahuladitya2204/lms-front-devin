import { Col, Row } from 'antd'

import { Title } from './Typography/Typography';

interface ContainerPropsI {
  title?: string;
  extra?: React.ReactNode | React.ReactNode[];
  children: React.ReactNode;
}


export default function Container(props: ContainerPropsI) {
  return (
    <Row gutter={[30, 30]}>
      <Col span={24}>
        <Row align={'middle'}>
          {props.title ? (
            <Col flex={1}>
              <Title level={4}>{props.title}</Title>
            </Col>
          ) : null}
          {props.extra ? <Col>{props.extra}</Col> : null}
        </Row>
      </Col>
      <Col span={24}>{props.children}</Col>
    </Row>
  )
}
