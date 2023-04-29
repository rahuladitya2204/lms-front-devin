//@ts-nocheck
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


type CanvasElement = HTMLCanvasElement | OffscreenCanvas;


function captureThumbnail(video: HTMLVideoElement, canvas: CanvasElement, context: CanvasRenderingContext2D, time: number): Promise<void> {
  return new Promise<void>((resolve) => {
    video.currentTime = time;
    video.addEventListener('seeked', () => {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      resolve();
    }, { once: true });
  });
}

// Main function to extract thumbnails
export async function getVideoThumbnails(url: string): Promise<Blob[]> {
  const video = document.createElement('video');
  const canvas = document.createElement('canvas') as CanvasElement;
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  const thumbnails: Blob[] = [];

  const videoReady = new Promise<void>((resolve) => {
    if (Hls.isSupported() && /\.m3u8$/.test(url)) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        resolve();
      });
    } else {
      video.src = url;
      video.addEventListener('loadedmetadata', () => {
        resolve();
      });
    }
  });

  await videoReady;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const duration = video.duration;
  const intervals = duration / 4;

  for (let i = 1; i <= 3; i++) {
    await captureThumbnail(video, canvas, context, intervals * i);
    const blob = await new Promise<Blob>((resolve) => canvas.toBlob(resolve));
    thumbnails.push(blob as Blob);
  }

  return thumbnails;
}
