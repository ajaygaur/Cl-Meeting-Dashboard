// officeService.js - Handles Office.js interactions

/* global Office */
export const OfficeService = {
    /**
     * Load custom properties for the Outlook item
     * @returns {Promise} Resolves with custom properties object
     */
    loadCustomProperties: async () => {
      return new Promise((resolve, reject) => {
        Office.context.mailbox.item.loadCustomPropertiesAsync((asyncResult) => {
          if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
            resolve(asyncResult.value);
          } else {
            reject(asyncResult.error);
          }
        });
      });
    },
  
    
    /**
     * Save meeting details as a custom property in Outlook
     * @param {Object} meetingData - Meeting details to save
     * @returns {Promise} Resolves when data is saved successfully
     */
    saveMeetingDetails: async (meetingData) => {
      
            const customProperties = await OfficeService.loadCustomProperties();
            customProperties.set("MeetingDetails", JSON.stringify({meetingData}));
      
            const saveResult = await new Promise((resolve) => {
              customProperties.saveAsync((result) => {
                resolve(result);
              });
            });
      
            if (saveResult.status === Office.AsyncResultStatus.Succeeded) {
                return { isSuccessful: true, text: "Meeting details saved successfully!" };
            } else {
                return { isSuccessful: false, text: "Failed to save meeting details." };
            }
    },
  
    
    /**
     * Retrieve saved meeting details from Outlook custom properties
     * @returns {Promise<Object|null>} Resolves with meeting details or null if not found
     */
    getMeetingDetails: async () => {
      
      const customProperties = await OfficeService.loadCustomProperties();
      const meetingDetails = customProperties.get("MeetingDetails");
      return meetingDetails ? JSON.parse(meetingDetails) : null;
      
    },

     // Function to fetch appointment details
     // officeService.js
fetchAppointmentData: async () => {
  
  const item = Office.context.mailbox.item;

  if (!item) {
    throw new Error("No item found");
  }

  const appointmentData = {
    subject: "",
    attendees: [],
    startTime: "",
    endTime: "",
    location: "",
  };

  const promises = [];

  // Fetch Subject
    promises.push(
      new Promise((resolve) => {
        item.subject.getAsync((result) => {
          if (result.status === Office.AsyncResultStatus.Succeeded) {
            appointmentData.subject = result.value;
          }
          resolve(); // Ensure promise resolves
        });
      })
    );

  // Fetch Start & End Time (Direct access, no async call needed)
   // Get Start Time
   promises.push(
    new Promise((resolve) => {
      item.start.getAsync((result) => {
        if (result.status === Office.AsyncResultStatus.Succeeded) {
          appointmentData.startTime = new Date(result.value);
        }
        resolve();
      });
    })
  );

  // Get End Time
  promises.push(
    new Promise((resolve) => {
      item.end.getAsync((result) => {
        if (result.status === Office.AsyncResultStatus.Succeeded) {
          appointmentData.endTime = new Date(result.value);
        }
        resolve();
      });
    })
  );

  // Fetch Attendees
    promises.push(
      new Promise((resolve) => {
        item.requiredAttendees.getAsync((result) => {
          if (result.status === Office.AsyncResultStatus.Succeeded) {
            appointmentData.attendees = result.value.map((attendee) => ({
              email: attendee.emailAddress,
              name: attendee.displayName,
            }));
          }
          resolve(); // Ensure promise resolves
        });
      })
    );

    promises.push(
      new Promise((resolve) => {
        item.location.getAsync((result) => {
          if (result.status === Office.AsyncResultStatus.Succeeded) {
            appointmentData.location = result.value;
          }
          resolve(); // Ensure promise resolves
        });
      })
    );

  // Wait for all async operations to complete
  await Promise.all(promises);

  return appointmentData;
},


    getSubjectAsync:async () => {
      return new Promise((resolve, reject) => {
          Office.context.mailbox.item.subject.getAsync((result) => {
              if (result.status === Office.AsyncResultStatus.Succeeded) {
                  resolve(result.value);
              } else {
                  reject(new Error(`Failed to get subject: ${result.error.message}`));
              }
          });
      });
  },
  
    /**
     * Show a notification in Outlook
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     */
    showNotification: async (title, message) => {
      Office.context.mailbox.item.notificationMessages.replaceAsync(
        "notification",
        {
          type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
          message: message,
          icon: "iconid",
          persistent: true  // Change to true for better visibility in OWA
        },
        function (asyncResult) {
          if (asyncResult.status === Office.AsyncResultStatus.Failed) {
            console.error("Notification Error:", asyncResult.error.message);
          } else {
            console.log("Notification added successfully");
          }
        }
      );
    }

  };
  
  export default OfficeService;
  