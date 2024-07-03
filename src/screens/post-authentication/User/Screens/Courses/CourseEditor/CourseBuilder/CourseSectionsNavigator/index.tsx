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
import AddSection from "../CreateNewItem/AddSection";
import CourseItemIcon from "./CourseItemIcon";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import MoreButton from "@Components/MoreButton";
import { MovableItem } from "@Components/DragAndDrop/MovableItem";
import { NavLink } from "@Router/index";
import { Types } from "@adewaskar/lms-common";
import { Typography } from "@Components/Typography";
import { cloneDeep } from "lodash";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { useModal } from "@Components/ActionModal/ModalContext";

const { confirm } = Modal;
const { Title, Text } = Typography;

const CollapsePanel = styled(Collapse.Panel)`
  .ant-collapse-header-text {
    width: 85%;
  }
`;

const AddItemListCta = styled(List.Item)`
  .ant-list-item {
    border-top: 1px solid #dbd9d9;
    border-bottom: 1px solid #dbd9d9;
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
  language: string;
  deleteSectionItem: (secId: string, itemID: string) => void;
  onAddNewItem: (
    type: string,
    item: Partial<Types.CourseSectionItem>,
    index: number
  ) => void;
}

const CourseSectionsNavigator: React.FC<CourseSectionsNavigatorPropsI> = ({
  sections,
  onAddNewItem,
  language,
  deleteSection,
  onAddSection,
  deleteSectionItem,
  onReorderSections,
}) => {
  const [secEditable, setSecEditable] = useState({});
  const [enableSectionReorder, setEnableSectionReorder] = useState(true);
  const [itemRearrengeIndex, setItemRearrengeIndex] = useState<number | null>(
    null
  );
  const [sectionList, setSectionList] =
    useState<Types.CourseSection[]>(sections);
  useEffect(() => {
    setSectionList(sections);
  }, [sections]);
  const DeleteSectionItem = (sectionId: string, itemId: string) => {
    confirm({
      title: "Are you sure?",
      content: `You want to delete this section item`,
      onOk() {
        deleteSectionItem(sectionId, itemId);
      },
      okText: "Delete",
    });
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
                  label: (
                    <ActionModal cta={`Rename`}>
                      {/* @ts-ignore */}
                      <AddSection
                        data={section}
                        onFinish={(e: { title: string }) =>
                          onAddSection({ ...section, ...e })
                        }
                      />
                    </ActionModal>
                  ),
                  key: "rename",
                },
                {
                  label: (
                    <span onClick={() => DeleteSection(section._id)}>
                      Delete Section
                    </span>
                  ),
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
                  <CollapsePanel
                    extra={SectionOptionDropdown}
                    key={secIndex}
                    header={
                      section?.title?.text ? section?.title?.text[language] : ""
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
                          <span onClick={(e) => e.stopPropagation()}>
                            <MoreButton
                              items={[
                                {
                                  label: (
                                    <span
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        DeleteSectionItem(
                                          section._id,
                                          item._id
                                        );
                                      }}
                                    >
                                      Delete Chapter Item
                                    </span>
                                  ),
                                  key: "delete",
                                  icon: <DeleteOutlined />,
                                },
                              ]}
                            />
                          </span>
                        );
                        const CourseSectionListItem = (isActive: boolean) => (
                          <CourseListItem
                            isActive={isActive}
                            actions={[SectionItemOptionDropdown]}
                          >
                            <List.Item.Meta
                              style={{ cursor: "pointer" }}
                              title={<Text>{item.title}</Text>}
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
                                      to={`${item.type}/${item._id}`}
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
                                  //     < ActionModal width={650}
                                  //   cta={
                                  //     CourseSectionListItem(false)
                                  //   }
                                  // >
                                  // <AddItem item={item}
                                  //   onAddNewItem={(key, value) =>
                                  //     onAddNewItem(key, value, secIndex)
                                  //   }
                                  // />
                                  //   </ActionModal>
                                }
                              </List.Item>
                            </MovableItem>

                            {itemIndex === section.items.length - 1 ? (
                              <ActionModal
                                cta={
                                  <AddItemListCta>
                                    <List.Item.Meta
                                      style={{ cursor: "pointer" }}
                                      title={AddItemCTA}
                                      avatar={<PlusOutlined />}
                                    />
                                  </AddItemListCta>
                                }
                              >
                                <AddItem
                                  onAddNewItem={(key, value) =>
                                    onAddNewItem(key, value, secIndex)
                                  }
                                />
                              </ActionModal>
                            ) : null}
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
