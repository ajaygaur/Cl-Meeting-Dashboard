import React, { useEffect, useState } from 'react';
import '../../styles.css';
import MeetingDetail from './MeetingDetail';
import MeetingCapture from './MeetingCapture';
import OfficeService from "../../services/officeService";

function MeetingModule(){
    const [meetingId, setMeetingId] = useState(null);
    const [newEventData,setNewEventData] = useState(null);
    const [savedEventData,setSavedEventData] = useState(null);
    const [error, setError] = useState(null);
    const [officeReady,setOfficeReady] = useState(false);
    const [initialize,setInitialize] = useState(false);

    useEffect(() => {
        // Ensure Office.js is available
        /* global Office */
        Office.onReady(() => {
            console.log('Office.js is ready');
            if (Office && Office.context && Office.context.mailbox) {
                console.log('Office context is available'); 
                setOfficeReady(true);               
                populateMeetingInfo();
                fetchMeetingInfo();
              } else {
                setError('Office.js is not available in the current environment.');
              }
        });        
      }, []);

      const populateMeetingInfo = async() => {
        try {
          const item = Office.context.mailbox.item;
          if (item) {
            /*const meetingDetails = {
              subject: item.subject || 'No subject',
              start: item.start ? new Date(item.start).toLocaleString() : 'N/A',
              end: item.end ? new Date(item.end).toLocaleString() : 'N/A',
              location: item.location || 'No location',
              organizer: item.organizer.emailAddress || 'No organizer',
            };*/
            if(item.meetingid != null){
                //setMeetingId(item.meetingid);
                setMeetingId(2);
            }
            else{
                const eventObj = {
                    meetingTitle: item.subject || "Untitled Meeting",
                    meetingDate: item.start ? new Date(item.start).toISOString() : new Date().toISOString(),
                    duration: item.end ? Math.round((new Date(item.end) - new Date(item.start)) / 60000): 30, // Default 30 mins if duration is missing
                    meetingStatus: "active",
                    venueAddress: item.location || "Online",
                    organizer: item.organizer ? item.organizer.emailAddress : "Unknown",
                    attendees: item.requiredAttendees? item.requiredAttendees.map((attendee,index) => 
                      ({
                        value:index+1,
                        label:attendee.emailAddress
                      })): null ,
                    body : ""                
                };

                const bodyText = await new Promise((resolve, reject) => {
                  item.body.getAsync(Office.CoercionType.Text, (result) => {
                    if (result.status === Office.AsyncResultStatus.Succeeded) {
                      resolve(result.value);
                    } else {
                      reject(result.error);
                    }
                  });
                });

                setNewEventData({...eventObj,body:bodyText});
                setInitialize(true);
            }
            
          } else {
            setError('No meeting item selected.');
          }
        } catch (err) {
          setError(`Error fetching meeting details: ${err.message}`);
        }
      };

      const fetchMeetingInfo = async() => {    //readonly
        
        const meetingInfo = await OfficeService.getMeetingDetails();
        setSavedEventData(meetingInfo);

      }

      if (error) {
        return <div className="error">Error: {error}</div>;
      }
    
      if(officeReady && initialize){
        if (meetingId != null) {
          return(
              <div className='meeting-module'>
                 {/* <MeetingDetail meetingId={meetingId} /> */} 
                 <MeetingDetail meetingId={meetingId} officeMeetingInfo={savedEventData} />
              </div>
            )
        }
        else{
          return(
              <div className='meeting-module'>
                  <MeetingCapture eventInfo={newEventData} />
              </div>
              
            )
        }
      }
      else{
        return <div>Loading OfficeWebAddIn</div>;
      }
      
     
}
export default MeetingModule;