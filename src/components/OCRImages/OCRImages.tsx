// @ts-nocheck
import React, { useEffect, useState } from 'react'
import Tesseract, { createWorker } from 'tesseract.js'

const OCRImages = ({ imageUrls }: { imageUrls: string[] }) => {
  const [results, setResults] = useState([])
  useEffect(() => {
    const tess = Tesseract.recognize(imageUrls[0], 'eng', {
      logger: m => console.log(m)
    })
      .catch(err => {
        console.error(err)
      })
      .then(result => {
        console.log(result)
      })
  })

  return <p>{results}</p>
}

async function getTextFromHandwrittenImage(url: string) {
  const worker = createWorker({
    logger: m => console.log(m)
  })

  await worker.load()
  await worker.loadLanguage('eng')
  await worker.initialize('eng')
  await worker.setParameters({
    tessedit_handwriting_mode: true
  })

  const { data: { text } } = await worker.recognize(url)

  await worker.terminate()

  return text
}

export default OCRImages
