import { Common, Store, User } from '@invinciblezealorg/lms-common'
import { useEffect, useState } from 'react'

import { generate } from '@ant-design/colors'
import { getPaletteFromImage } from '@User/Screens/Builder/AppBuilder/AppCustomizer/utils'
import { prominent } from 'color.js'

const useGetPalette = (image?: string) => {
  const { data:organisation} = User.Queries.useGetOrgDetails();
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
