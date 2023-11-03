import { useEffect, useState } from 'react'

import { Store } from '@adewaskar/lms-common'
import { generate } from '@ant-design/colors'
import { getPaletteFromImage } from '@User/Screens/Builder/AppBuilder/AppCustomizer/utils'
import { prominent } from 'color.js'

const useGetPalette = (image?: string) => {
  const { organisation } = Store.useGlobal(s => s)
  const [colors, setColor] = useState<string[]>([])
  useEffect(() => {
    getPaletteFromImage(organisation.logo).then((c: any) => {
      const CCC = generate(c)
      console.log(CCC, 'colororo')
      setColor(CCC)
    }).catch(console.log)
  }, [organisation.logo])

  return {
    colors
  }
}

export default useGetPalette
