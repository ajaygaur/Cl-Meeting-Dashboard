import React, { useEffect, useState } from 'react';
import { fetchMeetingDetail } from '../../services/meetingService';
import Modal from '../../components/Modal';
import OfficeService from "../../services/officeService";

function MeetingDetail({ meetingId , officeMeetingInfo}) {
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    /*const getDetails = async () => {
      try {
        const data = await fetchMeetingDetail(meetingId);
        setDetail(data);
      } catch (error) {
        console.error('Failed to load meeting detail:', error);
      }
    };*/

    setDetail(officeMeetingInfo);


    //getDetails();
  }, [officeMeetingInfo]);

  if (!detail) {
    return <p>Loading details...</p>;
  }

  return (
      <div>
        <h3>{detail.meetingTitle}</h3>
        <p>{detail.venueAddress}</p>
        <p>{detail.attendees}</p>
        <p>{detail.accounts}</p>
        <p>{detail.speakers}</p>
        <p>{detail.joiningLink}</p>
        <p>{detail.serviceProvider}</p>
      </div>    
  );
}

export default MeetingDetail;
