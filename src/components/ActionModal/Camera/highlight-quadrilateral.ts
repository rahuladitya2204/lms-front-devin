export function highlightQuadrilateral(url: string) {
  // @ts-ignore
  const cv = window.cv;

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = url;
    image.onload = () => {
      let srcMat = cv.imread(image);
      let grayMat = new cv.Mat();
      let processedMat = new cv.Mat();
      let blurredMat = new cv.Mat();
      let edgedMat = new cv.Mat();
      let contours = new cv.MatVector();
      let hierarchy = new cv.Mat();

      // Filter parameters
      const filterCvParams = {
        th: true,
        thMode: 3,
        thMeanCorrection: 10,
        thBlockSize: 11,
        thMax: 255,
        contrast: 1.5,
        brightness: 0,
        morphological: true,
        morphType: 1,
        morphSize: new cv.Size(3, 3)
      };

      // Convert to grayscale
      cv.cvtColor(srcMat, grayMat, cv.COLOR_RGBA2GRAY, 0);

      // Apply adaptive thresholding
      if (filterCvParams.th) {
        cv.adaptiveThreshold(grayMat, processedMat, filterCvParams.thMax, 
            filterCvParams.thMode, cv.THRESH_BINARY, 
            filterCvParams.thBlockSize, filterCvParams.thMeanCorrection);
      }

      // Adjust contrast and brightness
      processedMat.convertTo(processedMat, -1, filterCvParams.contrast, filterCvParams.brightness);

      // Morphological operations
      if (filterCvParams.morphological) {
        let morphType = filterCvParams.morphType === 1 ? cv.MORPH_DILATE : cv.MORPH_ERODE;
        let kernel = cv.getStructuringElement(cv.MORPH_RECT, filterCvParams.morphSize);
        cv.morphologyEx(processedMat, processedMat, morphType, kernel);
        kernel.delete();
      }

      // Continue with edge detection and contour finding
      cv.GaussianBlur(processedMat, blurredMat, new cv.Size(5, 5), 0);
      cv.Canny(blurredMat, edgedMat, 75, 200);
      cv.findContours(edgedMat, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

      let maxArea = 0;
      let maxContourIndex = -1;
      for (let i = 0; i < contours.size(); ++i) {
        let cnt = contours.get(i);
        let area = cv.contourArea(cnt);
        if (area > maxArea) {
          maxArea = area;
          maxContourIndex = i;
        }
        cnt.delete();
      }

      if (maxContourIndex !== -1) {
        let color = new cv.Scalar(255, 0, 0, 255);
        cv.drawContours(srcMat, contours, maxContourIndex, color, 2, cv.LINE_8, hierarchy, 0);
      }

      const canvas = document.createElement('canvas');
      cv.imshow(canvas, srcMat);
      const newDataUrl = canvas.toDataURL();

      // Clean up
      srcMat.delete();
      grayMat.delete();
      processedMat.delete();
      blurredMat.delete();
      edgedMat.delete();
      contours.delete();
      hierarchy.delete();

      resolve(newDataUrl);
    };

    image.onerror = () => {
      reject(new Error("Failed to load image"));
    };
  });
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
