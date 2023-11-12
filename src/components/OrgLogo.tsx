import { Common, Store, User } from '@adewaskar/lms-common'

import Image from './Image'
import { Skeleton } from 'antd'

// import { useNavigate } from 'react-router'

function OrgLogo(props: any) {
  // const navigate = useNavigate()
  const { data: organisation } = Common.Queries.useGetOrgDetails()
  const logo = organisation?.branding?.logo
  if (!logo) {
    return null
  }
  return (
    <Image
      noLoadNoShow
      noLoadNoShowPlaceholder={
        <Skeleton.Avatar active style={{ width: 25, height: 25 }} />
      }
      // onClick={() => navigate('../app/store')}
      style={{ cursor: 'pointer', margin: 'auto', ...(props.style || {}) }}
      width={props.width || `30px`}
      preview={false}
      src={logo.url}
      {...props}
    />
  )
}

export default OrgLogo
