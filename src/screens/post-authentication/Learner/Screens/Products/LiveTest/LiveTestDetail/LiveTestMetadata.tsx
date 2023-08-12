import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ReadOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons'
import { List, Typography } from 'antd'
import { Types, Utils } from '@adewaskar/lms-common'

import dayjs from 'dayjs'
import styled from '@emotion/styled'

const { Text } = Typography

const ListItem = styled(List.Item)`
  padding: 5px 15px;
`

const data = {
  scheduledFor: {
    title: 'Date',
    icon: <CalendarOutlined />,
    value: ''
  },
  duration: {
    title: 'Duration',
    icon: <ClockCircleOutlined />,
    value: '43 Weeks'
  },
  enrolled: {
    title: 'Enrolled',
    icon: <CheckCircleOutlined />,
    value: '1'
  },
  language: {
    title: 'Language',
    icon: <CheckCircleOutlined />,
    value: 'English'
  },
  // skillLevel: {
  //   title: 'Skill Level',
  //   icon: <CheckCircleOutlined />,
  //   value: 'Beginner'
  // },
  certificate: {
    title: 'Certificate',
    icon: <SafetyCertificateOutlined />,
    value: 'Yes'
  }
}

interface LiveTestMetadataPropsI {
  liveTest: Types.LiveTest;
}

function LiveTestMetadata(props: LiveTestMetadataPropsI) {
  data.scheduledFor.value = dayjs(props.liveTest.scheduledAt).format('LLL')
  data.duration.value = formatTime(props.liveTest.duration)
  data.enrolled.value = `${props.liveTest.analytics.enrolled.count} students`
  data.certificate.value = props.liveTest.certificate ? 'Yes' : ''
  // @ts-ignore
  const dataSource = Object.keys(data).map(key => data[key])
  return (
    <List
      itemLayout="horizontal"
      dataSource={dataSource}
      renderItem={item => (
        <ListItem actions={[<Text>{item.value}</Text>]}>
          <List.Item.Meta
            avatar={item.icon}
            title={<Text>{item.title}</Text>}
          />
        </ListItem>
      )}
    />
  )
}

export default LiveTestMetadata

function formatTime(minute: number) {
  const seconds = minute * 60
  if (minute < 60) {
    return `${minute} mins`
  } else {
    const hours = Math.floor(seconds / 3600)
    return `${hours} hr`
  }
}
