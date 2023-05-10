// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// @ts-nocheck
import React, { ChangeEvent, useState } from 'react'
import {
  Roster,
  RosterAttendee,
  RosterCell,
  RosterGroup,
  RosterHeader,
  useRosterState
} from 'amazon-chime-sdk-component-library-react'

import { useNavigation } from './Navigation/NavigationProvider'

const MeetingRoster = () => {
  const { roster } = useRosterState()
  const [filter, setFilter] = useState('')
  const { closeRoster } = useNavigation()

  let attendees = Object.values(roster)

  if (filter) {
    attendees = attendees.filter((attendee: any) =>
      attendee?.name.toLowerCase().includes(filter.trim().toLowerCase())
    )
  }
  attendees = attendees.filter(({ externalUserId }) => !externalUserId.includes('MediaPipeline'));
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value)
  }

  const Menu = () =>  <>
  <div style={{ padding: '.5rem 1rem', cursor: 'pointer' }}>Message user</div>
  <div style={{ padding: '.5rem 1rem', cursor: 'pointer' }}>Kick user</div>
  </>

  const attendeeItems = attendees
    
    .map((attendee: any) => {
      console.log(attendee, 'attendee')
      const { chimeAttendeeId, externalUserId } = attendee || {}
      const name = externalUserId.split('_')[0]
      return (
      
        // <RosterAttendee
        // attendeeId={chimeAttendeeId}
        // >
           <RosterCell
          name={name}
        />
      // </RosterAttendee>
      )
    })

  return (
    <Roster className="roster">
      <RosterHeader
        searchValue={filter}
        onSearch={handleSearch}
        onClose={closeRoster}
        title="Present"
        badge={attendees.length}
      />
      <RosterGroup>{attendeeItems}</RosterGroup>
    </Roster>
  )
}

export default MeetingRoster
