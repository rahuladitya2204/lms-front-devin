import { Common, Store, User } from '@adewaskar/lms-common'

import Image from './Image'
import { Skeleton } from 'antd'

// import { useNavigate } from 'react-router'

function OrgLogo(props: any) {
  // const navigate = useNavigate()
  const { data: organisation } = Common.Queries.useGetOrgDetails()
  const logo = organisation?.branding?.logo
  const SkeletonButton = (
    <Skeleton.Avatar active style={{ width: 45, height: 45 }} />
  )
  if (!logo) {
    return null
  }
  return !organisation._id ? (
    SkeletonButton
  ) : (
    <Image
      noLoadNoShow
      noLoadNoShowPlaceholder={organisation._id ? SkeletonButton : <span />}
      // onClick={() => navigate('../app/store')}
      style={{ cursor: 'pointer', margin: 'auto', ...(props.style || {}) }}
      width={props.width || `45px`}
      preview={false}
      // @ts-ignore
      src={logo[props.quality ? props.quality : 'low'].url}
      {...props}
    />
  )
}

export default OrgLogo
