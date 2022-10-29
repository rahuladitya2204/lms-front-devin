/*eslint-disable */

import './style.css'

import { Anchor, Drawer as DrawerComponent, Menu, MenuProps } from 'antd'
import { AppstoreOutlined, CalendarOutlined, LinkOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';

import { MENU_ITEMS } from './constants';

const { Link } = Anchor

interface DrawerPropsI {
  open: boolean;
  setOpen: (open: boolean) => void;
}

type MenuItem = Required<MenuProps>['items'][number];



function getItem(
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[],
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
    } as MenuItem;
}
  
const items = MENU_ITEMS.map((item, pIndex) => {
  const ARGS = [item.title, ''+pIndex, item.icon];
  const CHILDREN = item?.children?.map((childItem, cIndex) => getItem(childItem.title, `${pIndex}_${cIndex}`, childItem.icon));
  if(CHILDREN)
  {
    // @ts-ignore
    ARGS.push(CHILDREN);
  }
    // @ts-ignore
    return getItem(...ARGS)
})


function Drawer(props: DrawerPropsI) {
  const onClose = () => {
    props.setOpen(false)
  }
    
  const onClick: MenuProps['onClick'] = e => {
    console.log('click ', e);
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
        items={items}
      />
    </DrawerComponent>
  )
}

export default Drawer
