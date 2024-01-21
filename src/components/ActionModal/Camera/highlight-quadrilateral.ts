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
        let color = new cv.Scalar(0, 0, 0, 255) // Black color
        cv.drawContours(
          srcMat,
          contours,
          maxContourIndex,
          color,
          3,
          cv.LINE_8,
          hierarchy,
          0
        ) // Increased thickness to 3
      }

      const canvas = document.createElement('canvas')
      cv.imshow(canvas, srcMat)
      const newDataUrl = canvas.toDataURL()

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
