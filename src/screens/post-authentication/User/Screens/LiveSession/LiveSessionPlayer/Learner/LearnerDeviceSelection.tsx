import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Button, Card, Typography } from 'antd';
import {
  CameraSelection,
  QualitySelection,
  PreviewVideo,
} from 'amazon-chime-sdk-component-library-react';
import { Learner } from '@adewaskar/lms-common';
import { useNavigate } from 'react-router';
import { useLiveSession } from './hooks';

const { Title } = Typography;

const LearnerDeviceSelection = () => {
  const { sessionId } = useParams();
  const { data: session } = Learner.Queries.useGetLiveSessionDetails(
    sessionId + ''
  )
  const navigate = useNavigate();

  const { joinMeeting } = useLiveSession(sessionId + '');

  useEffect(
    () => {
      if (session?.metadata?.MeetingId) {
        joinMeeting(session)
      }
    },
    [session]
  )

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
