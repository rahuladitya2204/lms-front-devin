import { Color } from '@kurkle/color'
import { Utils } from '@adewaskar/lms-common'

Utils.Storage.GetItem = (key: string) => localStorage.getItem(key)
Utils.Storage.SetItem = (key: string, value: string) =>
  localStorage.setItem(key, value)
Utils.Storage.RemoveItem = (key: string) => localStorage.removeItem(key)

type GradientTypes = {
  type1: string[],
  type2: string[],
  type3: string[],
  type4: string[]
}

export function generateGradients(primaryColor: string): GradientTypes {
  // Create a Color object
  const color = new Color(primaryColor)

  // Generate gradients by manipulating the color
  const gradientType1 = `linear-gradient(45deg, ${color.hexString()}, ${color
    .lighten(0.3)
    .hexString()})`
  const gradientType2 = `linear-gradient(90deg, ${color.hexString()}, ${color
    .darken(0.3)
    .hexString()})`
  const gradientType3 = `linear-gradient(135deg, ${color.hexString()}, ${color
    .alpha(0.5)
    .rgbString()})` // semi-transparent
  const gradientType4 = `linear-gradient(180deg, ${color.hexString()}, ${color
    .rotate(180)
    .hexString()})` // complementary color
  return {
    type1: [gradientType1],
    type2: [gradientType2],
    type3: [gradientType3],
    type4: [gradientType4]
  }
}
