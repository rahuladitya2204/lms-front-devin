import { Common, Store, User } from '@adewaskar/lms-common'

import Image from './Image'

// import { useNavigate } from 'react-router'

function OrgLogo(props: any) {
  // const navigate = useNavigate()
  const { data: organisation } = Common.Queries.useGetOrgDetails()
  console.log(organisation, 'organisation')
  const logo = organisation?.branding?.logo
  if (!logo) {
    return null
  }
  return (
    <Image
      // onClick={() => navigate('../app/store')}
      style={{ cursor: 'pointer', margin: 'auto', ...(props.style || {}) }}
      width={`30px`}
      preview={false}
      src={logo.url}
      {...props}
    />
  )
}

export default OrgLogo
