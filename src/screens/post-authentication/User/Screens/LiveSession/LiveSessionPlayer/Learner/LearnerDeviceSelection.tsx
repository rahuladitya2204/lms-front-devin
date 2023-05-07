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
import LearnerLiveSessionPlayer from './LiveSessionPlayer';
import { useLiveSession } from './hooks';

const { Text } = Typography;

const LearnerDeviceSelection = () => {
  const [joined,setJoined]=useState(false)
  const { sessionId } = useParams();
  const { data: session } = Learner.Queries.useGetLiveSessionDetails(
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
        display: joined ? 'none' : 'block',
        width: 300,
        margin: 'auto',
        marginTop:170
      }}>{session.isStarted? <>
        <CameraSelection />
        <QualitySelection />
        <span style={{ display: 'block', marginBottom: '.5rem' }}>Video preview</span>
        <PreviewVideo />
        <Button type="primary" onClick={handleJoinMeeting} block>
          Join Meeting
        </Button>
        </>:<Text>Meeting has not started yet</Text>}
       
       
      </Card>
      <div style={{
        display:!joined?'none':'block'
      }}>
         <LearnerLiveSessionPlayer />
      </div>
     
      
    </>
  );
};

export default LearnerDeviceSelection;
