import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Button, Card, Typography } from 'antd';
import {
  CameraSelection,
  QualitySelection,
  PreviewVideo,
} from 'amazon-chime-sdk-component-library-react';
import { User } from '@adewaskar/lms-common';
import { useNavigate } from 'react-router';
import UserLiveSessionPlayer from './LiveSessionPlayer';
import { useLiveSession } from './hooks';

const { Text } = Typography;

const UserDeviceSelection = () => {
  const [joined,setJoined]=useState(false)
  const { sessionId } = useParams();
  const { data: session } = User.Queries.useGetLiveSessionDetails(
    sessionId + ''
  )
  const navigate = useNavigate();


  const {
    mutate: startSession,
  } = User.Queries.useStartLiveSession()


  const handleJoinMeeting = () => {
    // setJoined(true);
    navigate(`${session.metadata.MeetingId}/session`);
  }

  return (
    <>
      <Card style={{
        display: joined ? 'none' : 'block',
        width: 300,
        margin: 'auto',
        marginTop:170
      }}>
        <CameraSelection />
        <QualitySelection />
        <span style={{ display: 'block', marginBottom: '.5rem' }}>Video preview</span>
        <PreviewVideo />
        {false?<Text>Meeting has been started</Text>:<Button style={{margin: '10px 0'}} onClick={()=>startSession({session:sessionId+''})} block>
          Start Meeting
        </Button>}
        <Button style={{margin: '10px 0'}} type="primary" onClick={handleJoinMeeting} block>
          Join Meeting
        </Button>
      </Card>
      <div style={{
        display:!joined?'none':'block'
      }}>
         <UserLiveSessionPlayer />
      </div>
     
      
    </>
  );
};

export default UserDeviceSelection;
