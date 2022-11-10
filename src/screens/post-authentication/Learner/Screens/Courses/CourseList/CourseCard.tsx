import { Avatar, Card, Col, Layout, Menu, Progress, Row, Tabs, Typography } from 'antd'
import React, { useState } from 'react'

import Header from '@Components/Header'
import { useGetCourses } from '@Learner/Api/queries'
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined
} from '@ant-design/icons'
import Meta from 'antd/lib/card/Meta'
import { Course } from '@Types/Courses.types'

const { Text } = Typography

interface CourseCardPropsI {
  course: Course;
}

const CourseCard: React.FC<CourseCardPropsI> = ({ course }) => {
  const { data: courses } = useGetCourses()
  console.log(courses, 'courses')
  return (
    <Card
      bodyStyle={{ padding: 10 }}
      cover={<img alt="example" src={course.thumbnailImage} />}
    >
      <Meta
        // avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
        title={
          <Text style={{ fontSize: 13 }} type="secondary">
            Started July 9, 2020
          </Text>
        }
        description={
          <Text strong>
            The Complete JavaScript Course 2020: Real Projects!
          </Text>
        }
      />
      <Progress percent={30} />
    </Card>
  )
}

export default CourseCard
