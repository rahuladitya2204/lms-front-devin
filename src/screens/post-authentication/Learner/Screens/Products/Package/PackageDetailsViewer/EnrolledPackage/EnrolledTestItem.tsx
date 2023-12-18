import {
  Button,
  Card,
  Col,
  Image,
  List,
  Progress,
  Row,
  Space,
  Typography
} from 'antd'
import { CheckCircleOutlined, CheckOutlined, VerifiedOutlined } from '@ant-design/icons';

import LearnerTestResultStatus from '@Components/LearnerTestResultStatus';
import { Types } from '@adewaskar/lms-common'
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';

const { Title,Text } = Typography

interface EnrolledTestItemPropsI {
    enrolledProduct: Types.EnrolledProductDetails;
}

export default function EnrolledTestItem(props: EnrolledTestItemPropsI) {
    const enrolledTest = props.enrolledProduct;
    const test = enrolledTest.product.data as Types.Test;
    const navigate = useNavigate();
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
        <Row gutter={[10,10]}>
                  <Col
                    //   span={3}
                  >
            <Image
              height={70}
              width={100} preview={false}
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
                      {enrolledTest.metadata.test.endedAt?<Text>Attempted on { dayjs(enrolledTest.metadata.test.startedAt).format('LL')}</Text>:null}
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
      </Card>
    </List.Item>
  )
}
