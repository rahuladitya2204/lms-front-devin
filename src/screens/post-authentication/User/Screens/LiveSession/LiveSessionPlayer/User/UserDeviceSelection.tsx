import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Button, Card } from 'antd';
import {
  CameraSelection,
  QualitySelection,
  PreviewVideo,
} from 'amazon-chime-sdk-component-library-react';
import { User } from '@adewaskar/lms-common';
import { useNavigate } from 'react-router';
import UserLiveSessionPlayer from '../Player/LiveSessionPlayer';
import { useLiveSession } from './hooks';

const UserDeviceSelection = () => {
  const [joined,setJoined]=useState(false)
  const { sessionId } = useParams();
  const { data: session } = User.Queries.useGetLiveSessionDetails(
    sessionId + ''
  )
  const navigate = useNavigate();

  const { joinMeeting } = useLiveSession(sessionId + '');
  
  useEffect(() => {
    if(session.metadata.MeetingId){
      joinMeeting(session)
    }
  },[session])

  const handleJoinMeeting = () => {
    setJoined(true);
  }

  return (
    <>
      <Card style={{
        display:joined?'none':'block'
      }}>
        <CameraSelection />
        <QualitySelection />
        <span style={{ display: 'block', marginBottom: '.5rem' }}>Video preview</span>
        <PreviewVideo />
        <Button type="primary" onClick={handleJoinMeeting} block>
          Join Meeting
        </Button>
      </Card>:
      <div style={{
        display:!joined?'none':'block'
      }}>
         <UserLiveSessionPlayer />
      </div>
     
      
    </>
  );
};

export default UserDeviceSelection;
