import React, { useContext } from 'react'
import { useRosterState } from 'amazon-chime-sdk-component-library-react'

const CustomRoster = () => {
  const { roster } = useRosterState()
  console.log(roster, 'rosreee')

  // A function to get the attendee name from your database or state management system
  const getAttendeeName = (attendeeId: string) => {
    // Replace this with your implementation to get the attendee name
    // based on their Attendee ID
    return 'Attendee Name'
  }

  return (
    <div>
      {Object.keys(roster).map(attendeeId => {
        const attendee = roster[attendeeId]
        const attendeeName = getAttendeeName(attendeeId)
        return <div key={attendeeId}>{attendeeName}</div>
      })}
    </div>
  )
}

export default CustomRoster
