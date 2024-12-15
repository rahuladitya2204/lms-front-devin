import {
    Avatar,
    Button,
    Card,
    Col,
    Modal,
    Rate,
    Row,
    Space,
    Tag,
    message,
} from "antd";
import {
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import { Enum, Learner, Types, Constants } from "@adewaskar/lms-common";
import Table, { TableColumn } from "@Components/Table/TableComponent";

import MoreButton from "@Components/MoreButton";
import { User } from "@adewaskar/lms-common";
import dayjs from "dayjs";
import useMessage from "@Hooks/useMessage";
import { useModal } from "@Components/ActionModal/ModalContext";
import { sortBy } from "lodash";
import AddText from "./AddText";

const confirm = Modal.confirm;

function TextsTable() {
    const { data, isLoading: loading } = User.Queries.useGetTexts();
    const { mutate: deleteText, isLoading: deletingText } =
        User.Queries.useDeleteText();
    const { openModal } = useModal();
    return (
        <Table
            searchFields={["key", ...(Constants.LANGUAGES.map(l => `text.${l.value}`))]}
            dataSource={sortBy(data, ["-lastActive"])}
            loading={loading || deletingText}
        >
            <TableColumn
                title="Key"
                render={(_: any, record: Types.Text) => record.key || "-"}
                dataIndex="key"
                key="key"
            />
            <TableColumn
                title="Text"
                render={(_: any, record: Types.Text) => {
                    return <ul>
                        {Constants.LANGUAGES.filter(l => record.text[l.value]).map(lang => {
                            return <li>{record.text[lang.value]}<strong>({lang.label})</strong></li>
                        })}
                    </ul>
                }}
                dataIndex="langText"
                key="langText"
            />
            <TableColumn
                title="Action"
                key="action"
                render={(_: any, record: Types.Text) => (
                    <MoreButton
                        items={[
                            {
                                label: "Edit Text",
                                icon: <EditOutlined />,
                                key: "edit-learner",
                                onClick: () => {
                                    openModal(<AddText data={record} />);
                                },
                            },
                            {
                                label: "Remove Text",
                                key: "remove",
                                icon: <DeleteOutlined />,
                                onClick: () => {
                                    confirm({
                                        title: `Are you sure?`,
                                        // icon: <ExclamationCircleOutlined />,
                                        content: `You want to remove ${record.key}`,
                                        onOk() {
                                            deleteText({ id: record._id }, {
                                                onSuccess: () => {
                                                    message.open({
                                                        type: "success",
                                                        content: "Text deleted successfully",
                                                    });
                                                },
                                            });
                                        },
                                        okText: "Delete Text",
                                    });
                                },
                            },
                        ]}
                    />
                )}
            />
        </Table>
    );
}

export default TextsTable;

