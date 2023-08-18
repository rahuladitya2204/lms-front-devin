import { Avatar, Badge, Card, Tooltip } from 'antd'
import {
  EyeOutlined,
  FormatPainterOutlined,
  InfoCircleOutlined,
  ToolOutlined
} from '@ant-design/icons'

import Image from '@Components/Image'
import { Types } from '@adewaskar/lms-common'
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

function LiveTestCard(props: LiveTestCardProps) {
  const navigate = useNavigate()
  return (
    <LiveTestCardHolder
      hoverable
      cover={
        <Badge.Ribbon color="orange" text="Unpublished">
          <Image height={200} alt="example" src={props.liveTest.image} />
        </Badge.Ribbon>
      }
      actions={[
        <InfoCircleOutlined
          onClick={() => navigate(`${props.liveTest._id}/editor#information`)}
        />,
        <Tooltip placement="bottom" title={'Go to Live Test builder'}>
          <ToolOutlined
            onClick={() => navigate(`${props.liveTest._id}/builder`)}
          />
        </Tooltip>,
        <Tooltip placement="bottom" title={'Build landing page'}>
          <FormatPainterOutlined
            onClick={() => navigate(`${props.liveTest._id}/editor`)}
          />
        </Tooltip>,
        <EyeOutlined
          onClick={() => {
            navigate(`${props.liveTest._id}/player`)
          }}
        />
        // <WechatOutlined />,
        // <SettingOutlined />
      ]}
    >
      <Card.Meta
        description={`Scheduled At: ${dayjs(props.liveTest.scheduledAt).format(
          'LLL'
        )}`}
        // avatar={<Avatar src={instructor?.image} />}
        title={props.liveTest.title || ''}
      />
    </LiveTestCardHolder>
  )
}

export default LiveTestCard
