import { Button, Card } from 'antd';
import {
  CameraSelection,
  PreviewVideo,
  QualitySelection,
} from 'amazon-chime-sdk-component-library-react';
import { Constants, Learner } from '@adewaskar/lms-common';
import React, { useEffect, useState } from 'react';

import { Typography } from '@Components/Typography';
import { useEvent } from './hooks';
import { useNavigate } from '@Router/index';
import { useParams } from '@Router/index';

const { Title } = Typography;

const LearnerDeviceSelection = () => {
  const { eventId } = useParams();
  const { data: session } = Learner.Queries.useGetEventDetails(
    eventId + ''
  )
  const navigate = useNavigate();

  const { start } = useEvent(eventId + '');

  useEffect(() => {
    // @ts-ignore
    start(session, { metadata: Constants.INITIAL_EVENT_ATTENDEE_DETAILS.metadata});
  },[])

  const handleJoinMeeting = () => {
    // setJoined(true);
    navigate(`${session.metadata.MeetingId}/session`)
  }

  return (
    <>
      <Card style={{
        width: 300,
        margin: 'auto',
        marginTop:170
      }}>{session?.metadata?.MeetingId? <>
        <CameraSelection />
        <QualitySelection />
        <span style={{ display: 'block', marginBottom: '.5rem' }}>Video preview</span>
        <PreviewVideo />
        <Button type="primary" onClick={handleJoinMeeting} block>
          Join Meeting
        </Button>
        </>:<Title>Meeting has not started yet</Title>}
      </Card>     
      
    </>
  );
};

export default LearnerDeviceSelection;
