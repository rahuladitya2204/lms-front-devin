import katex, { KatexOptions } from 'katex'
export function convertLatexToMathML(
  latexString: string,
  options?: KatexOptions
): string {
  try {
    // Use the KaTeX renderToString function with the specified options
    return katex.renderToString(latexString, {
      throwOnError: false,
      displayMode: true,
      output: 'htmlAndMathml',
      ...options // Spread operator to merge any additional options
    })
  } catch (error) {
    console.error('Error converting LaTeX to MathML:', error)
    return '' // Return an empty string or any fallback content you prefer
  }
}

// Function to transform an input string containing LaTeX into MathML
export function transformLatexInString(inputString: string): string {
  // Regular expression to match LaTeX patterns
  const latexPattern = /\$(.+?)\$/g

  // Replace all LaTeX patterns in the input string with their MathML equivalent
  return inputString.replace(latexPattern, (match, latex) => {
    return convertLatexToMathML(latex)
  })
}

export function printPdf(downloadUrl: string, filename = 'test.pdf') {
  // Create a temporary download link
  const downloadLink = document.createElement('a')
  downloadLink.href = downloadUrl
  downloadLink.target = '_blank'; // Open in a new tab if it fails to download
  downloadLink.download = filename || 'downloaded.pdf' // You can specify the default filename here

  // Append the link to the document and click it
  document.body.appendChild(downloadLink)
  downloadLink.click()

  // Clean up by removing the link and revoking the Blob URL
  document.body.removeChild(downloadLink)
  window.URL.revokeObjectURL(downloadUrl)
}

// function base64ToArrayBuffer(base64: string) {
//   const binaryString = window.atob(base64) // Decode base64
//   const len = binaryString.length
//   const bytes = new Uint8Array(len)
//   for (let i = 0; i < len; i++) {
//     bytes[i] = binaryString.charCodeAt(i)
//   }
//   return bytes.buffer
// }

export const openWindow = (url: string, cb?: Function) => {
  const newWindow = window.open(url, '_blank')
  // @ts-ignore
  window.onComplete = (...args) => {
    cb && cb(...args)
    // debugger
    // newWindow?.close()
  }
}
