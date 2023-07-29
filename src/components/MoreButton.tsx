import { MoreOutlined } from '@ant-design/icons'
import { Dropdown } from 'antd'
import { MenuItemType } from 'antd/es/menu/hooks/useItems'

interface MoreButtonPropsI {
  items: MenuItemType[];
}

export default function MoreButton(props: MoreButtonPropsI) {
  return (
    <Dropdown
      menu={{
        items: props.items
      }}
      trigger={['click']}
    >
      <MoreOutlined />
    </Dropdown>
  )
}
