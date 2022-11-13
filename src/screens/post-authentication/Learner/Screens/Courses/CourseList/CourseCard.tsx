import { Avatar, Card, Progress, Typography } from 'antd'
import React, { useState } from 'react'

import { useGetCourses } from '@Learner/Api/queries'

import Meta from 'antd/lib/card/Meta'
import { Course } from '@Types/Courses.types'
import styled from '@emotion/styled'

const { Text } = Typography

interface CourseCardPropsI {
  course: Course;
  onClick: () => void;
}

const CardHolder = styled(Card)`
  cursor: pointer;
`

const CourseCard: React.FC<CourseCardPropsI> = props => {
  return (
    <CardHolder 
      onClick={props.onClick}
      bodyStyle={{ padding: 10 }} style={{width: 200}}
      cover={<img alt="example" src={props.course.thumbnailImage} />}
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
    </CardHolder>
  )
}

export default CourseCard
