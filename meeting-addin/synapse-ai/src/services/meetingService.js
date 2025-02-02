import axios from 'axios';
import { API_BASE_URL, MEETING_DETAIL_ENDPOINT ,ACCOUNT_ENDPOINT} from '../constants/apiConstants';

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
        
        const response = await axios.post(`${API_BASE_URL}${MEETING_DETAIL_ENDPOINT}`, meetingData, {
            headers: {
              "Content-Type": "application/json",
            },
          });
  
      if (!response.ok) {
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