import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist/legacy/build/pdf'

import Hls from 'hls.js'
import { Types } from '@adewaskar/lms-common'
import { cloneDeep } from 'lodash'

GlobalWorkerOptions.workerSrc = new URL(
  '/pdf.worker.min.js',
  window.location.origin
).href

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

// @ts-nocheck

const wordsPerMinute = 200 // Adjust this value based on your preference

async function getPDFText(fileObject: any) {
  const pdfDoc = await getDocument(fileObject).promise
  const totalPages = pdfDoc.numPages
  let fullText = ''

  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
    const page = await pdfDoc.getPage(pageNumber)
    const content = await page.getTextContent()
    const text = content.items.map((item: any) => item.str).join(' ')
    fullText += text
  }

  return fullText
}

async function fileToArrayBuffer(fileObject: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
    reader.readAsArrayBuffer(fileObject)
  })
}

export async function getPDFReadingTime(fileObject: File) {
  const arrayBuffer = await fileToArrayBuffer(fileObject)
  const text = await getPDFText({ data: arrayBuffer })
  const words = text.split(/\s+/).length
  const readingTimeInSeconds = words / wordsPerMinute * 60

  return readingTimeInSeconds
}

export const getVideoThumbnails = async (
  videoSource: string,
  numberOfThumbnails = 3
) => {
  const video = document.createElement('video')
  const canvas = document.createElement('canvas')

  const loadVideoMetadata = () =>
    new Promise(resolve => {
      video.addEventListener('loadedmetadata', resolve, { once: true })
    })

  const loadVideoFrame = () =>
    new Promise(resolve => {
      video.addEventListener('seeked', resolve, { once: true })
    })

  const captureFrame = async (time: number) => {
    video.currentTime = time
    await loadVideoFrame()

    const ctx: any = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)

    return new Promise(resolve => {
      canvas.toBlob(blob => resolve(blob), 'image/png')
    })
  }

  let videoUrl

  if (typeof videoSource === 'string') {
    videoUrl = videoSource
  } else {
    videoUrl = URL.createObjectURL(videoSource)
  }

  if (Hls.isSupported() && videoUrl.endsWith('.m3u8')) {
    const hls = new Hls()
    hls.loadSource(videoUrl)
    hls.attachMedia(video)
    await new Promise(resolve => {
      hls.on(Hls.Events.MANIFEST_PARSED, resolve)
    })
  } else {
    video.src = videoUrl
  }

  await loadVideoMetadata()

  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  const videoDuration = video.duration
  const divisionInterval = videoDuration / (numberOfThumbnails + 1)
  const captureTimes = Array.from(
    { length: numberOfThumbnails },
    (_, i) => (i + 1) * divisionInterval
  )

  const thumbnailBlobs = []

  for (const time of captureTimes) {
    const thumbnailBlob = await captureFrame(time)
    thumbnailBlobs.push(thumbnailBlob)
  }

  if (typeof videoSource !== 'string') {
    URL.revokeObjectURL(videoUrl)
  }

  return thumbnailBlobs
}
