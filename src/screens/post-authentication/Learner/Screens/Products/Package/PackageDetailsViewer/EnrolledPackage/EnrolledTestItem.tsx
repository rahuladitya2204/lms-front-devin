import {
  Badge,
  Button,
  Card,
  Col,
  Image,
  List,
  Progress,
  Row,
  Space,
  Tag,
} from 'antd'
import { CheckCircleOutlined, CheckOutlined, VerifiedOutlined } from '@ant-design/icons';
import { Enum, Types } from '@adewaskar/lms-common'

import { Fragment } from 'react';
import LearnerTestResultStatus from '@Components/LearnerTestResultStatus';
import { Typography } from '@Components/Typography';
import dayjs from 'dayjs';
import useBreakpoint from '@Hooks/useBreakpoint';
import { useNavigate } from 'react-router';

const { Title,Text } = Typography

interface EnrolledTestItemPropsI {
    enrolledProduct: Types.EnrolledProductDetails;
}

export default function EnrolledTestItem(props: EnrolledTestItemPropsI) {
    const enrolledTest = props.enrolledProduct;
    const test = enrolledTest.product.data as Types.Test;
  const navigate = useNavigate();
  const Ribbon = test.live.enabled ? Badge.Ribbon : Fragment;
  const { isMobile} = useBreakpoint();
  return (
    <List.Item>
      <Card hoverable
        // onClick={() => window.open(`../../test/${test._id}`)}
        style={{
          width: '100%',
          borderRadius: 10
        }}
        bodyStyle={{ padding: 0 }}
      >
             <Ribbon color='purple-inverse' placement='start' text={test.live.enabled?'Live':null}>
 <Row gutter={[10,10]}>
                  <Col xs={24} md={3}
                    //   span={3}
                  >
            <Image
              height={isMobile?150:70}
                width={isMobile?'100%':100}
                preview={false}
              src={test?.thumbnailImage}
            />
          </Col>
          <Col span={1} />
          <Col
            flex={1}
            style={{
              marginTop: 10,
              marginBottom: 10
            }}
          >
            <Title style={{ marginTop: 0 }} level={5}>
              {test.title}
                      </Title>
            {enrolledTest.metadata.test.endedAt ? <Row>
              <Col><Tag>Taken on {dayjs(enrolledTest.metadata.test.startedAt).format('LL')}</Tag></Col>
              <Col><Tag color='volcano-inverse'>Scored: { enrolledTest.metadata.test.result.data.metrics.learnerScore}/{ enrolledTest.metadata.test.result.data.metrics.totalTestScore}</Tag></Col>
            </Row> :
              <Row><Col>
                {test.duration.enabled ? <Tag color='blue-inverse' >{test.duration.value} mins</Tag> : null}
                {test.input.type===Enum.TestInputType.HANDWRITTEN?<Tag color='orange-inverse' >Handwritten</Tag>:null}
              {(test.live.scheduledAt && !enrolledTest.metadata.test.startedAt)?<Tag color='purple-inverse'>
                    Scheduled On { dayjs(test.live.scheduledAt).format('LLL')}</Tag>:null}
                </Col></Row>}
            <Space />
          </Col>
          <Col
            // span={6}
            style={{
              display: 'flex',
            alignItems: 'center',
              marginRight:10
            }}
          >
            <Space>
            
                          {(enrolledTest.metadata.test.endedAt) ? <>
                <LearnerTestResultStatus testId={test._id+''} />
                <Button icon={<CheckCircleOutlined />}
                  onClick={() => navigate(`../../test/${test._id}/result`)}
                  size='small'>
                  View Solutions
                </Button>
                          </> : null}
                          {(!test?.live?.enabled && (!enrolledTest.metadata.test.startedAt)) ?
                              <Button type='primary' onClick={()=>navigate(`../../test/${test._id}/start`)} size='small'>Start Test</Button> : null}

                      </Space>
          </Col>
        </Row>
        </Ribbon>
 </Card>
    </List.Item>
  )
}
