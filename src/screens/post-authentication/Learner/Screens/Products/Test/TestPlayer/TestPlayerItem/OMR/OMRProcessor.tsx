import { useEffect, useRef, useState } from 'react'

// @ts-ignore
import { useOpenCv } from 'opencv-react'

const BUBBLE_DIAMETER = 20 // Diameter of the bubbles in pixels
const BUBBLE_RADIUS = BUBBLE_DIAMETER / 2 // Radius of the bubbles
const HORIZONTAL_GAP = 10 // Horizontal gap between bubbles in pixels
const VERTICAL_GAP = 30 // Vertical gap between the centers of bubbles in pixels
const QUESTION_NUMBER_WIDTH = 30 // Width reserved for the question number in pixels
const QUESTIONS_PER_ROW = 4 // Number of questions per row

// Constants for bubble fill detection
const DARKNESS_THRESHOLD = 50 // Intensity threshold to consider a bubble as filled
const MIN_FILLED_AREA_RATIO = 0.75 // Minimum ratio of the bubble area that must be filled

// Custom hook to dynamically load OpenCV.js
export const useOpenCV = () => {
  const [loading, setLoading] = useState(true)
  const { loaded, cv } = useOpenCv()

  const processOMRImage = (
    imageUrl: string
  ): Promise<Record<number, number[]>> => {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.crossOrigin = 'Anonymous' // Needed for CORS
      image.onload = () => {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = image.width
        canvas.height = image.height
        //   @ts-ignore
        context.drawImage(image, 0, 0, image.width, image.height)

        const src = cv.imread(canvas)
        const gray = new cv.Mat()
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0)
        const thresh = new cv.Mat()
        cv.threshold(
          gray,
          thresh,
          0,
          255,
          cv.THRESH_BINARY_INV | cv.THRESH_OTSU
        )

        const contours = new cv.MatVector()
        const hierarchy = new cv.Mat()
        cv.findContours(
          thresh,
          contours,
          hierarchy,
          cv.RETR_EXTERNAL,
          cv.CHAIN_APPROX_SIMPLE
        )

        const answers: Record<number, number[]> = {}

        // Logic to process contours and determine filled bubbles
        for (let i = 0; i < contours.size(); ++i) {
          const cnt = contours.get(i)
          const area = cv.contourArea(cnt, false)
          const expectedArea = Math.PI * BUBBLE_RADIUS ** 2

          if (area > expectedArea * 0.8 && area < expectedArea * 1.2) {
            const rect = cv.boundingRect(cnt)
            const mask = new cv.Mat.zeros(thresh.rows, thresh.cols, cv.CV_8UC1)
            cv.drawContours(
              mask,
              contours,
              i,
              new cv.Scalar(255, 255, 255),
              cv.FILLED
            )

            // Calculate the mean pixel value within the contour
            const meanVal = cv.mean(gray, mask)

            // Check if the bubble is filled enough (dark and with enough filled area)
            if (meanVal[0] < DARKNESS_THRESHOLD) {
              const colIndex = Math.floor(
                (rect.x - QUESTION_NUMBER_WIDTH) /
                  (BUBBLE_DIAMETER + HORIZONTAL_GAP)
              )
              const rowIndex = Math.floor(
                rect.y / (BUBBLE_DIAMETER + VERTICAL_GAP)
              )
              const questionNumber = rowIndex * QUESTIONS_PER_ROW + colIndex + 1
              const answerIndex = colIndex % QUESTIONS_PER_ROW + 1

              if (!answers[questionNumber]) {
                answers[questionNumber] = []
              }
              answers[questionNumber].push(answerIndex)
            }
            mask.delete()
          }
        }

        src.delete()
        gray.delete()
        thresh.delete()
        contours.delete()
        hierarchy.delete()
        console.log(answers, 'answers')
        resolve(answers)
      }
      image.onerror = e => {
        reject(e)
      }
      image.src = imageUrl
    })
  }

  return { cv, loading, processOMRImage }
}
