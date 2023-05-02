import {  Avatar, Button, Empty, List, Modal,Typography } from 'antd'
import ListItem from './types/ListItem';
import CardItem from './types/CardItem';


interface FileListPropsI {
    type?: string;
    horizontal?: boolean;
    files: { name: string, file: string }[];
    onDeleteFile?: (s: string) => void;
    style?: any;
    uploadFileInput?: any;
}

function FileList(props: FileListPropsI) {
    let ListItemComponent = ListItem;
    if(props.type==='card') {
        ListItemComponent = CardItem;
    }
    const itemLayout = props.horizontal ? 'horizontal' : 'vertical';
    return props?.files?.length ? <>
      <List itemLayout={itemLayout}
            dataSource={props.files}
            size="small"
            style={props.style || {}}
      renderItem={(file, index) => {
        return (
            <ListItemComponent onDeleteFile={(d:string) => {
                props.onDeleteFile&&props.onDeleteFile(d)
                  }} file={file} />
        )
      }}
    />
      </> : <Empty description='No Files added'>

    </Empty>
}

export default FileList
