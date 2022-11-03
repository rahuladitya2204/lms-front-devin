import { CourseTreeTypeNode } from '../../../../types/Common.types'
import { DataNode } from 'antd/lib/tree'
import { cloneDeep } from 'lodash';
import { v4 as uuid } from 'uuid';

export const findNode = (
  id: string,
  TREE: CourseTreeTypeNode[]
): CourseTreeTypeNode => {
  let node: CourseTreeTypeNode
  TREE.forEach(item => {
    if (item.id === id) {
      node = item
    }
    item.children.forEach(i => {
      if (i.id === id) {
        node = i
      }
    })
  })
  // @ts-ignore
  return node
}

export const convertToDataNode = (tree: CourseTreeTypeNode[]): DataNode[] => {
  return tree.map(item => {
    const key = {
      id: item.id,
      data: item.data,
      type: item.type
    }
    const children = item.children.map(i => {
      const childKey = {
        id: i.id,
        data: i.data,
        type: i.type
      }
      return {
        title: i.title,
        key: JSON.stringify(childKey),
        isLeaf: true
      }
    });
    children.shift();
    return {
      title: item.title,
      key: JSON.stringify(key),
      children: children
    }
  })
}

export const convertFromDataNode = (tree: DataNode[]): CourseTreeTypeNode[] => {
  return tree.map(item => {
    const ParsedKey = JSON.parse(item.key + '')
    const children = item.children
      ? item.children?.map(i => {
        const ChildParsedKey = JSON.parse(i.key + '')
        return {
          title: item.title + '',
          id: ChildParsedKey.id,
          type: ChildParsedKey.type,
          data: ChildParsedKey.data,
          children: []
        }
      })
      : [];
    
      // @ts-ignore
    children.unshift(createChapterItemNode());
    return {
      title: item.title + '',
      id: ParsedKey.id,
      type: ParsedKey.type,
      data: ParsedKey.data,
      children: children
    }
  })
}

export const updateCourseTreeNode = (
  tree: CourseTreeTypeNode[],
  node: CourseTreeTypeNode
) => {
  const TREE = cloneDeep(tree)
  TREE.forEach((item, index) => {
    if (item.id === node.id) {
      TREE[index] = node;
    }
    item.children.forEach((i, childIndex) => {
      if (i.id === node.id) {
        item.children[childIndex] = node
      }
    })
  })
  return TREE
}

export const createChapterItemNode = (): CourseTreeTypeNode => {
  return {
    title: '+ Add Chapter Item',
    id: uuid(),
    type: 'item',
    data: null,
    children: []
  }
}
