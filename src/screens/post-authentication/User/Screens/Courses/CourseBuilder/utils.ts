import { Types } from '@adewaskar/lms-common'
import { cloneDeep } from 'lodash'

export const findSectionItem = (
  itemId: string,
  sectionId: string,
  sections: Types.CourseSection[]
): Types.CourseSectionItem => {
  let node: Types.CourseSectionItem
  sections.forEach(section => {
    if (section._id === sectionId) {
      section.items.forEach(item => {
        if (item._id == itemId) {
          node = item
        }
      })
    }
  })
  // @ts-ignore
  return node
}

export const updateCourseSectionItem = (
  sections: Types.CourseSection[],
  sectionId: string,
  item: Types.CourseSectionItem
) => {
  const SECTIONS = cloneDeep(sections)
  SECTIONS.forEach(section => {
    if (section._id === sectionId) {
      section.items.forEach((secItem, itemIndex) => {
        if (secItem._id === item._id) {
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

export const STRINGIFY = function(data: unknown) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(data))))
}
export const PARSE = function(str: string) {
  return JSON.parse(decodeURIComponent(atob(str)))
}

export const downloadFile = (filePath: string) => {
  window.open(filePath, 'Download')
}

function isObject(obj: any) {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj)
}

export function deepPatch(target: any, patch: any) {
  const result = JSON.parse(JSON.stringify(target))

  function innerPatch(target: any, patch: any) {
    for (const key in patch) {
      if (isObject(patch[key]) && isObject(target[key])) {
        innerPatch(target[key], patch[key])
      } else {
        target[key] = patch[key]
      }
    }
  }

  innerPatch(result, patch)
  return result
}

export function formatSeconds(s: number) {
  return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s
}

export function htmlToText(html: string) {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

export function getReadingTime(html: string, wordsPerMinute = 200) {
  const text = htmlToText(html)
  const wordCount = text.trim().split(/\s+/).length
  const minutes = wordCount / wordsPerMinute * 60
  return Math.ceil(minutes)
}
