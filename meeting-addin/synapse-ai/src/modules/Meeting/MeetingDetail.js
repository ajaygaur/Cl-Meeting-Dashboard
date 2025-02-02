import React, { useEffect, useState } from 'react';
import { fetchMeetingDetail } from '../../services/meetingService';
import Modal from '../../components/Modal';

function MeetingDetail({ meetingId }) {
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    const getDetails = async () => {
      try {
        const data = await fetchMeetingDetail(meetingId);
        setDetail(data);
      } catch (error) {
        console.error('Failed to load meeting detail:', error);
      }
    };
    getDetails();
  }, [meetingId]);

  if (!detail) {
    return <p>Loading details...</p>;
  }

  return (
      <div>
        <h3>{detail.meetingTitle}</h3>
        <p>{detail.organizer}</p>
      </div>    
  );
}

export default MeetingDetail;
