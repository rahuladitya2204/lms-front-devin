import { Tabs, Typography } from 'antd';

import React from 'react';
import { SearchOutlined } from '@ant-design/icons';

const TAB_ITEMS = [
  {
    label: <SearchOutlined />,
    key: '1',
    children: 'Search Content',
  },
  {
    label: 'Overview',
    key: '2',
    children: 'Overview!',
  },
  {
    label: 'Q & A',
    key: '3',
    children: 'Q and A',
  },
  {
    label: 'Announcements',
    key: '4',
    children: 'Tab 3',
  },
  {
    label: 'Reviews',
    key: '5',
    children: 'Tab 3',
  },
  {
    label: 'Learning Tools',
    key: '6',
    children: 'Tab 3',
  },
];

const CoursePlayerMoreInfo: React.FC = () => (
  <Tabs
    defaultActiveKey="1"
    items={TAB_ITEMS}
  />
);

export default CoursePlayerMoreInfo;