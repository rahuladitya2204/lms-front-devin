import LearnerProfile from './Profile'
import { Tabs } from 'antd'

const items = [
  {
    label: `My Profile`,
    key: '1',
    children: <LearnerProfile />
  },
  // {
  //   label: `Affiliate Dashboard`,
  //   key: '2',
  //   children: `Content of Tab Pane 2`
  // },
  // {
  //   label: `Purchase History`,
  //   key: '3',
  //   children: `Content of Tab Pane 3`
  // }
]

export default function LearnerAccount () {
  return <Tabs defaultActiveKey="1" items={items} />
}
