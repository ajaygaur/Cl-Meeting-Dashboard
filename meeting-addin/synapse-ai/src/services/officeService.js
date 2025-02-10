// officeService.js - Handles Office.js interactions

/* global Office */
const OfficeService = {
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
            customProperties.set("MeetingDetails", JSON.stringify(meetingData));
      
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
  