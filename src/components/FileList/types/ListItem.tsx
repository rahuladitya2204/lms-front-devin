import { Button, Empty, List, Modal, Space, Spin } from "antd";
import {
  DeleteOutlined,
  DownloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { Common } from "@adewaskar/lms-common";
import { useState } from "react";
import { downloadFileFromUrl } from "@Components/Editor/SunEditor/utils";

const { confirm } = Modal;

interface FileItemPropsI {
  file: Partial<{ name: string; file: string }>;
  onDeleteFile: (id: string) => void;
  useGetFileDetails: Function;
}

function FileItem({
  file: { name, file: fileId },
  useGetFileDetails,
  onDeleteFile,
}: FileItemPropsI) {
  const [downloadling, setDownloading] = useState(false);
  const { data: file } = useGetFileDetails(fileId + "");
  const { mutate: deleteFile, isLoading: deletingFile } =
    Common.Queries.useDeleteFile();
  // console
  return (
    <List.Item
      actions={[
        <Spin spinning={downloadling}>
          <a key="list-loadmore-edit">
            <DownloadOutlined
              onClick={(e) => {
                setDownloading(true);
                Common.Api.GetPresignedUrlFromFile(file._id).then((url) => {
                  downloadFileFromUrl(url);
                  setDownloading(false);
                });
              }}
            />
          </a>
        </Spin>,
        onDeleteFile ? (
          <a key="list-loadmore-edit">
            <DeleteOutlined
              onClick={(e) => {
                confirm({
                  title: "Are you sure?",
                  // icon: <ExclamationCircleOutlined />,
                  content: `You want to delete this file`,
                  onOk() {
                    deleteFile(
                      { id: fileId + "" },
                      {
                        onSuccess: () => {
                          onDeleteFile(fileId + "");
                        },
                      }
                    );
                  },
                  okText: "Delete File",
                });
              }}
            />
          </a>
        ) : null,
      ]}
    >
      {file.name}
    </List.Item>
  );
}

export default FileItem;
