import axios from 'axios';
import { API_BASE_URL, MEETING_DETAIL_ENDPOINT ,ACCOUNT_ENDPOINT,ACTION_ENDPOINT} from '../constants/apiConstants';
import { OfficeService } from './officeService';

/* global Office */
export const fetchMeetingDetail = async(id) => {
    try{
        const response = await axios.get(`${API_BASE_URL}${MEETING_DETAIL_ENDPOINT}/${id}`);
        return response.data;
    }catch(error){
        console.error('Error fetching meeting details:', error);
        throw error;
    }

}

export const createMeeting = async (meetingData) => {
    try {

      //const meetingResponse = await OfficeService.getMeetingDetails();
      //const item = Office.context.mailbox.item;

      const meetingPayload = {
        outlookItemId: meetingData['outlookItemId'], //"OUTLOOK-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9),
        accountID: meetingData['accounts'][0]?.value,
        meetingTitle: meetingData['meetingTitle'],
        meetingDate: new Date().toISOString(), // Set the meeting date dynamically
        duration: 60, // Duration in minutes
        meetingStatus: "Scheduled",
        venueAddress: meetingData['venueAddress'],
        organizer: meetingData['organiser'],
        speaker: meetingData['speakers'].map(a => a.label).join(", "),
        attendees: meetingData['attendees'].map(a => a.label).join(", "),
        joiningLink: meetingData['joiningLink'],
        serviceProvider: meetingData['selectedProvider'],
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString()
      };
        
        const response = await axios.post(`${API_BASE_URL}${MEETING_DETAIL_ENDPOINT}`, meetingPayload, {
            headers: {
              "Content-Type": "application/json",
            },
          });
  
      if (response.status !== 201) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return await response.data;

    } catch (error) {
      console.error("Error creating meeting:", error);
      throw error;
    }
  };

 export const fetchAccounts = async () => {
    try{
        const response = await axios.get(`${API_BASE_URL}${ACCOUNT_ENDPOINT}`);
        return response.data;
    }catch(error){
        console.error('Error fetching account details:', error);
        throw error;
    }
  };

 export const fetchActionDetails = async (outlookItemId) => {
  try{
    const response = await axios.get(`${API_BASE_URL}${ACTION_ENDPOINT}/${outlookItemId}`);
    return response.data;
  }catch(error){
    console.error('Error fetching action item details:', error);
    throw error;
  }
};