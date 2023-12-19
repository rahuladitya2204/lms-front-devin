import { Avatar, Badge, Card, Col, Row, Space, Tag, Tooltip } from 'antd'
import {
  BarChartOutlined,
  InfoCircleOutlined,
  ToolOutlined
} from '@ant-design/icons'
import { Enum, Types } from '@adewaskar/lms-common'

import Image from '@Components/Image'
import { Typography } from '@Components/Typography'
import dayjs from 'dayjs'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router'

const { Text } = Typography

interface EventCardProps {
  event: Types.Event;
}

const EventCardHolder = styled(Card)`
  img {
    width: 100%;
  }
`

function EventCard(props: EventCardProps) {
  const navigate = useNavigate()
  const coverImage = (
    <Image height={200} alt="example" src={props.event.thumbnailImage} />
  )

  const isPublished = props.event.status === Enum.EventStatus.PUBLISHED
  const isDraft = props.event.status === Enum.EventStatus.DRAFT
  return (
    <EventCardHolder
      hoverable
      cover={
        isDraft || isPublished ? (
          <Badge.Ribbon
            color={isDraft ? 'orange' : 'green'}
            text={isDraft ? 'Draft' : 'Published'}
          >
            {coverImage}
          </Badge.Ribbon>
        ) : (
          coverImage
        )
      }
      actions={[
        <InfoCircleOutlined
          onClick={() => navigate(`${props.event._id}/editor#information`)}
        />,
        <Tooltip placement="bottom" title={'Go to event builder'}>
          <ToolOutlined
            onClick={() => navigate(`${props.event._id}/builder`)}
          />
        </Tooltip>,
        // <Tooltip placement="bottom" title={'Build landing page'}>
        //   <FormatPainterOutlined
        //     onClick={() =>
        //       navigate(`${props.event._id}/editor`)
        //     }
        //   />
        // </Tooltip>,
        <BarChartOutlined
          onClick={() => {
            navigate(`${props.event._id}/analytics`)
          }}
        />
        // <WechatOutlined />,
        // <SettingOutlined />
      ]}
    >
      <Card.Meta
        // @ts-ignore
        description={
          <Row gutter={[20, 10]}>
            <Col span={24}>
              <Tag color="blue">
                Enrolled: {props.event.analytics.enrolled.count}
              </Tag>
            </Col>

            <Col span={24}>
              <Text style={{ fontSize: 14 }}>
                Scheduled At: {dayjs(props.event.scheduledAt).format('l')}
              </Text>
            </Col>
          </Row>
        }
        // avatar={<Avatar src={instructor?.image} />}
        title={props.event.title || ''}
      />
    </EventCardHolder>
  )
}

export default EventCard
