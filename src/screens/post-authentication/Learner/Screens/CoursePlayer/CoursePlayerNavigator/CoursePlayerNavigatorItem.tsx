import {
  Badge,
  Button,
  Checkbox,
  Col,
  Dropdown,
  List,
  Row,
  Space,
  Tag,
  Tooltip,
} from "@Lib/index";
import { Learner, Utils } from "@adewaskar/lms-common";
import { Unit, unit } from "mathjs";

import CourseItemIcon from "@User/Screens/Courses/CourseEditor/CourseBuilder/CourseSectionsNavigator/CourseItemIcon";
import { DownloadOutlined, PaperClipOutlined } from "@ant-design/icons";
import { NavLink, useParams } from "@Router/index";
import { Types } from "@adewaskar/lms-common";
import { Typography } from "@Components/Typography";
import { downloadFile } from "@User/Screens/Courses/CourseEditor/CourseBuilder/utils";
import styled from "@emotion/styled";

const { Text } = Typography;
interface CoursePlayerNavigatorItemPropsI {
  item: Types.CourseSectionItem;
  courseId: string;
  language: string;
  section: Types.CourseSection;
  itemIndex: number;
  toggleItemCheck: (itemID: string, value: boolean) => void;
}

const CourseListItem = styled(List.Item)(
  ({ isActive }: { isActive: boolean }) => {
    return `
   border-bottom: 1px solid #f0f0f0 !important;
  h4 {
    margin-top: 0;
  }
  background: ${isActive ? "#e9e9e9" : "auto"};
`;
  }
);

function CoursePlayerNavigatorItem(props: CoursePlayerNavigatorItemPropsI) {
  const { id: courseId } = useParams();
  const { data: {
    metadata: {
      course: {
        highlights
      } = {
        course: {
          highlights: []
        }
      }
    }
  } } = Learner.Queries.useGetEnrolledCourseDetails(courseId + '');
  const itemHighlights = highlights?.filter(i => i.item === props.item._id) || []
  let duration = props.item.metadata?.duration;
  if (!duration) {
    duration = 0;
  }
  const { mutate: updateProgress } = Learner.Queries.useUpdateCourseProgress();
  const Component = <NavLink
    title={props.item.title?.text[props.language]}
    to={`${props.item._id}`}
    children={({ isActive }) => (
      <CourseListItem
        isActive={isActive}
      >
        <List.Item.Meta
          avatar={
            <Checkbox
              defaultChecked={props.item.isCompleted}
              onChange={(e) => {
                e.stopPropagation();
                updateProgress({
                  courseId: props.courseId || "",
                  sectionId: props.section._id,
                  action: e.target.checked ? "ADD" : "REMOVE",
                  itemId: props.item._id,
                  data: null,
                });
                props.toggleItemCheck(props.item._id, !!e.target.checked);
              }}
            />
          }
          title={
            <Text ellipsis>
              {props.itemIndex}. {props.item.title?.text[props.language]}
            </Text>
          }
          description={
            <>
              {(props.item.type === "video" ||
                props.item.type === "text" ||
                props.item.type === "pdf") &&
                duration ? (
                <Row
                  justify={"space-between"}
                  style={{
                    marginTop: 10,
                  }}
                // direction="horizontal"
                // align="center"
                >
                  <Col>
                    <CourseItemDurationTag item={props.item} />
                  </Col>

                  <Col>
                    {props.item.files.length ? (
                      <Dropdown.Button
                        size="small"
                        menu={{
                          items: props.item.files.map((file, index) => {
                            return {
                              key: index,
                              label: (
                                <a
                                  onClick={() => downloadFile(file.file + "")}
                                  type="primary"
                                  target="_blank"
                                  href={file.file}
                                  rel="noreferrer"
                                >
                                  {file.name} <DownloadOutlined />
                                </a>
                              ),
                            };
                          }),
                        }}
                        placement="bottomRight"
                      >
                        Files
                      </Dropdown.Button>
                    ) : null}
                  </Col>
                </Row>
              ) : null}
            </>
          }
        />
      </CourseListItem>
    )}
  />
  if (itemHighlights.length > 0) {
    return <Tooltip placement='bottomRight' title={`${itemHighlights.length} Highlights`}>
      <Badge.Ribbon text={<><PaperClipOutlined /> {itemHighlights.length}</>}>
        {Component}
      </Badge.Ribbon>
    </Tooltip>
  }
  return (
    Component
  );
}

export default CoursePlayerNavigatorItem;


export const CourseItemDurationTag = (props: { item: Types.CourseSectionItem }) => {
  const minDuration = Math.ceil(props.item.metadata?.duration);
  return <Tag
    icon={
      <CourseItemIcon type="outlined" item={props.item} />
    }
    style={{ marginRight: 0 }}
    color="blue-inverse"
  >
    {minDuration < 60
      ? minDuration
      : Utils.formatSeconds(minDuration)}{" "}
    min
  </Tag>
}