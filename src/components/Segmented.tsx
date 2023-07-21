import { Segmented as AntDSegmented, SegmentedProps } from 'antd'
import { useMemo } from 'react'

interface SegmentedPropsI {
  value?: string;
  size?: string;
  onChange?: (e: string) => void;
  options: { value: string, label: string }[];
}
export default function Segmented(props: SegmentedPropsI) {
  const VALUE = useMemo(
    () => {
      return props.options.find(o => o.label === props.value)?.label
    },
    [props.value, props.options]
  )
  return (
    // @ts-ignore
    <AntDSegmented
      // @ts-ignore
      onChange={e =>
        // @ts-ignore
        props.onChange(props.options.find(o => o.label === e)?.value)
      }
      value={VALUE}
      options={props.options.map(r => r.label)}
    />
  )
}
