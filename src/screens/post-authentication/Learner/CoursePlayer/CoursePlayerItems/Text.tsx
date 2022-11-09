// @ts-nocheck

import { Typography } from 'antd'
import React from 'react'
import { CourseSectionItem } from '../../../../../types/Common.types'
import { Course } from '../../../../../types/Courses.types'

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
