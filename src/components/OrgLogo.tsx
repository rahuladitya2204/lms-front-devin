import { Common, Store, User } from '@invinciblezealorg/lms-common'

import Image from './Image'
import { Skeleton } from 'antd'

interface OrgLogoPropsI {
  quality?: 'low' | 'high';
  noLoadNoShow?: boolean;
  width?: string | number;
  style?: any;
  onClick?: Function;
}

function OrgLogo(props: OrgLogoPropsI) {
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
    // @ts-ignore
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
