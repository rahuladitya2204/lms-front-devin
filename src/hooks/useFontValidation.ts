import { useState } from 'react'

// @ts-ignore
export function useFontValidation (form) {
  const [isFontValidating, setIsFontValidating] = useState(false)
  const [isFontValid, setIsFontValid] = useState(false)

  // @ts-ignore
  const validateFontName = async (_, value) => {
    setIsFontValidating(true)
    setIsFontValid(false) // reset validation status

    if (!value) {
      setIsFontValidating(false)
      return Promise.reject(new Error('Please enter a font name'))
    }

    const baseUrl = 'https://fonts.googleapis.com/css2'
    const formattedFontName = value.replace(/ /g, '+')
    const url = `${baseUrl}?family=${formattedFontName}:wght@400;700`

    try {
      const response = await fetch(url)
      setIsFontValidating(false)

      if (response.ok) {
        form.setFieldValue(['branding', 'font', 'url'], url)
        setIsFontValid(true)
        return Promise.resolve()
      } else {
        setIsFontValid(false)
        return Promise.reject(new Error('Font not found'))
      }
    } catch (error) {
      setIsFontValidating(false)
      return Promise.reject(new Error('Error checking the font'))
    }
  }

  return {
    isFontValidating,
    isFontValid,
    validateFontName
  }
}
