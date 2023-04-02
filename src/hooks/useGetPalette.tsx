import { useEffect, useState } from 'react'

import { Store } from '@adewaskar/lms-common'
import { prominent } from 'color.js'

const useGetPalette = (image?: string) => {
  const { organisation } = Store.useGlobal(s => s)
  const [color, setColor] = useState([])
  useEffect(() => {
    prominent(organisation.logo, { format: 'hex' }).then((c: any) => {
      setColor(c)
    })
  }, [])

  return {
    color
  }
}

export default useGetPalette
