import { Button, Card, Col, Image, Row, Typography } from 'antd'

import { useNavigate } from 'react-router'

const { Title } = Typography
interface NoItemFoundProps {
  text: string;
  cta?: React.ReactNode;
}

export default function NoItemFound(props: NoItemFoundProps) {
  const navigate = useNavigate()
  return (
    <Row justify={'center'} align={'middle'}>
      {props.text ? (
        <Col span={24}>
          <Title style={{ textAlign: 'center', marginBottom: 30 }} level={2}>
            {props.text}
          </Title>
        </Col>
      ) : null}
      <Col
        span={24}
        style={{ display: 'flex', justifyContent: 'center', marginBottom: 30 }}
      >
        <Button size="large" onClick={() => navigate('../store')}>
          {props.cta ? props.cta : `Go Home`}
        </Button>
      </Col>
      <Col
        span={24}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* <Card> */}
        <Image preview={false} src={'/images/no-item-found.svg'} />
        {/* </Card> */}
      </Col>
    </Row>
  )
}
