import {
  Button,
  Card,
  Collapse,
  Dropdown,
  Input,
  List,
  Modal,
  Space,
  Tooltip,
} from "@Lib/index";
import { DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { Fragment, useCallback, useEffect, useState } from "react";

import ActionModal from "@Components/ActionModal/ActionModal";
import AddItem from "../AddItem";

import CourseItemIcon from "./CourseItemIcon";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import MoreButton from "@Components/MoreButton";
import { MovableItem } from "@Components/DragAndDrop/MovableItem";
import { NavLink, useNavigate, useParams } from "@Router/index";
import { Types, User } from "@adewaskar/lms-common";
import { Typography } from "@Components/Typography";
import { cloneDeep } from "lodash";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { useModal } from "@Components/ActionModal/ModalContext";
import { useCourseStore } from "../useCourseStore";

import AddSection from "../CreateNewItem/AddSection";

const { confirm } = Modal;
const { Title, Text } = Typography;

const CollapsePanel = styled(Collapse.Panel)`
  .ant-collapse-header-text {
    width: 85%;
  }
`;

const AddChapterButton = styled(Button)`
  /* margin-top: 10px; */
  /* margin-bottom: 10px; */
`;

const CustomCollapse = styled(Collapse)(
  (props: { enableSectionReorder: boolean }) => `
    // margin-top: 10px;
  .ant-collapse-content-box {
    padding: 0 !important;
  }

  .ant-list-item-meta-title {
    margin-top: 0;
  }

  .ant-list-footer {
    padding-bottom: 0;
  }

  .ant-space {
    display: flex;
    gap: 8px;
    justify-content: space-around;
  }

  .ant-list-item {
    span{
      width: 100% !important;
    }
  }
}
`
);

const CourseListItem = styled(List.Item)`
  .ant-list-item {
    padding: 15px !important;
    span {
      width: 100% !important;
    }
  }
  .delete-icon {
    visibility: hidden;
  }
  &:hover {
    .delete-icon {
      visibility: visible;
    }
  }
  background: ${(props: { isActive: boolean }) =>
    props.isActive ? "#e3e3e3" : "auto"};
`;
interface CourseSectionsNavigatorPropsI {
  sections: Types.CourseSection[];
  onAddSection: Function;
  deleteSection: (sId: string) => void;
  onReorderSections: (s: Types.CourseSection[]) => void;
  // language: string;
  deleteSectionItem: (secId: string, itemID: string) => void;
  onAddNewItem: (
    type: string,
    item: Partial<Types.CourseSectionItem>,
    index: number
  ) => void;
}

const CourseSectionsNavigator: React.FC<CourseSectionsNavigatorPropsI> = ({
  onAddNewItem,
  deleteSection,
  onAddSection,
  onReorderSections,
}) => {
  const { sections } = useCourseStore(s => s.course)
  const [enableSectionReorder, setEnableSectionReorder] = useState(true);
  const [itemRearrengeIndex, setItemRearrengeIndex] = useState<number | null>(
    null
  );
  const { id: courseId } = useParams();
  const language = useCourseStore((s) => s.language);
  const [sectionList, setSectionList] =
    useState<Types.CourseSection[]>(sections);
  useEffect(() => {
    setSectionList(sections);
  }, [sections]);
  const navigate = useNavigate();
  const { course, setCourse } = useCourseStore((s) => s);
  const { mutate: deleteSectionItemApi, isLoading: deletingSectionItem } =
    User.Queries.useDeleteCourseSectionItem();
  const deleteSectionItem = (itemId: string) => {
    deleteSectionItemApi(
      {
        data: {
          courseId: courseId + "",
          itemId: itemId,
        },
      },
      {
        onSuccess: () => {
          const lastSection = course.sections.pop();
          const lastItem = lastSection?.items.pop();
          if (lastSection && lastItem)
            navigate(`/admin/products/courses/${courseId}/builder/${lastItem.type}/${lastItem._id}`);
        },
      }
    );
  };

  const DeleteSection = (sectionId: string) => {
    confirm({
      title: "Are you sure?",
      content: `You want to delete this section`,
      onOk() {
        deleteSection(sectionId);
      },
      okText: "Delete",
    });
  };

  const moveSection = useCallback((dragIndex: number, hoverIndex: number) => {
    setSectionList((prevCards) => {
      const prevSections = cloneDeep(prevCards);
      const sections = update(prevSections, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevSections[dragIndex]],
        ],
      });
      onReorderSections(sections);
      return sections;
    });
  }, []);

  const moveCourseItem = useCallback(
    (
      dragIndex: number,
      hoverIndex: number,
      sectonId: string,
      itemId: string
    ) => {
      const SList = [...sectionList];
      SList.forEach((section) => {
        if (section._id === sectonId) {
          section.items = update(section.items, {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, section.items[dragIndex]],
            ],
          });
        }
      });
      setSectionList(SList);
    },
    []
  );

  const { openModal } = useModal();

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <DndProvider backend={HTML5Backend}>
        {sectionList.map((section, secIndex) => {
          const AddItemCTA = (
            <span
              onClick={() => {
                openModal(
                  <AddItem
                    onAddNewItem={(key, value) =>
                      onAddNewItem(key, value, secIndex)
                    }
                  />
                );
              }}
            >
              Add Chapter Item
            </span>
          );
          const SectionOptionDropdown = (
            <MoreButton
              items={[
                {
                  label: AddItemCTA,
                  key: "add",
                },
                {
                  label: `Edit Section`,
                  onClick: () =>
                    openModal(
                      <AddSection
                        data={section}
                        onFinish={(e: { title: string }) =>
                          onAddSection({ ...section, ...e })
                        }
                      />
                    ),
                  key: "edit-section",
                },
                {
                  label: 'Delete Section',
                  onClick: () => DeleteSection(section._id),
                  key: "delete",
                },
              ]}
            />
          );
          return (
            <div style={{ marginBottom: 20 }}>
              <MovableItem
                disabled={!enableSectionReorder}
                key={section._id}
                index={secIndex}
                moveItem={moveSection}
                id={section._id}
              >
                <CustomCollapse
                  collapsible="header"
                  bordered
                  enableSectionReorder={!enableSectionReorder}
                  defaultActiveKey={sectionList.map((s, i) => i)}
                  expandIconPosition="start"
                // ghost
                >
                  {/* {language} */}
                  <CollapsePanel
                    extra={SectionOptionDropdown}
                    key={secIndex}
                    header={
                      section.title.text ? section.title.text[language] : ""
                    }
                  >
                    <List
                      itemLayout="horizontal"
                      style={{ marginBottom: 20 }}
                      size="small"
                      dataSource={section.items}
                      renderItem={(item, itemIndex) => {
                        // This propagation is being stopped to prevent dropdown also making list item clickable
                        const SectionItemOptionDropdown = (
                          <MoreButton
                            items={[
                              {
                                label: 'Delete Chapter Item',
                                onClick: () => {
                                  Modal.confirm({
                                    closable: false,
                                    title: `Are you sure?`,
                                    // icon: <ExclamationCircleOutlined />,
                                    content: `You want to delete this Chapter Item?`,
                                    // footer: [

                                    // ],
                                    onOk() {
                                      deleteSectionItem(
                                        item._id
                                      )
                                    },
                                    okText: "Yes, Delete",
                                  });
                                },
                                key: "delete",
                                icon: <DeleteOutlined />,
                              },
                            ]}
                          />
                        );
                        const CourseSectionListItem = (isActive: boolean) => (
                          <CourseListItem
                            isActive={isActive}
                            actions={[SectionItemOptionDropdown]}
                          >
                            <List.Item.Meta
                              style={{ cursor: "pointer" }}
                              title={
                                <Text>
                                  {item.title.text
                                    ? item.title.text[language]
                                    : ""}
                                </Text>
                              }
                              avatar={
                                <CourseItemIcon type="outlined" item={item} />
                              }
                            />
                          </CourseListItem>
                        );
                        return (
                          <Fragment>
                            <MovableItem
                              disabled={!(itemRearrengeIndex === secIndex)}
                              key={item._id}
                              index={itemIndex}
                              moveItem={(dragIndex, hoverIndex) =>
                                moveCourseItem(
                                  dragIndex,
                                  hoverIndex,
                                  section._id,
                                  item._id
                                )
                              }
                              id={item._id}
                            >
                              <List.Item style={{ padding: 0 }}>
                                {
                                  item.type ? (
                                    <NavLink
                                      title={item.title}
                                      style={{ width: "100%" }}
                                      key={item._id}
                                      to={`${item.type}/${item._id}?course-builder=${language}`}
                                      children={({ isActive }) =>
                                        CourseSectionListItem(isActive)
                                      }
                                    />
                                  ) : (
                                    <span
                                      onClick={() => {
                                        openModal(
                                          <AddItem
                                            item={item}
                                            onAddNewItem={(key, value) =>
                                              onAddNewItem(key, value, secIndex)
                                            }
                                          />,
                                          {
                                            width: 650,
                                          }
                                        );
                                      }}
                                    >
                                      {CourseSectionListItem(false)}
                                    </span>
                                  )
                                }
                              </List.Item>
                            </MovableItem>
                          </Fragment>
                        );
                      }}
                    />
                  </CollapsePanel>
                </CustomCollapse>
              </MovableItem>
            </div>
          );
        })}
      </DndProvider>

      {/* @ts-ignore */}
      <ActionModal
        cta={
          <AddChapterButton block type="primary">
            Add New Section
          </AddChapterButton>
        }
      >
        <AddSection onFinish={(e) => onAddSection(e)} />
      </ActionModal>
    </Space>
  );
};

export default CourseSectionsNavigator;
