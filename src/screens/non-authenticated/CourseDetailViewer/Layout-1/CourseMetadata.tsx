import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ReadOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons'
import { List, Typography } from 'antd'

import { CourseDetailType } from '../../../../types/Courses.types'
import styled from '@emotion/styled'

const { Title, Text } = Typography

const ListItem = styled(List.Item)`
  padding: 5px 15px;
`

const data = [
  {
    title: 'Duration',
    icon: <ClockCircleOutlined />,
    value: '43 Weeks'
  },
  {
    title: 'Lectures',
    icon: <ReadOutlined />,
    value: '43 Weeks'
  },
  {
    title: 'Enrolled',
    icon: <CheckCircleOutlined />,
    value: '1982 Students'
  },
  {
    title: 'Language',
    icon: <CheckCircleOutlined />,
    value: 'English'
  },
  {
    title: 'Skill Level',
    icon: <CheckCircleOutlined />,
    value: 'Beginner'
  },
  {
    title: 'Deadline',
    icon: <CalendarOutlined />,
    value: '06 April 2020'
  },
  {
    title: 'Certificate',
    icon: <SafetyCertificateOutlined />,
    value: 'Yes'
  }
]

interface CourseMetadataPropsI {
  course: CourseDetailType;
}

function CourseMetadata(props: CourseMetadataPropsI) {
  return (
    <List
      itemLayout="horizontal"
      dataSource={data}
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
