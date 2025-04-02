import React, { useEffect, useState } from 'react';
import { fetchMeetingDetail } from '../../services/meetingService';
import Modal from '../../components/Modal';
import OfficeService from "../../services/officeService";
import "bootstrap/dist/css/bootstrap.min.css";

import CallReport from "../CallReport/CallReport";

function MeetingDetail({ officeMeetingInfo }) {
  const [detail, setDetail] = useState(null);
  const [showCallReport, setShowCallReport] = useState(false);


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
      {showCallReport ? (
      <CallReport eventInfo={detail} onGoBack={() => setShowCallReport(false)} />
      ):(
        <div>
      <h3>{detail.meetingTitle || "N/A"}</h3>
      <p><strong>Venue Address:</strong> {detail.venueAddress || "N/A"}</p>
      <p><strong>Joining Link:</strong> {detail.joiningLink || "N/A"}</p>
      <p><strong>Service Provider:</strong> {detail.serviceProvider || "N/A"}</p>

      {/* Render attendees as a list */}
      <p><strong>Attendees:</strong></p>
      <ul>
        {(detail.attendees || []).map((attendee, index) => (
          <li key={index}>{attendee.label}</li>
        ))}
      </ul>
      {/* Render accounts as a list */}
      <p><strong>Accounts:</strong></p>
      <ul>
        {(detail.accounts || []).map((account, index) => (
          <li key={index}>{account.label}</li>
        ))}
      </ul>

      {/* Render speakers as a list */}
      <p><strong>Speakers:</strong></p>
      <ul>
        {(detail.speakers || []).map((speaker, index) => (
          <li key={index}>{speaker.label}</li>
        ))}
      </ul>
      
      {/* Primary Buttons */}
      <div className="text-center space-x-4">
        <button className="btn btn-primary w-10 me-2" onClick={() => setShowCallReport(true)}>Generate CallReport</button>
        <button className="btn btn-primary w-10">Generate CallSummary</button>
      </div>
     </div>
      )}
    </div>
    
  );
}

export default MeetingDetail;
