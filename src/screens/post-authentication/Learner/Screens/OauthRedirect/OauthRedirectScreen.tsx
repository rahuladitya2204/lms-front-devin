import { Tabs } from 'antd'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function OauthRedirect () {
  let [searchParams, setSearchParams] = useSearchParams()
  console.log(searchParams.get('token'), 'params')
  const token = searchParams.get('token')
  useEffect(
    () => {
      window.opener.postMessage({
        type: 'oauth-completed',
        data: {
          token
        }
      })
      window.close()
    },
    [token]
  )
  return null
}
