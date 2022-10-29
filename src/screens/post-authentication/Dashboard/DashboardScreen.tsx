import { Button, PageHeader } from 'antd'
import { NavLink, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Drawer from './Drawer'
import { MenuUnfoldOutlined } from '@ant-design/icons'
import { getItemFromStorage } from '../../../utils/storage'

function Dashboard () {
  useEffect(() => {
    let token
    ;(async () => {
      try {
        token = await getItemFromStorage('token')
      } catch (er) {
        console.log(er, 'er')
      }
    })()
  }, [])
  const [open, setOpen] = useState(false)
  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => null}
        title="LMS"
        backIcon={<MenuUnfoldOutlined onClick={() => setOpen(!open)} />}
      />
      <Drawer setOpen={setOpen} open={open} />
      <Outlet />
    </div>
  )
}

export default Dashboard
