import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Row,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import { Constants, Learner, Store, Types } from "@adewaskar/lms-common";
import React, { useEffect, useMemo, useState } from "react";

import TextArea from "@Components/Textarea";
import { formatSeconds } from "@User/Screens/Courses/CourseEditor/CourseBuilder/utils";
import useMessage from "@Hooks/useMessage";
import { useOutletContext } from "react-router";

const { Text } = Typography;

interface CourseNotesPropsI {
  courseId: string;
  onFinish?: (r?: any) => void;
  itemId: string;
  selectedNote?: Types.CourseNote;
}
const CreateNote: React.FC<CourseNotesPropsI> = (props) => {
  const { mutate: createNote, isLoading: savingNote } =
    Learner.Queries.useCreateNote(props.courseId);

  const [, , language] = useOutletContext();
  const { data: item } = Learner.Queries.useGetCourseItemDetails(props.courseId, props.itemId)
  const playerInstance = Store.usePlayer((s) => s.state.playerInstance);
  const { mutate: updateNote, isLoading: updatingNote } = Learner.Queries.useUpdateNote(props.courseId);
  const { currentTime } = Store.usePlayer((s: any) => s.state);
  const time = formatSeconds(props.selectedNote?.time || currentTime);
  // console.log(currentTime, 'currentTime')
  const onSave = (data: Partial<Types.CourseNote>) => {
    const note = {
      content: data.content + "",
      time: currentTime,
      item: props.itemId,
    };
    if (props.selectedNote) {
      updateNote(
        {
          // @ts-ignore
          data: {
            content: note.content,
            item: props.itemId
          },
          noteId: props.selectedNote._id + "",
        },
        {
          onSuccess: (r) => {
            message.open({
              type: "success",
              content: "Note Updated",
            });
            form.resetFields();
            props.onFinish && props.onFinish(r);
          },
        }
      );
    } else {
      createNote(
        {
          itemId: props.itemId,
          data: note,
        },
        {
          onSuccess: (r) => {
            message.open({
              type: "success",
              content: isVideo ? `Note Created at ${formatSeconds(note.time)}` : 'Note Created Successfully',
            });
            form.resetFields();
            props.onFinish && props.onFinish(r);
          },
        }
      );
    }

    console.log(note, "daa");
  };
  const [form] = Form.useForm();
  const isPlaying = !isNaN(currentTime);
  useEffect(() => {
    form.setFieldsValue(props.selectedNote);
  }, [props.selectedNote]);
  const noteContent = Form.useWatch("content", form);
  const isVideo = item?.type === 'video';
  return (
    <Form layout="vertical" onFinish={onSave} form={form}>
      <Row justify="start">
        <Col flex={1}>
          <Row style={{ marginTop: 15, marginBottom: 15 }}>
            <Col span={24}>
              <Form.Item
                required
                label={
                  <Text strong disabled={!isPlaying}>
                    {props.selectedNote ? "Update Note at" : (isVideo ? "Create a note at" : "Create a note")}{" "}
                    {(isVideo && isPlaying) ? <Tag color="cyan">{time}</Tag> : null}
                  </Text>
                }
                name="content"
              >
                <TextArea
                  required
                  onFocus={() => playerInstance?.pause()}
                  height={100}
                />
              </Form.Item>
            </Col>
            <Col
              span={24}
              style={{ display: "flex", flexDirection: "row-reverse" }}
            >
              <Row gutter={[10, 10]}>
                {(props.selectedNote) ? <Col>
                  <Button
                    // style={{ marginRight: 15 }}
                    onClick={() => {
                      form.resetFields();
                      props.onFinish && props.onFinish();
                    }}
                  >
                    Cancel
                  </Button>
                </Col> : null}
                <Col>{props.selectedNote ? (
                  <Button
                    disabled={!noteContent || !isPlaying}
                    loading={updatingNote} type="primary" onClick={form.submit}>
                    Update Note
                  </Button>
                ) : (
                  <Button
                    loading={savingNote}
                    disabled={!noteContent || !isPlaying}
                    type="primary"
                    onClick={form.submit}
                  >
                    Save Note
                  </Button>
                )}</Col>
              </Row>
              {/* {props.selectedNote ? (
                <Button
                  style={{ marginRight: 15 }}
                  onClick={() => {
                    form.resetFields();
                    props.onFinish && props.onFinish();
                  }}
                >
                  Cancel
                </Button>
              ) : null} */}
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};

export default CreateNote;
