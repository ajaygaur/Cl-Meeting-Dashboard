import React, { useEffect, useState } from 'react';
import { createMeeting , fetchAccounts } from '../../services/meetingService';
import OfficeService from "../../services/officeService";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";


function MeetingCapture({ eventInfo }) {
  const [meetingCaptureInfo, setMeetingCaptureInfo] = useState(null);
  const [accountsInfo, setAccountsInfo] = useState(null);
  const [joiningLink, setJoiningLink] = useState("");
  const [loading,setLoading] = useState(false);

  const [meetingTitle, setMeetingTitle] = useState(eventInfo?.meetingTitle || "");
  const [venueAddress, setVenueAddress] = useState(eventInfo?.venueAddress || "");
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [selectedSpeakers, setSelectedSpeakers] = useState([]);
  const [selectedAttendees,setSelectedAttendees] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("");

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
    e.preventDefault();
    setLoading(true);
    //setTimeout(() => setLoading(false), 2000); // Simulate API call delay

    //save info in outlook item.
    const meetingData = {
      meetingTitle: eventInfo?.meetingTitle,
      venueAddress: eventInfo?.venueAddress,
      attendees: eventInfo?.attendees,
      accounts: selectedAccounts,
      speakers: selectedSpeakers,
      joiningLink: joiningLink,
      serviceProvider: selectedProvider,
      meetingStartDate : eventInfo?.meetingDate
    };

    saveMeeting(meetingData);
    setLoading(false);

  }

  const saveMeeting = async (meetingData) => {

  const saveResult =  await OfficeService.saveMeetingDetails(meetingData);
              
  // Checking the success status
  if(!saveResult.isSuccessful){
    OfficeService.showNotification("Error", saveResult.text);
  }           
    OfficeService.showNotification("Success", saveResult.text);
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
                onChange={(selectedOptions) => setSelectedAccounts(selectedOptions)}
              />
            </div>

            {/* Meeting Title */}
            <div className="mb-3">
              <label className="form-label">Meeting Title:</label>
              <input
                type="text"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                required
                className="form-control"
              />
            </div>

            {/* Venue Address */}
            <div className="mb-3">
              <label className="form-label">Venue Address:</label>
              <input
                type="text"
                value={venueAddress}
                onChange={(e) => setVenueAddress(e.target.value)}
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
                onChange={(selectedOptions) => setSelectedSpeakers(selectedOptions)}
              />
            </div>

            {/* Attendees Select */}
            <div className="mb-3">
              <label className="form-label">Attendees:</label>
              <Select
                options={eventInfo?.attendees}
                isMulti
                placeholder="Select Attendees"
                onChange={(selectedOptions) => setSelectedAttendees(selectedOptions)}
              />
            </div>

            {/* Joining Link */}
            <div className="mb-3">
              <label className="form-label">Joining Link:</label>
              <input type="text" value={joiningLink} className="form-control" onChange={(e) => setJoiningLink(e.target.value)}/>
            </div>

            {/* Service Provider Dropdown */}
            <div className="mb-3">
              <label className="form-label">Service Provider:</label>
              <select className="form-select"
              onChange={(e) => setSelectedProvider(e.target.value)}
              >
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
