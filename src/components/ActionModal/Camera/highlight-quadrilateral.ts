// @ts-nocheck
export function highlightQuadrilateral(url: string) {
  // @ts-ignore
  const cv = window.cv

  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'Anonymous'
    image.src = url
    image.onload = () => {
      let srcMat = cv.imread(image)
      let grayMat = new cv.Mat()
      let blurredMat = new cv.Mat()
      let edgedMat = new cv.Mat()
      let contours = new cv.MatVector()
      let hierarchy = new cv.Mat()

      cv.cvtColor(srcMat, grayMat, cv.COLOR_RGBA2GRAY, 0)
      cv.GaussianBlur(grayMat, blurredMat, new cv.Size(5, 5), 0)
      cv.Canny(blurredMat, edgedMat, 75, 200)
      cv.findContours(
        edgedMat,
        contours,
        hierarchy,
        cv.RETR_EXTERNAL,
        cv.CHAIN_APPROX_SIMPLE
      )

      let maxArea = 0
      let maxContourIndex = -1
      for (let i = 0; i < contours.size(); ++i) {
        let cnt = contours.get(i)
        let area = cv.contourArea(cnt)
        if (area > maxArea) {
          maxArea = area
          maxContourIndex = i
        }
        cnt.delete()
      }

      if (maxContourIndex !== -1) {
        // Get the corner points of the largest contour
        let cnt = contours.get(maxContourIndex)
        let rect = cv.minAreaRect(cnt)
        let vertices = cv.RotatedRect.points(rect)
        let quadPoints = orderPoints(vertices)

        // Perspective Transformation
        let sourceCoordinates = cv.matFromArray(
          4,
          1,
          cv.CV_32FC2,
          [].concat(...quadPoints)
        )
        let dsize = new cv.Size(srcMat.cols, srcMat.rows)
        let destCoordinates = cv.matFromArray(4, 1, cv.CV_32FC2, [
          0,
          0,
          dsize.width,
          0,
          dsize.width,
          dsize.height,
          0,
          dsize.height
        ])
        let transformMatrix = cv.getPerspectiveTransform(
          sourceCoordinates,
          destCoordinates
        )
        cv.warpPerspective(
          srcMat,
          srcMat,
          transformMatrix,
          dsize,
          cv.INTER_LINEAR,
          cv.BORDER_CONSTANT,
          new cv.Scalar()
        )

        // Clean up
        sourceCoordinates.delete()
        destCoordinates.delete()
        transformMatrix.delete()
      }

      const canvas = document.createElement('canvas')
      cv.imshow(canvas, srcMat)
      const newDataUrl = canvas.toDataURL()

      // Clean up
      srcMat.delete()
      grayMat.delete()
      blurredMat.delete()
      edgedMat.delete()
      contours.delete()
      hierarchy.delete()

      resolve(newDataUrl)
    }

    image.onerror = () => {
      reject(new Error('Failed to load image'))
    }
  })
}

// Function to order points (top-left, top-right, bottom-right, bottom-left)
function orderPoints(pts) {
  // Sort points based on their x-coordinates
  pts.sort((a, b) => a.x - b.x);

  // After sorting, split into two groups and sort by y-coordinates
  let [tl, bl] = [pts[0], pts[1]].sort((a, b) => a.y - b.y);
  let [tr, br] = [pts[2], pts[3]].sort((a, b) => a.y - b.y);

  // Ensure the points are in the correct order
  let orderedPts = [tl, tr, br, bl];

  // Convert point data from {x, y} to [x, y]
  return orderedPts.map(p => [p.x, p.y]);
}



export function imageUrlToDataUrl(url: string) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onload = function() {
      const reader = new FileReader()
      reader.onloadend = function() {
        resolve(reader.result)
      }
      reader.onerror = reject
      reader.readAsDataURL(xhr.response)
    }
    xhr.onerror = reject
    xhr.open('GET', url)
    xhr.responseType = 'blob'
    xhr.send()
  })
}
