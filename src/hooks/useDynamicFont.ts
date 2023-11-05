import { useEffect, useState } from 'react'

type UseDynamicFontProps = {
  fontName: string,
  fontUrl: string,
  format?: string // added the option to specify the format
}

const useDynamicFont = ({
  fontName,
  fontUrl,
  format = 'woff2'
}: UseDynamicFontProps) => {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(
    () => {
      if (fontName && fontUrl) {
        setIsLoading(true)

        const fontFace = new FontFace(
          fontName,
          `url(${fontUrl}) format('${format}')`
        )

        fontFace
          .load()
          .then(loadedFontFace => {
            console.log(loadedFontFace, 'loji')
            document.fonts.add(loadedFontFace)
            document.body.style.fontFamily = `'${fontName}', sans-serif`
            setIsLoading(false)
          })
          .catch(error => {
            console.error('Failed to load the font:', error)
            setIsLoading(false)
          })

        return () => {
          document.body.style.fontFamily = ''
        }
      }
    },
    [fontName, fontUrl, format]
  )

  return { isLoading }
}

export default useDynamicFont
