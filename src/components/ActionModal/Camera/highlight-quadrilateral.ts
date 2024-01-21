export function highlightQuadrilateral(dataUrl: string) {
  // @ts-ignore
  const cv = window.cv
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = dataUrl
    image.onload = () => {
      const srcMat = cv.imread(image)
      const grayMat = new cv.Mat()
      const edgedMat = new cv.Mat()
      const contours = new cv.MatVector()
      const hierarchy = new cv.Mat()

      // Convert to grayscale
      cv.cvtColor(srcMat, grayMat, cv.COLOR_RGBA2GRAY, 0)

      // Detect edges
      cv.Canny(grayMat, edgedMat, 75, 200)

      // Find contours
      cv.findContours(
        edgedMat,
        contours,
        hierarchy,
        cv.RETR_EXTERNAL,
        cv.CHAIN_APPROX_SIMPLE
      )

      let docContour = null

      for (let i = 0; i < contours.size(); ++i) {
        const contour = contours.get(i)
        const peri = cv.arcLength(contour, true)
        const approx = new cv.Mat()
        cv.approxPolyDP(contour, approx, 0.02 * peri, true)

        if (approx.rows === 4) {
          docContour = approx
          break
        }

        approx.delete()
        contour.delete()
      }

      // Highlight the contour
      if (docContour) {
        const color = new cv.Scalar(255, 0, 255, 255)
        cv.drawContours(srcMat, contours, -1, color, 1, cv.LINE_8, hierarchy, 0)
        docContour.delete()
      }

      // Convert Mat back to Canvas
      const canvas = document.createElement('canvas')
      cv.imshow(canvas, srcMat)

      // Convert Canvas to Data URL
      const newDataUrl = canvas.toDataURL()

      // Cleanup
      srcMat.delete()
      grayMat.delete()
      edgedMat.delete()
      contours.delete()
      hierarchy.delete()

      resolve(newDataUrl)
    }

    image.onerror = reject
  })
}