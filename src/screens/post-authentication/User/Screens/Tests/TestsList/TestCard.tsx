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

interface TestCardProps {
  Test: Types.Test;
}

const TestCardHolder = styled(Card)`
  img {
    width: 100%;
  }
`

function TestCard({ Test }: TestCardProps) {
  const navigate = useNavigate()
  const ThumbnailImage = (
    <Image height={200} alt="example" src={Test.image} />
  )
  return (
    <TestCardHolder
      hoverable
      cover={
        Test.status === Enum.TestStatus.ENDED ? (
          <Badge.Ribbon color="red" text={capitalize(Test.status)}>
            {ThumbnailImage}
          </Badge.Ribbon>
        ) : (
          ThumbnailImage
        )
      }
      actions={[
        <InfoCircleOutlined
          onClick={() => navigate(`${Test._id}/editor#information`)}
        />,
        <Tooltip placement="bottom" title={'Go to Tests builder'}>
          <ToolOutlined onClick={() => navigate(`${Test._id}/builder`)} />
        </Tooltip>,
        // <Tooltip placement="bottom" title={'Build landing page'}>
        //   <FormatPainterOutlined
        //     onClick={() => navigate(`${Test._id}/editor`)}
        //   />
        // </Tooltip>,
        <Tooltip placement="bottom" title={'Analysis'}>
          <BarChartOutlined
            onClick={() => {
              navigate(`${Test._id}/status`)
            }}
          />
        </Tooltip>
        // <WechatOutlined />,
        // <SettingOutlined />
      ]}
    >
      <Card.Meta
        description={
          Test.status === Enum.TestStatus.PUBLISHED ? (
            `Scheduled At: ${dayjs(Test.scheduledAt).format('LLL')}`
          ) : Test.status === Enum.TestStatus.ENDED ? (
            `Ended At: ${dayjs(Test.endedAt).format('LLL')}`
          ) : Test.status === Enum.TestStatus.IN_PROGRESS ? (
            <Tag color="green">In Progress</Tag>
          ) : (
            ''
          )
        }
        // avatar={<Avatar src={instructor?.image} />}
        title={Test.title || ''}
      />
    </TestCardHolder>
  )
}

export default TestCard
