import { BookOutlined, FilePdfOutlined } from '@ant-design/icons';
import type { DataNode, TreeProps } from 'antd/es/tree';
import React, { useState } from 'react';

import AddItem from '../AddItem';
import { Button } from 'antd';
import styled from '@emotion/styled';

interface CourseBuilderTreeNodePropsI {
    data: DataNode;
    onAddNewItem: (type: string, value: string,key:string) => void;
}

const Node = styled.span`

`

const CourseBuilderTreeNode: React.FC<CourseBuilderTreeNodePropsI> = (props) => {
    console.log(props,'12312')
    let icon;
    const type = ('' + props.data.key).split('_')[0];
    let title:string | React.ReactNode = `${props.data.title}`;
    switch (type)
    {
        case 'chapter':
            icon = <BookOutlined />;
            break;
        case 'pdf':
            icon = <FilePdfOutlined />;
            break;
        case 'item':
            title = <AddItem onAddNewItem={(key,value)=>props.onAddNewItem(key,value,props.data.key+'')}> {title}</AddItem>
            // icon = <Button type="dashed">Add Chapter Item</Button>;

                break;
    }
  return (
      <Node>{icon} {title}</Node>
  );
};

export default CourseBuilderTreeNode;