import { cloneDeep } from 'lodash'
import { v4 as uuid } from 'uuid'
import { CourseSection, CourseSectionItem } from '@Types/Courses.types'

export const findSectionItem = (
  itemId: string,
  sectionId: string,
  sections: CourseSection[]
): CourseSectionItem => {
  let node: CourseSectionItem
  sections.forEach(section => {
    if (section.id === sectionId) {
      section.items.forEach(item => {
        if (item.id == itemId) {
          node = item
        }
      })
    }
  })
  // @ts-ignore
  return node
}

export const updateCourseSectionItem = (
  sections: CourseSection[],
  sectionId: string,
  item: CourseSectionItem
) => {
  const SECTIONS = cloneDeep(sections)
  SECTIONS.forEach((section) => {
    if (section.id === sectionId) {
      section.items.forEach((secItem, itemIndex) => {
        if (secItem.id === item.id) {
          section.items[itemIndex] = {
            ...secItem,
            ...item
          }
        }
      })
    }
  })
  return SECTIONS
}

export const createChapterItemNode = (): CourseSectionItem => {
  return {
    title: '+ Add Chapter Item',
    id: uuid(),
    type: 'item'
  }
}
