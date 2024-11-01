//@ts-nocheck
import { getDocument } from 'pdfjs-dist/legacy/build/pdf'

import Compressor from 'compressorjs'
import Hls from 'hls.js'
import { Types } from '@adewaskar/lms-common'
import { cloneDeep } from 'lodash'
import { unit } from 'mathjs'


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

export const updateTestSectionItem = (
  sections: Types.TestSection[],
  item: Types.TestSectionItem
) => {
  const SECTIONS = cloneDeep(sections)
  SECTIONS.forEach(section => {
    section.items.forEach((secItem, itemIndex) => {
      if (secItem._id === item._id) {
        section.items[itemIndex] = {
          ...secItem,
          ...item
        }
      }
    })
  })
  return SECTIONS
}

export const STRINGIFY = function (data: unknown) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(data))))
}
export const PARSE = function (str: string) {
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
  const text = htmlToText(html);
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = wordCount / wordsPerMinute;
  return Math.ceil(minutes);
}

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

export async function getVideoThumbnails(url: string): Promise<Blob[]> {
  const video = document.createElement('video');
  video.crossOrigin = 'anonymous'; // Add this line
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const thumbnails: Blob[] = [];

  const videoReady = new Promise<void>((resolve, reject) => {
    // Your existing conditional HLS setup remains unchanged here...
    // ...

    // Non-HLS scenario:
    video.src = url;
    video.addEventListener('loadedmetadata', () => {
      resolve();
    });
    video.addEventListener('error', (event) => {
      console.error('Video error:', event);
      reject(new Error(`Video error: ${event}`));
    });
  });

  await videoReady;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Calculate duration based on the video's metadata
  const duration = video.duration;

  // Calculate intervals for thumbnail capture
  const intervals = duration / 4;

  for (let i = 1; i <= 3; i++) {
    await captureThumbnail(video, canvas, context, intervals * i);
    const blob = await new Promise<Blob>((resolve) => canvas.toBlob(resolve));
    thumbnails.push(blob);
  }

  return thumbnails;
}


export function formatAvgCount(num: number) {
  if (num >= 1000) {
    return Math.floor(num / 1000) + "k+";
  } else {
    return num + "";
  }
}


export function generateGradientColors(primaryColor, numberOfColors = 5, lightnessChange = 0.2) {
  const colors = [];
  let currentColor = primaryColor;

  for (let i = 0; i < numberOfColors; i++) {
    const color = lightenColor(currentColor, lightnessChange * i);
    colors.push(color);
  }

  return colors;
}

function lightenColor(color, amount) {
  const num = parseInt(color.slice(1), 16),
    amt = Math.round(2.55 * amount),
    R = (num >> 16) + amt,
    G = ((num >> 8) & 0x00ff) + amt,
    B = (num & 0x0000ff) + amt;
  return `#${(0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 1 ? 0 : B) : 255)).toString(16).slice(1)}`;
}

// Example usage
const primaryColor = "#4B8DF8";
const numberOfColors = 5;
const lightnessChange = 0.1;
const gradientColors = generateGradientColors(primaryColor, numberOfColors, lightnessChange);
console.log(gradientColors);


export function convertToCommaSeparated(inputString) {
  return inputString.split('\n').map(item => item.replace(/[0-9]*\.? */, '').trim()).filter(i => i);
}

export const convertImageToBlob = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error converting image to Blob:', error);
    return null;
  }
};


export function blobToFile(blob: Blob): File {
  // Generate a unique filename based on the timestamp
  const timestamp = new Date().toISOString().replace(/[\W_]+/g, '');
  const filename = `file-${timestamp}`;

  // Use the MIME type from the Blob
  const mimeType = blob.type;

  // Create a new File from the Blob
  const file = new File([blob], filename, {
    type: mimeType,
    lastModified: Date.now(),
  });

  return file;
}



export function compressImage(file: File, options?: Partial<Compressor.Options>): Promise<File> {
  if (!options) {
    options = {};
  }
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.6, // Compression quality, 0.6 is 60% quality.
      convertSize: 0, // Images larger than this size in bytes will be converted to JPEG. Set to 0 to convert all images to JPEG.
      mimeType: file.type.includes('png') ? file.type : 'image/jpeg', // Convert the image to JPEG format.
      ...options,
      // @ts-ignore
      success(compressedFile) {
        if (options.grayscale) {
          compressedFile = convertToGrayscaleJPEG(compressedFile);
        }

        console.log('Prev file', file, 'Compressed File', compressedFile, 'Size Saved', `${Math.ceil(
          unit(file.size - compressedFile.size, 'byte')
            .to('megabyte')
            .toJSON().value
        )} MB`);
        resolve(compressedFile)
      },
      // @ts-ignore
      error(err) {
        reject(err)
      }
    })
  })
}


export function convertToGrayscaleJPEG(file) {
  return new Promise((resolve, reject) => {
    const imgElement = new Image();
    imgElement.src = URL.createObjectURL(file);

    imgElement.onload = () => {
      // Initialize OpenCV matrices
      let mat = cv.imread(imgElement);
      let matGray = new cv.Mat();

      // Convert the image to grayscale
      cv.cvtColor(mat, matGray, cv.COLOR_RGBA2GRAY, 0);

      // Create a canvas to output the grayscale image
      const canvas = document.createElement('canvas');
      canvas.width = imgElement.width;
      canvas.height = imgElement.height;
      const ctx = canvas.getContext('2d');

      // Draw the grayscale image onto the canvas
      cv.imshow(canvas, matGray);

      // Convert the canvas to a Blob, then to a File
      canvas.toBlob(blob => {
        const grayscaleFile = new File([blob], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        resolve(grayscaleFile);
      }, 'image/jpeg');

      // Clean up OpenCV objects
      mat.delete();
      matGray.delete();
    };

    imgElement.onerror = () => {
      reject(new Error('Could not load image'));
    };
  });
}

export function imageUrlToBlob(imageUrl) {
  return fetch(imageUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return blobToFile(response.blob());
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
      throw error;
    });
}
