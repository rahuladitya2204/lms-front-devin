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
  test: Types.Test;
}

const TestCardHolder = styled(Card)`
  img {
    width: 100%;
  }
`

function TestCard({ test }: TestCardProps) {
  const navigate = useNavigate()
  const ThumbnailImage = <Image height={200} alt="example" src={test.image} />
  return (
    <TestCardHolder
      bodyStyle={{ height: 115 }}
      hoverable
      cover={
        test.status === Enum.TestStatus.ENDED ? (
          <Badge.Ribbon color="red" text={capitalize(test.status)}>
            {ThumbnailImage}
          </Badge.Ribbon>
        ) : (
          ThumbnailImage
        )
      }
      actions={[
        <InfoCircleOutlined
          onClick={() => navigate(`${test._id}/editor#information`)}
        />,
        <Tooltip placement="bottom" title={'Go to Tests builder'}>
          <ToolOutlined onClick={() => navigate(`${test._id}/builder`)} />
        </Tooltip>,
        // <Tooltip placement="bottom" title={'Build landing page'}>
        //   <FormatPainterOutlined
        //     onClick={() => navigate(`${test._id}/editor`)}
        //   />
        // </Tooltip>,
        <Tooltip placement="bottom" title={'Analysis'}>
          <BarChartOutlined
            onClick={() => {
              navigate(`${test._id}/status`)
            }}
          />
        </Tooltip>
        // <WechatOutlined />,
        // <SettingOutlined />
      ]}
    >
      <Card.Meta
        description={
          test.status === Enum.TestStatus.PUBLISHED ? (
            `Scheduled At: ${dayjs(test.scheduledAt).format('LLL')}`
          ) : test.status === Enum.TestStatus.ENDED ? (
            `Ended At: ${dayjs(test.endedAt).format('LLL')}`
          ) : test.status === Enum.TestStatus.IN_PROGRESS ? (
            <Tag color="green">In Progress</Tag>
          ) : (
                  <Tag color="blue">
                    Ongoing Test
            </Tag>
          )
        }
        // avatar={<Avatar src={instructor?.image} />}
        title={test.title || ''}
      />
    </TestCardHolder>
  )
}

export default TestCard
