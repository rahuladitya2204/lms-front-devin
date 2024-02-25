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
  const { isMobile,isDesktop,isTablet} = useBreakpoint();
  return (
    <List.Item style={{paddingLeft:0,paddingRight:0}}>
      <Card hoverable
        // onClick={() => window.open(`../../test/${test._id}`)}
        style={{
          width: '100%',
          borderRadius: 10
        }}
        bodyStyle={{ padding: 10 }}
      >
             <Ribbon color='purple-inverse' placement='start' text={test.live.enabled?'Live':null}>
 <Row gutter={[10,10]}>
            <Col flex={isMobile ? 1 : 'none'}
              xs={24}
              >
            <Image
              height={isMobile?150:70}
                width={!isMobile?100:'100%'}
                preview={false}
              src={test?.thumbnailImage}
            />
          </Col>
          {/* <Col span={1} xs={0} /> */}
          <Col
            flex={1} xs={24}
            style={{
              marginTop: 10,
              marginBottom: 10
            }}
          >
            <Title style={{ marginTop: 0,maxWidth:(isMobile || isTablet)?300:'auto' }} level={5}>
              {test.title}
                      </Title>
            {enrolledTest.metadata.test.endedAt ? <Row gutter={[0,10]}>
              <Col><Tag>Taken on {dayjs(enrolledTest.metadata.test.startedAt).format('LL')}</Tag></Col>
                {enrolledTest.metadata.test.result.status === Enum.TestResultStatus.EVALUATED ? <Col>
                  <Tag color='volcano-inverse'>Scored: {Math.ceil(enrolledTest?.metadata?.test?.result?.data?.metrics?.learnerScore)}/{enrolledTest?.metadata?.test?.result?.data?.metrics?.totalTestScore}</Tag></Col> :
                  <Tag color='orange-inverse' >Evaluation in progress</Tag> }
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
              // @ts-ignore
            xs={isMobile?24:null}
            style={{
              display: 'flex',
            alignItems: 'center',
              marginRight:isMobile?0:10
            }}
          >
            <Row gutter={[20,20]} style={{width:'100%',flex:1}} justify={'end'}>
            <Col xs={24} sm={12}>
                  <Button
// @ts-ignore 
     style={{ width: isMobile ? '100%' : 100, marginRight: isMobile ? 0 : null }}
                    onClick={() => window.open(`../../test/${test._id}`)}
                  // size='small'
                  block={!isDesktop}
                >View Details</Button></Col>
                          {(enrolledTest.metadata.test.endedAt) ? <>
                {/* {isDesktop?<LearnerTestResultStatus testId={test._id+''} />:null} */}
                  <Col xs={24} sm={12}><Button
                    // icon={!isMobile ? <CheckCircleOutlined /> : null}
                    onClick={() => navigate(`../../test/${test._id}/result`)}
                    block={!isDesktop}
                    // @ts-ignore 
     style={{marginRight: isMobile ? 0 : null }}
type='primary'
                    // size='small'
                  >
                  Solutions
                </Button></Col>
                </> : null}
   
                          {(!test?.live?.enabled) ?
                  (!enrolledTest.metadata.test.startedAt ? <Col xs={24} sm={12}><Button type='primary'
                  block={!isDesktop}
                  onClick={() => navigate(`../../test/${test._id}/start`)}
                  // size='small'
                >
                  Start Test
                  </Button></Col> : (!enrolledTest.metadata.test.endedAt ? <Col xs={24} sm={12}><Button
                      block={!isDesktop}
                      danger type='primary'
                    onClick={() => navigate(`../../test/${test._id}/start`)}
                      // size='small'
                    >
                    Continue Test
                  </Button></Col>:null)) :
                  null}
                      </Row>
          </Col>
        </Row>
        </Ribbon>
 </Card>
    </List.Item>
  )
}
