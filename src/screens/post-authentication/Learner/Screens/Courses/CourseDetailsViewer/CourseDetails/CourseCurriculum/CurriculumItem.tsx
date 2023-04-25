import { Col, Collapse, List, Row, Spin, Tag } from 'antd'
import { Common, Types } from '@adewaskar/lms-common'
import { LockOutlined, PlayCircleOutlined } from '@ant-design/icons'

import ActionModal from '@Components/ActionModal'
import CourseItemIcon from '@User/Screens/Courses/CourseBuilder/CourseSectionsNavigator/CourseItemIcon'
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer'

interface CourseCurriculumItemPropsI {
  item: Types.CourseSectionItem;
}

function CourseCurriculumItem({ item }: CourseCurriculumItemPropsI) {
  const {
    data: { url },
    isLoading: loading
  } = Common.Queries.useGetFileDetails(item.file + '', {
    enabled: !!item.file
  })
  const PreviewVideo = (item: Types.CourseSectionItem) => (
    <ActionModal title={item.title} cta={<PlayCircleOutlined />}>
      <Spin spinning={loading}>
        <MediaPlayer url={url || ''} />
      </Spin>
    </ActionModal>
  )

  let actions = []
  if (item.isPreview) {
    if (item.type === 'video') {
      actions.push(<Tag color="blue">Preview Available</Tag>)
      actions.push(PreviewVideo(item))
    }
  } else {
    actions.push(<LockOutlined />)
  }
  return (
    <List.Item actions={actions}>
      <List.Item.Meta
        avatar={<CourseItemIcon type="outlined" item={item} />}
        title={item.title}
      />
    </List.Item>
  )
}

export default CourseCurriculumItem
