import { Tabs as AppTabs, Button, Card, Form, TabsProps } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

function Tabs(props: TabsProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeKey, setActiveKey] = useState('')

  // On component mount, set the active tab based on the URL hash
  useEffect(
    () => {
      if (location.hash) {
        setActiveKey(location.hash.replace('#', ''))
      } else {
        if (props.items?.length) {
          setActiveKey(props.items[0].key)
        }
      }
    },
    [location]
  )

  const onChange = (activeKey: string) => {
    setActiveKey(activeKey)
    // navigate(`#${activeKey}`)
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
