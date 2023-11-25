import { Col, Row, Spin, Typography } from 'antd'

import AppImage from '@Components/Image'
import Header from '@Components/Header'
import { Learner } from '@adewaskar/lms-common'

interface ProcessingResultPropsI {
  testId: string;
}

const { Title, Text } = Typography
export default function ProcessingResult(props: ProcessingResultPropsI) {
  const {
    data: { test, metrics, status },
    isFetching: loadingResult
  } = Learner.Queries.useGetTestResult(props.testId + '')
  return (
    <Header>
      <Spin spinning={loadingResult}>
        <Row justify={'center'} align={'middle'}>
          <Col span={24}>
            <Title style={{ textAlign: 'center' }}>
              Test result is under process..
            </Title>
            <Title level={3} style={{ textAlign: 'center' }}>
              Check back in few minutes
            </Title>
            <Text style={{ textAlign: 'center' }}>
              Please refresh this page in some time.
            </Text>
          </Col>
          <Col span={24}>
            <AppImage width={400} src={'/images/processing-result.svg'} />
          </Col>
        </Row>
      </Spin>
    </Header>
  )
}
