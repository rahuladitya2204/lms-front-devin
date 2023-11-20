import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  ReadOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons'
import { List, Typography } from 'antd'
import { Types, Utils } from '@adewaskar/lms-common'

import dayjs from 'dayjs'
import styled from '@emotion/styled'
import { useMemo } from 'react'

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
    icon: <SafetyCertificateOutlined />,
    value: '1'
  }
  // questions: {
  //   title: 'Questions',
  //   icon: <EditOutlined />,
  //   value: '-'
  // },
  // language: {
  //   title: 'Language',
  //   icon: <CheckCircleOutlined />,
  //   value: 'English'
  // },
  // skillLevel: {
  //   title: 'Skill Level',
  //   icon: <CheckCircleOutlined />,
  //   value: 'Beginner'
  // },
  // certificate: {
  //   title: 'Certificate',
  //   icon: <SafetyCertificateOutlined />,
  //   value: 'Yes'
  // }
}

interface TestMetadataPropsI {
  test: Types.Test;
}

function TestMetadata(props: TestMetadataPropsI) {
  data.scheduledFor.value = props.test.live.enabled
    ? dayjs(props.test.live.scheduledAt).format('LLL')
    : 'Can be taken anytime'
  // @ts-ignore
  data.duration.value = props.test.duration.enabled
    ? formatTime(props.test.duration.value)
    : null
  data.enrolled.value = `${props.test.analytics.enrolled.count} students`
  // data.certificate.value = props.test.certificate ? 'Yes' : ''
  // data.questions.value = useMemo(
  //   () => props.test.sections.map(i => i.items).flat().length.toString(),
  //   [props.test]
  // )
  // @ts-ignore
  const dataSource = Object.keys(data).map(key => data[key])
  return (
    <List
      itemLayout="horizontal"
      dataSource={dataSource.filter(i => i.value)}
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

export default TestMetadata

function formatTime(minute: number) {
  const seconds = minute * 60
  if (minute < 60) {
    return `${minute} mins`
  } else {
    const hours = Math.floor(seconds / 3600)
    return `${hours} hr`
  }
}
