// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  ControlBarButton,
  Modal,
  ModalBody,
  ModalButton,
  ModalButtonGroup,
  ModalHeader,
  Phone,
  useMeetingManager
} from 'amazon-chime-sdk-component-library-react';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { StyledP } from './Styled';
import { User } from '@adewaskar/lms-common';

// import routes from '../../constants/routes';

const EndMeetingControl: React.FC = () => {
  const { eventId } = useParams();
  const { mutate:endMeeting} = User.Queries.useEndMeeting();
  const meetingManager = useMeetingManager();
  const [showModal, setShowModal] = useState(false);
  const toggleModal = (): void => setShowModal(!showModal);
  const navigate=useNavigate()
  const leaveMeeting = async (): Promise<void> => {
  };

  const endMeetingForAll = async (): Promise<void> => {
    try {
      if (eventId) {
        await endMeeting({ session: eventId }, {
          onSuccess:async ()=> {
            await meetingManager.leave();
            navigate('../');
          }
        });
       
      }
    } catch (e) {
      console.log('Could not end meeting', e);
    }
  };

  return (
    <>
      <ControlBarButton icon={<Phone />} onClick={toggleModal} label="Leave" />
      {showModal && (
        <Modal size="md" onClose={toggleModal} rootId="modal-root">
          <ModalHeader title="End Meeting" />
          <ModalBody>
            <StyledP>
              Leave meeting or you can end the meeting for all. The meeting
              cannot be used once it ends.
            </StyledP>
          </ModalBody>
          <ModalButtonGroup
            primaryButtons={[
              <ModalButton
                onClick={endMeetingForAll}
                variant="primary"
                label="End meeting for all"
                closesModal
              />,
              <ModalButton
                onClick={leaveMeeting}
                variant="primary"
                label="Leave Meeting"
                closesModal
              />,
              <ModalButton variant="secondary" label="Cancel" closesModal />
            ]}
          />
        </Modal>
      )}
    </>
  );
};

export default EndMeetingControl;
