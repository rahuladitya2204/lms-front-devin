import AppImage from '@Components/Image'

interface CoinImagePropsI {
  width?: number;
}

export default function CoinImage(props: CoinImagePropsI) {
  return <AppImage width={props.width || 50} src="/images/coin2.svg" />
}
