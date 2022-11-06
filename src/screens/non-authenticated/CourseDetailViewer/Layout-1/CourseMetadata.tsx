import {
  Button,
  Card,
  Col,
  Divider,
  List,
  Row,
  Space,
  Tag,
  Typography
} from 'antd'
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ReadOutlined,
  SafetyCertificateFilled,
  SafetyCertificateOutlined
} from '@ant-design/icons'

import { CourseDetailsType } from '../../../../types/Courses.types'
import MediaPlayer from '../../../../components/MediaPlayer'
import image from './bg.svg'
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
  course: CourseDetailsType;
}

function CourseMetadata(props: CourseMetadataPropsI) {
  return (
    <List
      itemLayout="horizontal"
      dataSource={data}
      renderItem={item => (
        <ListItem actions={[<Text>{item.value}</Text>]}>
          <List.Item.Meta
            avatar={item.icon}
            title={<a href="https://ant.design">{item.title}</a>}
          />
        </ListItem>
      )}
    />
  )
}

export default CourseMetadata
