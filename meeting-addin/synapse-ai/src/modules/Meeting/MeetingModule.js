import React, { useEffect, useState ,useRef } from 'react';
import '../../styles.css';
import MeetingDetail from './MeetingDetail';
import MeetingCapture from './MeetingCapture';
import OfficeService from "../../services/officeService";
import { preSaveSend } from "../../eventHandlers";

function MeetingModule(){

  const eventObj = useRef({
    outlookItemId: null,
    meetingTitle: "Untitled Meeting",
    meetingDate: null,
    duration: null,
    meetingStatus: "active",
    venueAddress: "Online",
    organizer: "Unknown",
    attendees: null,
    speakers : null,
    account : null,
    serviceProvider : null,
    body: ""
  });

  const [eventData, setEventData] = useState(eventObj.current);

  const [error, setError] = useState(null);
  const [officeReady,setOfficeReady] = useState(false);
  const [initialize,setInitialize] = useState(false);

  //const [meetingId, setMeetingId] = useState(null);
  const [newEventData,setNewEventData] = useState(null);
  const [savedEventData,setSavedEventData] = useState(null);


    useEffect(() => {
        // Ensure Office.js is available
        /* global Office */
        Office.onReady(() => {
            console.log('Office.js is ready');
            if (Office && Office.context && Office.context.mailbox) {
                console.log('Office context is available'); 
                setOfficeReady(true);
                registerHandlers();               
                prepareMeetingForm();
                window.preSaveSend = preSaveSend;
                //fetchMeetingInfo();
              } else {
                setError('Office.js is not available in the current environment.');
              }
        });        
      }, []);

      const registerHandlers = async() => {
        try {
          Office.context.mailbox.item.addHandlerAsync(Office.EventType.AppointmentTimeChanged, handleAppointmentTimeChanged);
          Office.context.mailbox.item.addHandlerAsync(Office.EventType.AttachmentsChanged, handleAttachmentsChanged);
          Office.context.mailbox.item.addHandlerAsync(Office.EventType.EnhancedLocationsChanged, handleEnhancedLocationsChanged);
          Office.context.mailbox.item.addHandlerAsync(Office.EventType.RecipientsChanged, handleRecipientsChanged);
        } catch (err) {
          setError(`Error registering event handlers: ${err.message}`);
        }
      };

      const handleAppointmentTimeChanged = () => {
        // When a new item is loaded, get the subject
        Office.context.mailbox.item.subject.getAsync((result) => {
          if (result.status === Office.AsyncResultStatus.Succeeded) {
            console.log("subject :");
            console.log(result);
            initializeNewEventObject();
          } else {
            console.error("Failed to get subject:", result.error.message);
          }
        });
      };

      const handleAttachmentsChanged = () => {

      };

      const handleEnhancedLocationsChanged = () => {

      };

      const handleRecipientsChanged = () => {

        const item = Office.context.mailbox.item;
        const isNewAppointment = !item.itemId;

        if(isNewAppointment){
          Office.context.mailbox.item.subject.getAsync((result) => {
            if (result.status === Office.AsyncResultStatus.Succeeded && result.value) {
                eventObj.current.meetingTitle = result.value;
                console.log("Updated Meeting Title:", eventObj.current.meetingTitle);
                setEventData({...eventObj.current,meetingTitle:eventObj.current.meetingTitle});
            }
        });
        }

      };

      const prepareMeetingForm = async() => {
        try {
          const item = Office.context.mailbox.item;
          const meetingResponse = await OfficeService.getMeetingDetails();
          
          if (item) {
            /*const meetingDetails = {
              subject: item.subject || 'No subject',
              start: item.start ? new Date(item.start).toLocaleString() : 'N/A',
              end: item.end ? new Date(item.end).toLocaleString() : 'N/A',
              location: item.location || 'No location',
              organizer: item.organizer.emailAddress || 'No organizer',
            };
            if(item.meetingid != null){
                //setMeetingId(item.meetingid);
                setMeetingId(2);
            }*/
           
           if(meetingResponse != null){   
              setSavedEventData(meetingResponse['meetingData']); 
              initializeEventObject(meetingResponse['meetingData']);
           }
           else{
              initializeNewEventObject();
           }            
          } else {
              setError('No meeting item selected.');
          }

          
          

        } catch (err) {
          setError(`Error fetching meeting details: ${err.message}`);
        }
      };



      const initializeNewEventObject = async () => {
        
        const item = Office.context.mailbox.item;                                         
        setEventData({...eventObj.current});
        
        setInitialize(true);  
      };

      const initializeEventObject = async (meetingData) => {
        
        const item = Office.context.mailbox.item; 
        
        eventObj.current = {
          outlookItemId: meetingData['outlookItemId'],
          meetingTitle: item.subject || "Untitled Meeting",
          meetingDate: meetingData['meetingStartDate'],
          duration: 60,
          meetingStatus: "active",
          venueAddress: meetingData['venueAddress'],
          organizer: meetingData['organiser'],
          attendees: meetingData['attendees'].map((attendee, index) => ({
                value: index + 1,
                label: attendee.label
              })),
          speakers : meetingData['speakers'],
          account : meetingData['accounts'],
          serviceProvider : meetingData['serviceProvider'],
          body: ""
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

        setEventData({...eventObj.current,body:bodyText});
        setInitialize(true);    
      };

      const isMeetingPassed = (meetingDate) => {
        //return false;
        const currentDate = new Date(); // Get current date & time
        const check = (new Date(meetingDate) < currentDate)
        console.log(check);
        
        return check; // Compare dates

      };


      

      /*const fetchMeetingInfo = async() => {    //readonly
        
        const meetingInfo = await OfficeService.getMeetingDetails();
        setSavedEventData(meetingInfo);

      }*/

      if (error) {
        return <div className="error">Error: {error}</div>;
      }
    
      if(officeReady && initialize){
        if (savedEventData != null && isMeetingPassed(savedEventData.meetingStartDate)) {
          return(
              <div className='meeting-module'>
                 {/* <MeetingDetail meetingId={meetingId} /> */} 
                 <MeetingDetail officeMeetingInfo={savedEventData} />
              </div>
            )
        }
        else{
          return(
              <div className='meeting-module'>
                  <MeetingCapture eventInfo={eventData} />
              </div>
              
            )
        }
      }
      else{
        return <div>Loading OfficeWebAddIn</div>;
      }
      
     
}
export default MeetingModule;