Office.onReady((info) => {
    if (info.host === Office.HostType.Outlook) {
        console.log("Runtime loaded for event handlers");
        Office.actions.associate("onMessageSendHandler", onMessageSendHandler);
    }
});

/**
 * Function to handle OnMessageSend event.
 * @param {Office.AsyncEvent} event
 */
function onMessageSendHandler(event) {
    console.log("onMessageSendHandler triggered");

    const item = Office.context.mailbox.item;

    if (!item.subject || item.subject.trim() === "") {
        event.completed({ allowEvent: false, errorMessage: "Subject cannot be empty." });
        return;
    }

    event.completed({ allowEvent: true });
}
