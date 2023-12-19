import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  List,
  Row,
  Skeleton,
  Tag,
} from 'antd'
import { Constants, Learner, Store, Types } from '@adewaskar/lms-common'

import CourseNoteItem from './NoteItem'
import CreateNote from './CreateNote'
import { Typography } from '@Components/Typography'
import { useParams } from 'react-router'

const { Text } = Typography

interface CourseNotesPropsI {
  course: Types.Course;
}
const CourseNotes: React.FC<CourseNotesPropsI> = props => {
  // const playerInstance = Store.usePlayer(s => s.state.playerInstance)
  const { course } = props
  const { itemId } = useParams()
  const {
    data: notes,
    isLoading: loadingNotes,
    isFetching: fetchingNotes
  } = Learner.Queries.useGetCourseNotes(
    course._id
    // {
    //   enabled: !!course._id
    // }
  )

  const currentItemNotes = notes.filter(note => note.item === itemId) || []
  return (
    <Row>
         <Col span={24}>
            <CreateNote item={itemId + ''} courseId={course._id} />
      </Col>
      <Divider />

      <Col span={24}>
    
        {loadingNotes?<>  <Skeleton avatar paragraph={{ rows: 1 }} />
            <Skeleton avatar paragraph={{ rows: 1 }} />
            <Skeleton avatar paragraph={{ rows: 1 }} /></>: <List loading={fetchingNotes}
          locale={{ emptyText: 'No Notes Added' }}
          itemLayout="horizontal"
          dataSource={currentItemNotes.sort((a,b)=>a.time-b.time)}
          renderItem={(note, index) => {
            return <CourseNoteItem course={course} note={note} />
          }}
        />}
    <Row>
       
        </Row>
      </Col>
    </Row>
  )
}

export default CourseNotes
