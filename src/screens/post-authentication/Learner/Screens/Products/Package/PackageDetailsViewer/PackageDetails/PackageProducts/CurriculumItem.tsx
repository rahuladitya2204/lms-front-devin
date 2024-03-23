import { Col, Collapse, List, Row, Spin, Tag } from 'antd'
import { Common, Learner, Types } from '@adewaskar/lms-common'
import { LockOutlined, PlayCircleOutlined } from '@ant-design/icons'

import ActionModal from '@Components/ActionModal/ActionModal'
import CourseItemIcon from '@User/Screens/Courses/CourseEditor/CourseBuilder/CourseSectionsNavigator/CourseItemIcon'
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer'
import { useModal } from '@Components/ActionModal/ModalContext'

interface CourseCurriculumItemPropsI {
  item: Types.CourseSectionItem;
}

function CourseCurriculumItem({ item }: CourseCurriculumItemPropsI) {
  const { openModal } = useModal()
  const {
    data: { url },
    isFetching: loading
  } = Learner.Queries.useGetFileDetails(item.file + '', {
    enabled: !!item.file
  })
  const PreviewVideo = (item: Types.CourseSectionItem) => (
    <PlayCircleOutlined
      onClick={() =>
        openModal(
          <Spin spinning={loading}>
            <MediaPlayer url={url || ''} />
          </Spin>,
          {
            title: item.title
          }
        )
      }
    />
    // <ActionModal title={item.title} cta={<PlayCircleOutlined />}>
    // <Spin spinning={loading}>
    //   <MediaPlayer url={url || ''} />
    // </Spin>
    // </ActionModal>
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
