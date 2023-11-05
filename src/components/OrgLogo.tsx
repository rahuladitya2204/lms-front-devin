import Image from './Image'
import { Store } from '@adewaskar/lms-common'
// import { useNavigate } from 'react-router'

function OrgLogo(props: any) {
  // const navigate = useNavigate()
  const organisation = Store.useGlobal(s => s.organisation)
  const logo = organisation?.branding?.logo
  if (!logo) {
    return null
  }
  return (
    <Image
      // onClick={() => navigate('../app/store')}
      style={{ cursor: 'pointer', margin: 'auto', ...(props.style || {}) }}
      width={`100px`}
      preview={false}
      src={logo.url}
      {...props}
    />
  )
}

export default OrgLogo
