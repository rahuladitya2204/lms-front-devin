import { CourseSectionItem } from '../../../../../types/Common.types'
import { DataNode } from 'antd/lib/tree'
import { cloneDeep } from 'lodash';
import { v4 as uuid } from 'uuid';

export const findNode = (
  id: string,
  TREE: CourseSectionItem[]
): CourseSectionItem => {
  let node: CourseSectionItem
  TREE.forEach(item => {
    if (item.id === id) {
      node = item
    }
    item.items.forEach(i => {
      if (i.id === id) {
        node = i
      }
    })
  })
  // @ts-ignore
  return node
}



export const updateCourseTreeNode = (
  tree: CourseSectionItem[],
  node: CourseSectionItem
) => {
  const TREE = cloneDeep(tree)
  TREE.forEach((item, index) => {
    if (item.id === node.id) {
      TREE[index] = node;
    }
    item.items.forEach((i, childIndex) => {
      if (i.id === node.id) {
        item.items[childIndex] = node
      }
    })
  })
  return TREE
}

export const createChapterItemNode = (): CourseSectionItem => {
  return {
    title: '+ Add Chapter Item',
    id: uuid(),
    type: 'item',
    data: null,
    items: []
  }
}
