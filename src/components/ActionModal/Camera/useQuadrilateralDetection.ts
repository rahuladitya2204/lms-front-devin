import { useCallback } from 'react'
// @ts-ignore
import { useOpenCv } from 'opencv-react'

interface Point {
  x: number;
  y: number;
}

export const DetectQuadrilateral = (
  cv: any,
  videoElement: HTMLVideoElement | null,
  onQuadrilateralDetected: (quadrilateralCoordinates: Point[]) => void
) => {
  //   const { loaded, cv } = useOpenCv()
  console.log(cv, 'ccc')
  if (!videoElement) return

  // Create OpenCV objects
  let src = new cv.Mat(videoElement.height, videoElement.width, cv.CV_8UC4)
  let gray = new cv.Mat()
  let blurred = new cv.Mat()
  let edged = new cv.Mat()
  let contours = new cv.MatVector()
  let hierarchy = new cv.Mat()

  // Capture a frame from the video
  const cap = new cv.VideoCapture(videoElement)
  cap.read(src)

  // Convert to grayscale
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0)

  // Apply Gaussian blur
  cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT)

  // Detect edges
  cv.Canny(blurred, edged, 75, 200)

  // Find contours
  cv.findContours(
    edged,
    contours,
    hierarchy,
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_SIMPLE
  )

  // Quadrilateral detection logic
  let maxArea = 0
  // @ts-ignore
  let bestContour: cv.Mat | null = null
  for (let i = 0; i < contours.size(); ++i) {
    const contour = contours.get(i)
    const area = cv.contourArea(contour)
    if (area > maxArea) {
      const peri = cv.arcLength(contour, true)
      const approx = new cv.Mat()
      cv.approxPolyDP(contour, approx, 0.02 * peri, true)
      if (approx.rows === 4) {
        maxArea = area
        bestContour = approx
      } else {
        approx.delete()
      }
    }
  }

  // If a quadrilateral was detected
  if (bestContour) {
    const quadrilateralCoordinates: Point[] = []
    for (let i = 0; i < bestContour.rows; i++) {
      quadrilateralCoordinates.push({
        x: bestContour.data32S[i * 2],
        y: bestContour.data32S[i * 2 + 1]
      })
    }
    onQuadrilateralDetected(quadrilateralCoordinates)
    bestContour.delete()
  }

  // Clean up
  src.delete()
  gray.delete()
  blurred.delete()
  edged.delete()
  contours.delete()
  hierarchy.delete()
}
