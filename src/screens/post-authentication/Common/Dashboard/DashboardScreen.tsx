import { Layout, Menu } from 'antd';
import React, { useState } from 'react';

import { MenuItems } from './constants';
import type { MenuProps } from 'antd';
import { Outlet } from 'react-router';

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];


const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={MenuItems} />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
         <Outlet/>
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
      </Layout>
    </Layout>
  );
};

export default App;