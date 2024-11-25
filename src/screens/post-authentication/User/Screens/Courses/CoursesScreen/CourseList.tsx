import {
    Badge,
    Button,
    Card,
    Col,
    Empty,
    Form,
    List,
    message,
    Modal,
    Row,
    Select,
    Skeleton,
    Space,
    Switch,
    Tabs,
    Tag,
} from "@Lib/index";
import {
    BarChartOutlined,
    ClockCircleOutlined,
    DeleteOutlined,
    LineChartOutlined,
    PrinterOutlined,
    SettingOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import { Constants, Enum, Types, Utils } from "@adewaskar/lms-common";
import Table, { TableColumn } from "@Components/Table/TableComponent";

import { Fragment, useState } from "react";
import MoreButton from "@Components/MoreButton";
import CourseCard from "./CourseCard";
// import CourseStatusTag from "./CourseStatus";
import { Typography } from "@Components/Typography";
import { User } from "@adewaskar/lms-common";
import dayjs from "dayjs";
import { useModal } from "@Components/ActionModal/ModalContext";
import { NavLink, useNavigate } from "@Router/index";

const { Text } = Typography;

function CoursesList(props) {
    const navigate = useNavigate();
    const { data: categories } = User.Queries.useGetProductCategories("all");
    const { data: users } = User.Queries.useGetUsers();
    const { openModal } = useModal();
    const { data, isFetching: loading } = User.Queries.useGetCourses(
        // props.filter
        props.filter
        // {
        //   // @ts-ignore
        //   enabled: !!props.filter.category
        // }
    );
    // const filteredData=data.filter(pd => {
    //   return !pd.endedAt;
    // })
    const { mutate: publishCourse, isLoading: publishingCourse } =
        User.Queries.usePublishCourse();

    const { mutate: deleteCourse, isLoading: deletingCourse } =
        User.Queries.useDeleteCourse();

    const ITEMS = (course: Types.Course) => {
        const i = [
            {
                label: "Open Course Builder",
                key: "course-builder",
                icon: <SettingOutlined />,
                onClick: () => {
                    window.open(`/admin/products/courses/${course._id}/builder`);
                },
            },
            // {
            //     label: "Show Analysis",
            //     key: "show-analysis",
            //     icon: <LineChartOutlined />,
            //     onClick: () => {
            //         navigate(`/admin/products/course/${course._id}/status`);
            //     },
            // },
            // {
            //     label: "Print Action",
            //     key: "print",
            //     icon: <PrinterOutlined />,
            //     onClick: () => {
            //         openModal(<PrintPrompt courseId={course._id + ""} />, {
            //             title: "Print",
            //         });
            //     },
            // },
            {
                label: "Delete Course",
                key: "delete-course",
                icon: <DeleteOutlined />,
                onClick: () => {
                    Modal.confirm({
                        title: `Are you sure?`,
                        // icon: <ExclamationCircleOutlined />,
                        content: `You want to delete this course`,
                        onOk() {
                            deleteCourse({
                                courseId: course._id + "",
                            }, {
                                onSuccess: () => {
                                    message.success('Course Deleted Successfully')
                                }
                            });
                        },
                        okText: "Yes, Delete",
                    });
                },
            },
        ];
        // if (course._id && course.status !== Enum.CourseStatus.PUBLISHED) {
        //     i.unshift({
        //         label: "Publish Course",
        //         key: "publish-course",
        //         icon: <UploadOutlined />,
        //         onClick: () => {
        //             publishCourse({
        //                 courseId: course._id + "",
        //             });
        //         },
        //     });
        // }
        return i;
    };
    return (
        <Fragment>
            <Fragment>
                <Table
                    searchFields={["title", "slug"]}
                    loading={loading
                        || deletingCourse
                    }
                    dataSource={data}
                >
                    <TableColumn
                        fixed
                        title="Title"
                        dataIndex="title"
                        key="title"
                        render={(_: any, course: Types.Course) => (
                            <NavLink to={`/admin/products/courses/${course._id}/editor`}>
                                {course.title}
                            </NavLink>
                        )}
                    />
                    <TableColumn
                        fixed
                        title="Languages"
                        onFilter={(value, record) =>
                            record.languages.indexOf(value as string) === 0
                        }
                        filters={Constants.LANGUAGES.map((l) => {
                            return {
                                text: l.label,
                                value: l.value,
                            };
                        })}
                        // sorter={(a, b) => a.languages[0] - b.languages[0]}
                        dataIndex="language"
                        key="language"
                        render={(_: any, course: Types.Course) => (
                            <>
                                {course.languages
                                    .map(
                                        (l) =>
                                            Constants.LANGUAGES.find((lg) => lg.value === l)?.label
                                    )
                                    .join(", ")}
                            </>
                        )}
                    />
                    <TableColumn
                        title="Promoted"
                        dataIndex="slug"
                        key="slug"
                        render={(_: any, course: Types.Course) =>
                            course?.promotion?.enabled ? (
                                <Tag color="purple">Promoted</Tag>
                            ) : (
                                "-"
                            )
                        }
                    />
                    <TableColumn
                        // defaultSortOrder={"ascend"}
                        sorter={(a, b) => a.isTopicsAssigned - b.isTopicsAssigned}
                        title="Topics Assigned"
                        dataIndex="topicsAssigned"
                        key="topicsAssigned"
                        fixed
                        // @ts-ignore
                        render={(_: any, course: Types.Course) =>
                            // @ts-ignore
                            course.isTopicsAssigned ? (
                                <Tag color="green">Assigned</Tag>
                            ) : (
                                <Tag color="red">Pending</Tag>
                            )
                        }
                    />
                    <TableColumn
                        title="Last Updated By"
                        dataIndex="updatedBy"
                        key="updatedBy"
                        // @ts-ignore
                        render={(_: any, course: Types.Course) => {
                            const user: Types.User =
                                users.find((c) => c._id == course.updatedBy) ||
                                Constants.INITIAL_USER_DETAILS;
                            if (
                                user?.status === Enum.UserAccountStatus.INACTIVE ||
                                user?.status === Enum.UserAccountStatus.DELETED
                            ) {
                                return `${user.name
                                    } [${Enum.UserAccountStatus.DELETED.toUpperCase()}]`;
                            }
                            return user.name || "-";
                        }}
                    />
                    <TableColumn
                        title="Duration"
                        dataIndex="duration"
                        key="duration"
                        // @ts-ignore
                        render={(_: any, course: Types.Course) =>
                            course.duration.enabled ? (
                                <Tag color="blue-inverse">{course.duration.value} mins</Tag>
                            ) : (
                                "-"
                            )
                        }
                    />
                    <TableColumn
                        title="URL Slug"
                        dataIndex="slug"
                        key="slug"
                        // @ts-ignore
                        render={(_: any, course: Types.Course) => course.slug || "-"}
                    />

                    <TableColumn
                        title="Last Updated"
                        dataIndex="lastUpdated"
                        key="lastUpdated"
                        render={(_: any, course: Types.Course) =>
                            // @ts-ignore
                            dayjs(course.updatedAt).format("LLL")
                        }
                    />
                    {/* <TableColumn
                        title="Status"
                        dataIndex="status"
                        // defaultSortOrder={"ascend"}
                        sorter={(a, b) => a.status - b.status}
                        key="status"
                        onFilter={(value, record) =>
                            record.status.indexOf(value as string) === 0
                        }
                        filters={[
                            {
                                text: Enum.CourseStatus.DRAFT,
                                value: Enum.CourseStatus.DRAFT,
                            },
                            {
                                text: Enum.CourseStatus.PUBLISHED,
                                value: Enum.CourseStatus.PUBLISHED,
                            }
                        ]}
                        // @ts-ignore
                        render={(_: any, course: Types.Course) => <CourseStatusTag course={course} />}
                    /> */}
                    <TableColumn
                        fixed
                        title="Action"
                        key="action"
                        render={(_: any, course: Types.Course, index: number) => (
                            <MoreButton items={ITEMS(course)} />
                        )}
                    />
                </Table>
            </Fragment>
        </Fragment>
    );
}
export default CoursesList;

const SkeletonCard = () => (
    <Card>
        <Skeleton active paragraph />
        <Row justify={"space-between"}>
            <Col>
                <Skeleton.Button style={{ marginTop: 20 }} block />
            </Col>
            <Col>
                <Skeleton.Button style={{ marginTop: 20 }} block />
            </Col>
            <Col>
                <Skeleton.Button style={{ marginTop: 20 }} block />
            </Col>
        </Row>{" "}
    </Card>
);
