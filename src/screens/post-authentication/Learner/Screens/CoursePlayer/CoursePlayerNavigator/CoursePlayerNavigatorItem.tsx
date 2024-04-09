import { Button, Checkbox, Col, Dropdown, List, Row, Space, Tag } from "antd";
import { Learner, Utils } from "@adewaskar/lms-common";
import { Unit, unit } from "mathjs";

import CourseItemIcon from "@User/Screens/Courses/CourseEditor/CourseBuilder/CourseSectionsNavigator/CourseItemIcon";
import { DownloadOutlined } from "@ant-design/icons";
import { NavLink } from "@Router/index";
import { Types } from "@adewaskar/lms-common";
import { Typography } from "@Components/Typography";
import { downloadFile } from "@User/Screens/Courses/CourseEditor/CourseBuilder/utils";
import styled from "@emotion/styled";

const { Text } = Typography;
interface CoursePlayerNavigatorItemPropsI {
  item: Types.CourseSectionItem;
  courseId: string;
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
  let duration = props.item.metadata?.duration;
  if (!duration) {
    duration = 0;
  }
  let durationInMin = unit(duration, "seconds").to("minute").toJSON();
  const { mutate: updateProgress } = Learner.Queries.useUpdateCourseProgress();
  const minDuration = Math.ceil(durationInMin.value);
  return (
    <NavLink
      to={`${props.item._id}`}
      children={({ isActive }) => (
        <CourseListItem
          // extra={[
          //   // props.item.type === 'video' && durationInMin ? (
          //   //   <Tag color="blue">{durationInMin.value} min</Tag>
          //   // ) : null,

          // ]}
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
                {props.itemIndex}. {props.item.title}
              </Text>
            }
            description={
              <>
                {(props.item.type === "video" ||
                  props.item.type === "text" ||
                  props.item.type === "pdf") &&
                durationInMin ? (
                  <Row
                    justify={"space-between"}
                    style={{
                      marginTop: 10,
                    }}
                    // direction="horizontal"
                    // align="center"
                  >
                    <Col>
                      <Tag
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
  );
}

export default CoursePlayerNavigatorItem;
