// @ts-nocheck

import { Typography } from 'antd'
import React from 'react'
import { CourseSectionItem } from '@Types/Common.types'

interface CoursePlayerItemsPropsI {
  item: CourseSectionItem;
}

const CoursePlayerTextItem: React.FC<CoursePlayerItemsPropsI> = props => {
  return (
    <div style={{ margin: 30, overflow: 'scroll' }}>
      <Typography.Text>{props.item?.title || ''}</Typography.Text>
      <div dangerouslySetInnerHTML={{ __html: props.item?.description }} />
    </div>
  )
}

export default CoursePlayerTextItem
