// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  Attendees,
  Information,
  LeaveMeeting,
  Navbar,
  NavbarHeader,
  NavbarItem
} from 'amazon-chime-sdk-component-library-react'

import { Space } from 'antd'
import { useNavigation } from './NavigationProvider'

const Navigation = () => {
  const { toggleRoster, toggleMetrics, closeNavbar } = useNavigation()

  return (
    <Navbar
      className="nav"
      flexDirection="column"
      container
      style={{ justifyContent: 'space-between' }}
    >
      <Space direction="vertical">
        <NavbarHeader title="Navigation" onClose={closeNavbar} />
        <NavbarItem
          icon={<Attendees />}
          onClick={toggleRoster}
          label="Attendees"
        />
        {/* <NavbarItem
          icon={<Eye />}
          onClick={toggleTheme}
          label={theme === 'light' ? 'Dark mode' : 'Light mode'}
        /> */}
        <NavbarItem
          icon={<Information />}
          onClick={toggleMetrics}
          label="Meeting metrics"
        />
      </Space>
      <NavbarItem
        icon={<LeaveMeeting />}
        onClick={() => alert('Leave Meeting')}
        label="Leave Meeting"
        showLabel={true}
      />
    </Navbar>
  )
}

export default Navigation
