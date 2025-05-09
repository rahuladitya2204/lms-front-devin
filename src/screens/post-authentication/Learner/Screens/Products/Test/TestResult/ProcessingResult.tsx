import { Button, Col, Row, Spin } from 'antd'

import AppImage from '@Components/Image'
import Header from '@Components/Header'
import { Enum, Learner } from '@adewaskar/lms-common'
import { Typography } from '@Components/Typography'
import { useQueryClient } from '@tanstack/react-query'
import { useText } from '@Components/Editor/SunEditor/utils'

interface ProcessingResultPropsI {
  testId: string;
}

const { Title, Text } = Typography
export default function ProcessingResult(props: ProcessingResultPropsI) {
  const qc = useQueryClient();
  const {
    data: {
      metadata: {
        test: { language },
      },
    },
    isLoading: loadingEp,
  } = Learner.Queries.useGetEnrolledProductDetails({
    type: Enum.ProductType.TEST,
    id: props.testId + "",
  });
  const {
    data: { test, metrics, status },
    isFetching: loadingResult
  } = Learner.Queries.useGetTestResult(props.testId + '')
  const { FormatLangText } = useText(language);
  return (
    <Header>
      <Spin spinning={loadingResult}>
        <Row justify={'center'} align={'middle'}>
          <Col span={24}>
            <Title style={{ textAlign: 'center' }}>
              {FormatLangText('TEST_UNDER_VALUATION')}
            </Title>
            <Title level={3} style={{ textAlign: 'center' }}>
              {FormatLangText('CHECK_BACK_IN_FEW_MINS')}
            </Title>
            <Title type="secondary" level={5} style={{ textAlign: 'center' }}>
              {FormatLangText('REFRESH_PAGE_IN_SOME_TIME')}
              <br />
              <Button
                style={{ marginTop: 20 }}
                onClick={() => {
                  qc.invalidateQueries([`GET_TEST_RESULT`, props.testId])
                }}
                id='refresh-button'
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
