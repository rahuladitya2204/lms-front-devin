import { Avatar, Button, Card, Divider, List, Modal } from "antd";
import { DownloadOutlined, FileTwoTone } from "@ant-design/icons";

import { Common } from "@adewaskar/lms-common";
import { Typography } from "@Components/Typography";
import { unit } from "mathjs";
import FileThumbnail from "../FileThumbnail";
import { downloadFileFromUrl } from "@Components/Editor/SunEditor/utils";
import { uniqueId } from "lodash";

const { Text } = Typography;

interface FileItemPropsI {
  file: Partial<{ name: string; file: string; url?: string }>;
  useGetFileDetails: Function;
}

function FileItem({
  file: { name, file: fileId },
  useGetFileDetails,
}: FileItemPropsI) {
  const { data: url } = Common.Queries.useGetPresignedUrlFromFile(fileId + "");
  // const size = Math.ceil(unit(file.size, "byte").to("megabyte").toJSON().value);
  return (
    <List.Item style={{ width: 250 }}>
      <Card
        hoverable
        style={{ width: 240 }}
        cover={<FileThumbnail url={url} />}
      >
        {/* <Card.Meta title="Europe Street beat" description="www.instagram.com" /> */}

        <Button
          block
          onClick={(e) => {
            const extension = url.split(".").pop();
            downloadFileFromUrl(url, uniqueId() + "." + extension);
          }}
          icon={<DownloadOutlined />}
        >
          Download File
        </Button>
      </Card>
    </List.Item>
  );
}

export default FileItem;
