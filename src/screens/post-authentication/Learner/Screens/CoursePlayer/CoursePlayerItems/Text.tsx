// @ts-nocheck

import { Typography } from 'antd'
import React from 'react'
import { CourseSectionItem } from '@Types/Common.types'
import { Course } from '@Types/Courses.types'

interface CoursePlayerItemsPropsI {
  item: CourseSectionItem;
}

const CoursePlayerTextItem: React.FC<CoursePlayerItemsPropsI> = props => {
  return (
    <div>
      <Typography.Text>{props.item.data?.title || ''}</Typography.Text>
      <div dangerouslySetInnerHTML={{ __html: item?.data?.description }} />
    </div>
  )
}

export default CoursePlayerTextItem
