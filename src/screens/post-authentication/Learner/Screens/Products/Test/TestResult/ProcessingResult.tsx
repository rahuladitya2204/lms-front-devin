import { Button, Col, Row, Spin } from 'antd'

import AppImage from '@Components/Image'
import Header from '@Components/Header'
import { Enum, Learner } from '@adewaskar/lms-common'
import { Typography } from '@Components/Typography'
import { useQueryClient } from '@tanstack/react-query'
import { FormatLangText } from '@Components/Editor/SunEditor/utils'
import { TEXTS } from 'texts/texts'

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
  return (
    <Header>
      <Spin spinning={loadingResult}>
        <Row justify={'center'} align={'middle'}>
          <Col span={24}>
            <Title style={{ textAlign: 'center' }}>
              {FormatLangText(TEXTS.TEST_UNDER_VALUATION, language)}
            </Title>
            <Title level={3} style={{ textAlign: 'center' }}>
              {FormatLangText(TEXTS.CHECK_BACK_IN_FEW_MINS, language)}
            </Title>
            <Title type="secondary" level={5} style={{ textAlign: 'center' }}>
              {FormatLangText(TEXTS.REFRESH_PAGE_IN_SOME_TIME, language)}
              <br />
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
