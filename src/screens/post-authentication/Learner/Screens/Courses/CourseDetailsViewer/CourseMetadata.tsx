import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ReadOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons'
import { List, Typography } from 'antd'

import { Types } from '@adewaskar/lms-common'
import styled from '@emotion/styled'

const { Text } = Typography

const ListItem = styled(List.Item)`
  padding: 5px 15px;
`

const data = {
  duration: {
    title: 'Duration',
    icon: <ClockCircleOutlined />,
    value: '43 Weeks'
  },
  lectures: {
    title: 'Lectures',
    icon: <ReadOutlined />,
    value: 1
  },
  enrolled: {
    title: 'Enrolled',
    icon: <CheckCircleOutlined />,
    value: '1982 Students'
  },
  language: {
    title: 'Language',
    icon: <CheckCircleOutlined />,
    value: 'English'
  },
  skillLevel: {
    title: 'Skill Level',
    icon: <CheckCircleOutlined />,
    value: 'Beginner'
  },
  deadline: {
    title: 'Deadline',
    icon: <CalendarOutlined />,
    value: '06 April 2020'
  },
  certificate: {
    title: 'Certificate',
    icon: <SafetyCertificateOutlined />,
    value: 'Yes'
  }
}

interface CourseMetadataPropsI {
  course: Types.Course;
}

function CourseMetadata(props: CourseMetadataPropsI) {
  data.enrolled.value = `${props.course.analytics.enrolled.total} students`
  data.lectures.value = (() => {
    let count = 0
    props.course.sections.forEach(i => {
      count += 1
    })
    return count + props.course.sections.length
  })()

  data.language.value = props.course.language
  // @ts-ignore
  const dataSource = Object.keys(data).map(key => data[key])
  return (
    <List
      itemLayout="horizontal"
      dataSource={dataSource}
      renderItem={item => (
        <ListItem actions={[<Text type="secondary">{item.value}</Text>]}>
          <List.Item.Meta
            avatar={item.icon}
            title={<Text type="secondary">{item.title}</Text>}
          />
        </ListItem>
      )}
    />
  )
}

export default CourseMetadata
