/*eslint-disable */

import './style.css'

import { Anchor, Drawer as DrawerComponent, Menu, MenuProps } from 'antd'
import { AppstoreOutlined, CalendarOutlined, LinkOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { MENU_ITEMS, MenuItems } from './constants';

import { useNavigate } from 'react-router';

const { Link } = Anchor

interface DrawerPropsI {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function Drawer(props: DrawerPropsI) {
  const navigate = useNavigate();
  const onClose = () => {
    props.setOpen(false)
  }
    
  const onClick: MenuProps['onClick'] = e => {
    console.log('click ', e);
    navigate(`/app/dashboard/${e.key}`)
  };
    
  return (
    <DrawerComponent
      title="LMS"
      placement={'left'}
      width={300}
      onClose={onClose}
      open={props.open}
    >
      <Menu
        onClick={onClick}
        style={{ width: 256 }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        items={MenuItems}
      />
    </DrawerComponent>
  )
}

export default Drawer
