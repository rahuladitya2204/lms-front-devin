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
} from "@Lib/index";
import {
  CaretDownOutlined,
  DeleteOutlined,
  DotChartOutlined,
  EditOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { Constants, Learner, Store, Types } from "@adewaskar/lms-common";
import React, { useMemo, useState } from "react";

import CreateNote from "./CreateNote";
import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import MoreButton from "@Components/MoreButton";
import { Typography } from "@Components/Typography";
import { formatSeconds } from "@User/Screens/Courses/CourseEditor/CourseBuilder/utils";
import { useParams } from "@Router/index";
import dayjs from "dayjs";
import { useOutletContext } from "react-router";

const { Text } = Typography;
const { confirm } = Modal;
interface CourseNoteItemPropsI {
  course: Types.Course;
  note: Types.CourseNote;
}
const CourseNoteItem: React.FC<CourseNoteItemPropsI> = (props) => {
  const { id: courseId, itemId } = useParams();
  const { mutate: deleteNoteApi } = Learner.Queries.useDeleteNote(courseId + '', itemId + '');
  const playerInstance = Store.usePlayer((s) => s.state.playerInstance);
  const [, , language] = useOutletContext();
  const { data: item } = Learner.Queries.useGetCourseItemDetails(courseId + '', itemId + '', language)
  const time = formatSeconds(props.note.time);
  const [selectedNote, setSelectedNote] = useState<Types.CourseNote>(
    Constants.INITIAL_COURSE_NOTE_DETAILS
  );
  const deleteNote = () => {
    confirm({
      title: "Are you sure?",
      // icon: <ExclamationCircleOutlined />,
      content: `You want to delete this note`,
      onOk() {
        deleteNoteApi(
          {
            courseId: props.course._id,
            noteId: props.note._id + "",
          },
          {
            onSuccess: () => { },
          }
        );
      },
      okText: "Delete",
    });
  };
  const isVideo = item?.type === 'video';
  const ACTIONS = useMemo(() => {
    const tempArr = [<Tag>{dayjs(props.note.createdAt).format('LL')}</Tag>];
    if (isVideo) {
      tempArr.push(<Button
        onClick={() => {
          if (playerInstance) {
            playerInstance.currentTime = 3;
          }
        }}
        icon={<PlayCircleOutlined />}
      >
        Play Here
      </Button>)
    }
    tempArr.push(<MoreButton
      items={[
        {
          label: `Edit`,
          onClick: () => {
            setSelectedNote(props.note);
          },
          key: "edit",
          icon: <EditOutlined />,
        },
        {
          label: `Delete`,
          onClick: deleteNote,
          key: "play",
          icon: <DeleteOutlined />,
        },
      ]}
    />)
    return tempArr
  }, [props.note, isVideo, itemId])
  return selectedNote._id ? (
    <Row>
      <Col span={24}>
        <CreateNote
          onFinish={(e) =>
            setSelectedNote(Constants.INITIAL_COURSE_NOTE_DETAILS)
          }
          selectedNote={selectedNote}
          itemId={itemId + ""}
          courseId={props.course._id}
        />
      </Col>
    </Row>
  ) : (
    <List.Item
      actions={ACTIONS}
    >
      <List.Item.Meta
        avatar={isVideo ? <Tag color="blue">{time}</Tag> : null}
        // title={
        //   <Row>
        //     <Col>
        //       <Text strong>{name}</Text>
        //       <Divider type="vertical" />
        //       {/* <Text>{item?.title}</Text> */}
        //     </Col>
        //   </Row>
        // }
        description={
          <Text>
            <HtmlViewer content={props.note.content} />
          </Text>
        }
      />
    </List.Item>
  );
};

export default CourseNoteItem;
