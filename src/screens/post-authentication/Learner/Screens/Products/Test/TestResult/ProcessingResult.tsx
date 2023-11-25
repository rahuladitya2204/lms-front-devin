import { Col, Row, Typography } from 'antd'

import AppImage from '@Components/Image'
import Header from '@Components/Header'
import { Learner } from '@adewaskar/lms-common'

interface ProcessingResultPropsI {
  testId: string;
}

const { Title } = Typography
export default function ProcessingResult(props: ProcessingResultPropsI) {
  const {
    data: { test, metrics, status },
    isFetching: loadingResult
  } = Learner.Queries.useGetTestResult(props.testId + '')
  return (
    <Header title={'Test result: ' + test.title}>
      <Row justify={'center'} align={'middle'}>
        <Col span={24}>
          <Title style={{ textAlign: 'center' }}>
            Test result is under process..
          </Title>
          <Title level={3} style={{ textAlign: 'center' }}>
            Check back in few minutes
          </Title>
        </Col>
        <Col span={24}>
          <AppImage width={400} src={'/images/processing-result.svg'} />
        </Col>
      </Row>
    </Header>
  )
}
