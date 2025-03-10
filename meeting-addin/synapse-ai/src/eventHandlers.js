// src/eventHandlers.js
function preSaveSend(event) {
    try {

        console.log("inside presend");
        
        event.completed({ allowEvent: false });

        //saving...


    } catch (error) {
        console.error("Error in preSaveSend:", error);
        event.completed({ allowEvent: false });
    }
}

// Ensure it's accessible globally
window.preSaveSend = preSaveSend;
