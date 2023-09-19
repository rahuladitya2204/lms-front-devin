import Image from './Image'
import { Store } from '@adewaskar/lms-common'
import { useNavigate } from 'react-router'

function OrgLogo(props: any) {
  const navigate = useNavigate()
  const { organisation } = Store.useGlobal(s => s)
  console.log(organisation, 'organisation')
  return (
    <Image
      onClick={() => navigate('../app/store')}
      style={{ cursor: 'pointer', margin: 'auto' }}
      width={100}
      preview={false}
      src={organisation.logo}
    />
  )
}

export default OrgLogo
