import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ReadOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons'
import { List, Typography } from 'antd'

import { Course } from '@Types/Courses.types'
import styled from '@emotion/styled'

const { Title, Text } = Typography

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
    value: '43 Weeks'
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
  course: Course;
}

function CourseMetadata(props: CourseMetadataPropsI) {
  data.enrolled.value = `${props.course.studentsEnrolled} students`
  data.lectures.value = `${props.course.sections.length}`
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
