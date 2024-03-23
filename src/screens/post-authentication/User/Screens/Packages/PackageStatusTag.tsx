import { Enum, Types } from '@invinciblezealorg/lms-common'

import { Tag } from 'antd'
import { useMemo } from 'react'

interface PackageStatusTagPropsI {
  bundle: Types.Package;
}
export default function PackageStatusTag({ bundle }: PackageStatusTagPropsI) {
  if (bundle.status === Enum.PackageStatus.PUBLISHED) {
    return <Tag color="green-inverse">Published</Tag>
  }

  if (bundle.status === Enum.PackageStatus.DRAFT) {
    return <Tag color="blue-inverse">Draft</Tag>
  }

  //   if (bundle.status === Enum.PackageStatus.) {
  //     return <Tag color="red">Ended</Tag>
  //   }

  //   if (bundle.status === Enum.PackageStatus.IN_PROGRESS) {
  //     return <Tag color="green-inverse">Submitted</Tag>
  //   }

  return `-`
}
