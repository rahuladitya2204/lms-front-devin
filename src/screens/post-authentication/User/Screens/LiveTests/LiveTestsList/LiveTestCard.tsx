import { Avatar, Badge, Card, Tag, Tooltip } from 'antd'
import {
  BarChartOutlined,
  EyeOutlined,
  FormatPainterOutlined,
  InfoCircleOutlined,
  ToolOutlined
} from '@ant-design/icons'
import { Enum, Types } from '@adewaskar/lms-common'

import Image from '@Components/Image'
import { capitalize } from 'lodash'
import dayjs from 'dayjs'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router'

interface LiveTestCardProps {
  liveTest: Types.LiveTest;
}

const LiveTestCardHolder = styled(Card)`
  img {
    width: 100%;
  }
`

function LiveTestCard({ liveTest }: LiveTestCardProps) {
  const navigate = useNavigate()
  const ThumbnailImage = (
    <Image height={200} alt="example" src={liveTest.image} />
  )
  return (
    <LiveTestCardHolder
      hoverable
      cover={
        liveTest.status === Enum.LiveTestStatus.ENDED ? (
          <Badge.Ribbon color="red" text={capitalize(liveTest.status)}>
            {ThumbnailImage}
          </Badge.Ribbon>
        ) : (
          ThumbnailImage
        )
      }
      actions={[
        <InfoCircleOutlined
          onClick={() => navigate(`${liveTest._id}/editor#information`)}
        />,
        <Tooltip placement="bottom" title={'Go to Live Test builder'}>
          <ToolOutlined onClick={() => navigate(`${liveTest._id}/builder`)} />
        </Tooltip>,
        // <Tooltip placement="bottom" title={'Build landing page'}>
        //   <FormatPainterOutlined
        //     onClick={() => navigate(`${liveTest._id}/editor`)}
        //   />
        // </Tooltip>,
        <Tooltip placement="bottom" title={'Analysis'}>
          <BarChartOutlined
            onClick={() => {
              navigate(`${liveTest._id}/status`)
            }}
          />
        </Tooltip>
        // <WechatOutlined />,
        // <SettingOutlined />
      ]}
    >
      <Card.Meta
        description={
          liveTest.status === Enum.LiveTestStatus.PUBLISHED ? (
            `Scheduled At: ${dayjs(liveTest.scheduledAt).format('LLL')}`
          ) : liveTest.status === Enum.LiveTestStatus.ENDED ? (
            `Ended At: ${dayjs(liveTest.endedAt).format('LLL')}`
          ) : liveTest.status === Enum.LiveTestStatus.IN_PROGRESS ? (
            <Tag color="green">In Progress</Tag>
          ) : (
            ''
          )
        }
        // avatar={<Avatar src={instructor?.image} />}
        title={liveTest.title || ''}
      />
    </LiveTestCardHolder>
  )
}

export default LiveTestCard
