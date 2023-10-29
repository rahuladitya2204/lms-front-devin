import {
  Button,
  Col,
  Divider,
  Dropdown,
  List,
  Modal,
  Row,
  Space,
  Tag,
  Typography
} from 'antd'
import {
  CaretDownOutlined,
  DeleteOutlined,
  DotChartOutlined,
  EditOutlined,
  PlayCircleOutlined
} from '@ant-design/icons'
import { Constants, Learner, Store, Types } from '@adewaskar/lms-common'
import React, { useState } from 'react'

import CreateNote from './CreateNote'
import HtmlViewer from '@Components/HtmlViewer'
import { formatSeconds } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils'
import { useParams } from 'react-router'
import useWatchTime from '@Components/MediaPlayer/Playr/useWatchTime'
import MoreButton from '@Components/MoreButton'

const { Text } = Typography
const { confirm } = Modal
interface CourseNoteItemPropsI {
  course: Types.Course;
  note: Types.CourseNote;
}
const CourseNoteItem: React.FC<CourseNoteItemPropsI> = props => {
  const { mutate: deleteNoteApi } = Learner.Queries.useDeleteNote()
  const playerInstance = Store.usePlayer(s => s.state.playerInstance)
  const { sectionId, itemId } = useParams()
  const section = props.course.sections.find(s => s._id === sectionId)
  const item = section?.items.find(i => i._id === itemId)
  const time = formatSeconds(props.note.time)
  const [selectedNote, setSelectedNote] = useState<Types.CourseNote>(Constants.INITIAL_COURSE_NOTE_DETAILS);
  const deleteNote = () => {
    confirm({
      title: 'Are you sure?',
      // icon: <ExclamationCircleOutlined />,
      content: `You want to delete this note`,
      onOk() {
        deleteNoteApi(
          {
            courseId: props.course._id,
            noteId: props.note._id + ''
          },
          {
            onSuccess: () => {}
          }
        )
      },
      okText: 'Delete'
    })
  }

  return selectedNote._id ? (
    <Row>
      <Col span={24}>
        <CreateNote
          onFinish={e => setSelectedNote(Constants.INITIAL_COURSE_NOTE_DETAILS)}
          selectedNote={selectedNote}
          item={itemId + ''}
          courseId={props.course._id}
        />
      </Col>
    </Row>
  ) : (
    <List.Item
      actions={[
        // <Dropdown
        //   trigger={['click']}
        //   menu={{
        //     items: [
        //       {
        //         key: '1',
        //         label: (
        //           <a
        //             onClick={() => {
        //               if (playerInstance) {
        //                 playerInstance.currentTime = 3
        //               }
        //             }}
        //           >
        //             <PlayCircleOutlined /> Play
        //           </a>
        //         )
        //       },
        //       {
        //         key: '2',
        //         label: (
        //           <a onClick={e => setSelectedNote(props.note)}>
        //             <EditOutlined /> Edit
        //           </a>
        //         )
        //       },
        //       {
        //         key: '3',
        //         label: (
        //           <a onClick={deleteNote}>
        //             <DeleteOutlined /> Delete
        //           </a>
        //         )
        //       }
        //     ]
        //   }}
        //   placement="bottomRight"
        // >
        //   <Button size="small" icon={<CaretDownOutlined />} />
        // </Dropdown>,
        <MoreButton
          items={[
            {
              label: `Play`,
              onClick: () => {
                if (playerInstance) {
                  playerInstance.currentTime = 3
                }
              },
              key: 'play',
              icon: <PlayCircleOutlined />
            },
            {
              label: `Edit`,
              onClick: () => {
                setSelectedNote(props.note)
              },
              key: 'edit',
              icon: <EditOutlined />
            },
            {
              label: `Delete`,
              onClick: deleteNote,
              key: 'play',
              icon: <DeleteOutlined />
            }
          ]}
        />
      ]}
    >
      <List.Item.Meta
        avatar={<Tag color="blue">{time}</Tag>}
        title={
          <Row>
            <Col>
              <Text strong>{section?.title}</Text>
              <Divider type="vertical" />
              <Text>{item?.title}</Text>
            </Col>
          </Row>
        }
        description={
          <Text>
            <HtmlViewer content={props.note.content} />
          </Text>
        }
      />
    </List.Item>
  )
}

export default CourseNoteItem
