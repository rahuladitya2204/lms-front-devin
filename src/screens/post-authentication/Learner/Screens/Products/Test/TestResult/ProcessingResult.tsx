import { Button, Col, Row, Spin, Typography } from 'antd'

import AppImage from '@Components/Image'
import Header from '@Components/Header'
import { Learner } from '@adewaskar/lms-common'
import { useQueryClient } from '@tanstack/react-query'

interface ProcessingResultPropsI {
  testId: string;
}

const { Title, Text } = Typography
export default function ProcessingResult(props: ProcessingResultPropsI) {
  const qc = useQueryClient()
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
              Your test is under evaluation..
            </Title>
            <Title level={3} style={{ textAlign: 'center' }}>
              Check back in few minutes
            </Title>
            <Title type="secondary" level={5} style={{ textAlign: 'center' }}>
              Please refresh this page in some time. <br />
              <Button
                style={{ marginTop: 20 }}
                onClick={() => {
                  qc.invalidateQueries([`GET_TEST_RESULT`, props.testId])
                }}
                type="primary"
              >
                Refresh
              </Button>
            </Title>
          </Col>
          <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
            <AppImage width={'100%'} src={'/images/processing-result.svg'} />
          </Col>
        </Row>
      </Spin>
    </Header>
  )
}
