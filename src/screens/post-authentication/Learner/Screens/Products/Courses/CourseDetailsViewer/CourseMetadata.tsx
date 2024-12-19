import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ReadOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons'
import { Constants, Learner, Types, Utils } from '@adewaskar/lms-common'
import { List, Skeleton, Typography } from 'antd'

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
  // lectures: {
  //   title: 'Lectures',
  //   icon: <ReadOutlined />,
  //   value: ''
  // },
  enrolled: {
    title: 'Enrolled',
    icon: <CheckCircleOutlined />,
    value: '2k+ Students'
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
  // deadline: {
  //   title: 'Deadline',
  //   icon: <CalendarOutlined />,
  //   value: '06 April 2020'
  // },
  // certificate: {
  //   title: 'Certificate',
  //   icon: <SafetyCertificateOutlined />,
  //   value: 'Yes'
  // }
}

interface CourseMetadataPropsI {
  course: Types.Course;
}

function CourseMetadata(props: CourseMetadataPropsI) {
  const courseId = props.course._id
  const {
    data: course,
    isFetching: loadingCourse
  } = Learner.Queries.useGetCourseDetails(courseId, {
    enabled: !!courseId
  })
  console.log(course, 'eeeee')
  data.duration.value = formatTime(course.duration.value)
  // data.enrolled.value = `${course.analytics.enrolled.count} students`
  // data.lectures.value = course.totalItems
  // data.certificate.value = course.certificate ? 'Yes' : ''
  data.language.value = Constants.LANGUAGES.filter(l => course.languages.includes(l.value)).map(i => i.label).join(', ')
  // @ts-ignore
  const dataSource = Object.keys(data).map(key => data[key])
  return (
    <List
      itemLayout="horizontal"
      dataSource={dataSource}
      renderItem={item => (
        <ListItem actions={[<Text strong>{item.value}</Text>]}>
          <List.Item.Meta
            avatar={item.icon}
            title={<Text>{item.title}</Text>}
          />
        </ListItem>
      )}
    />
  )
}

export default CourseMetadata

function formatTime(minute: number) {
  const seconds = minute * 60;
  if (seconds < 3600) {
    return '< 1hr'
  } else {
    const hours = Math.floor(seconds / 3600)
    return `${hours}hr+`
  }
}
