import { Avatar, Button, Empty, List, Modal, Typography } from "antd";
import { Learner, Store, User } from "@adewaskar/lms-common";

import CardItem from "./types/CardItem";
import ListItem from "./types/ListItem";

interface FileListPropsI {
  type?: string;
  horizontal?: boolean;
  files: { name: string; file: string; url?: string }[];
  onDeleteFile?: (s: string) => void;
  style?: any;
  uploadFileInput?: any;
}

function FileList(props: FileListPropsI) {
  const userType = Store.useAuthentication((s) => s.userType);
  let ListItemComponent = ListItem;
  if (props.type === "card") {
    ListItemComponent = CardItem;
  }
  const itemLayout = props.horizontal ? "horizontal" : "vertical";
  return props?.files?.length ? (
    <>
      <List
        itemLayout={itemLayout}
        dataSource={props.files}
        grid={{
          gutter: 20,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 3,
          xxl: 3,
        }}
        size="small"
        style={props.style || {}}
        renderItem={(file, index) => {
          return (
            <ListItemComponent
              useGetFileDetails={
                userType === "learner"
                  ? Learner.Queries.useGetFileDetails
                  : User.Queries.useGetFileDetails
              }
              onDeleteFile={(d: string) => {
                props.onDeleteFile && props.onDeleteFile(d);
              }}
              file={file}
            />
          );
        }}
      />
    </>
  ) : (
    <Empty description="No Files added"></Empty>
  );
}

export default FileList;
