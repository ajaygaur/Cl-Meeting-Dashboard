import React, { useEffect, useState } from 'react';
import { createMeeting , fetchAccounts } from '../../services/meetingService';
import Select from "react-select";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function MeetingCapture({ eventInfo }) {
  const [meetingCaptureInfo, setMeetingCaptureInfo] = useState(null);
  const [accountsInfo, setAccountsInfo] = useState(null);
  const [joiningLink, setJoiningLink] = useState("");
  const [loading,setLoading] = useState(false);

  useEffect(()=>{
      const accounts = async () => {
            try {
              const data = await fetchAccounts();
              const mappedArray = data.map(item => ({
                value: item.gpNumber,
                label: `${item.accountName} - ${item.accountType}`
            }));
              setAccountsInfo(mappedArray);
            } catch (error) {
              console.error('Failed to load Accounts detail:', error);
            }
          };      
      accounts();

      const extractMeetingLink = (text) => {
        
        if(text != null){
          const meetingLinkRegex = /(https?:\/\/(zoom\.us|teams\.microsoft\.com|join\.skype\.com|meet\.google\.com|webex\.com)[^\s]+)/gi;
          const match = text.match(meetingLinkRegex);
          
          if (match && match.length > 0) {
            setJoiningLink(match[0]); // Extract the first matching meeting link
          } else {
            setJoiningLink("No meeting link found.");
          }
        }
        else{
          setJoiningLink("");
        }               
      };
      extractMeetingLink(eventInfo?.body);

  },[])

  const speakers = [
    { value: 'AA07816', label: 'Ajay Gaur' },
    { value: 'SS8888', label: 'Sujeet Singh' },
    { value: 'RR7867', label: 'Rajan Kumar' }
  ]  

  const accountHandleChange = (field, value) => {
    
  };
  const handleSubmit = async (e) => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000); // Simulate API call delay
  }

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Capture Meeting for CRM</h3>

          <form onSubmit={handleSubmit}>
            {/* Account Select */}
            <div className="mb-3">
              <label className="form-label">Account:</label>
              <Select
                isMulti
                name="accounts"
                options={accountsInfo}
                placeholder="Select Account"
              />
            </div>

            {/* Meeting Title */}
            <div className="mb-3">
              <label className="form-label">Meeting Title:</label>
              <input
                type="text"
                value={eventInfo?.meetingTitle}
                required
                className="form-control"
              />
            </div>

            {/* Venue Address */}
            <div className="mb-3">
              <label className="form-label">Venue Address:</label>
              <input
                type="text"
                value={eventInfo?.venueAddress}
                className="form-control"
              />
            </div>

            {/* Speakers Select */}
            <div className="mb-3">
              <label className="form-label">Speakers:</label>
              <Select
                isMulti
                name="speakers"
                options={speakers}
                placeholder="Select Speakers"
              />
            </div>

            {/* Attendees Select */}
            <div className="mb-3">
              <label className="form-label">Attendees:</label>
              <Select
                options={eventInfo?.attendees}
                isMulti
                placeholder="Select Attendees"
              />
            </div>

            {/* Joining Link */}
            <div className="mb-3">
              <label className="form-label">Joining Link:</label>
              <input type="text" value={joiningLink} className="form-control" />
            </div>

            {/* Service Provider Dropdown */}
            <div className="mb-3">
              <label className="form-label">Service Provider:</label>
              <select className="form-select">
                <option value="">Select Provider</option>
                <option value="zoom">Zoom</option>
                <option value="teams">Microsoft Teams</option>
                <option value="google_meet">Google Meet</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100"
              >
                {loading ? "Saving..." : "Save Meeting"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>   
  );
}

export default MeetingCapture;
