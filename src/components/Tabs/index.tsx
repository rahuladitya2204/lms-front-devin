import { Tabs as AppTabs, Button, Card, Form, TabsProps } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

interface AppTabPropsI extends TabsProps {
  navigateWithHash?: boolean;
}

function Tabs(props: AppTabPropsI) {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeKey, setActiveKey] = useState('')

  // On component mount, set the active tab based on the URL hash
  useEffect(
    () => {
      if (props.navigateWithHash) {
        if (location.hash) {
          setActiveKey(location.hash.replace('#', ''))
        } else {
          // @ts-ignore
          setActiveKey(props.items[0].key)
        }
      } else {
        if (props.items?.length) {
          setActiveKey(props.items[0].key)
        }
      }
    },
    [location, props.navigateWithHash]
  )

  const onChange = (activeKey: string) => {
    setActiveKey(activeKey)
    if (props.navigateWithHash) {
      navigate(`#${activeKey}`)
    }
  }

  return (
    <AppTabs
      {...props}
      activeKey={activeKey}
      onChange={onChange}
      items={props.items}
    />
  )
}

export default Tabs
