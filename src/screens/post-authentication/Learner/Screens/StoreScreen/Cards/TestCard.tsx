import {
  Badge,
  Card,
  Col,
  Divider,
  Rate,
  Row,
  Space,
  Tag
} from 'antd'
import { BarChartOutlined, BookOutlined, ClockCircleOutlined, EditOutlined } from '@ant-design/icons'
import { Constants, Enum, Types } from '@adewaskar/lms-common'

import Image from '@Components/Image'
import PriceCardContent from './PriceCardContent'
import { Typography } from 'antd'
import { Utils } from '@adewaskar/lms-common'
import { capitalize } from 'lodash'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'

const { Text } = Typography

const { UnitTypeToStr } = Utils;

interface TestCardPropsI {
  test: Types.Test;
}

const CustomCard = styled(Card)`
cursor: pointer;
/* margin-left: 30px;
margin-bottom: 20px; */
`

function TestCard(props: TestCardPropsI) {
  const { test } = props;
  const navigate = useNavigate();
  const plan = test.plan as unknown as Types.Plan || Constants.INITIAL_COURSE_PLAN_DETAILS;
  // const instructor = test.instructor as unknown as Types.Instructor;
  const formattedDuration = test.duration.enabled? Utils.formatTime(test.duration.value * 60):null
  return (
    // <Badge.Ribbon text="Best Seller" color="orange">
      <CustomCard hoverable
        onClick={() =>
          navigate(
            `../test/${test._id}`
          )
        } bodyStyle={{padding: 15}}
        cover={
          <Image alt="example" style={{height: 140}}
            src={
             test.thumbnailImage
            }
          /> 
        }
      >
        <Card.Meta
          title={<Space size='small' direction="vertical"  >
            <Text ellipsis style={{
          fontSize: 16,
          whiteSpace: 'normal', // Ensures text wraps
          overflowWrap: 'break-word' // Breaks words to prevent overflow
        }}>{test.title}</Text>
          </Space>}
        />
          <Row justify={'space-between'} style={{marginTop:10}}>
            <Col>
            {formattedDuration?<Tag icon={<ClockCircleOutlined />} color='blue-inverse' style={{fontSize: 13}}>
                   {formattedDuration}
          </Tag>:null}
          {test.input.type===Enum.TestInputType.HANDWRITTEN?<Tag icon={<EditOutlined />} color='volcano-inverse' style={{fontSize: 13}}>
                   Handwritten
          </Tag>:null}
        </Col>
        </Row>
        <Divider style={{marginTop:10,marginBottom:10}}/>
        <Row justify={'space-between'}>
          <Col span={24}>
          <PriceCardContent plan={plan} />
          </Col>
        </Row>
      </CustomCard>
  )
}

export default TestCard
