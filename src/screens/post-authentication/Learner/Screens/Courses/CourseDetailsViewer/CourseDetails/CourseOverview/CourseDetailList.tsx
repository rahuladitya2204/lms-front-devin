import { List } from 'antd'
import { ReactNode } from 'react'

const data = [
  {
    title: 'Ant Design Title 1'
  },
  {
    title: 'Ant Design Title 2'
  },
  {
    title: 'Ant Design Title 3'
  },
  {
    title: 'Ant Design Title 4'
  }
]

interface CourseDetailListPropsI {
  renderItem: (item: string) => ReactNode;
  data: string[];
}

function CourseDetailList(props: CourseDetailListPropsI) {
  return (
    <List<string>
    grid={{ column: 2}}
      split={false}
      bordered={false}
      itemLayout="vertical"
      dataSource={props.data}
      renderItem={props.renderItem}
    />
  )
}

export default CourseDetailList
