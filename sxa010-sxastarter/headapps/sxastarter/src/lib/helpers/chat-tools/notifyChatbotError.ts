async function notifyChatbotError(error: any, reqBody: any) {
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Chatbot Alerts <alerts@chartwellquebec.ca>",
      to: ["nzeleniak@chartwell.com"],
      subject: "Chatbot Error on Website",
      html: `
        <h2>Chatbot Error</h2>
        <p><strong>Error:</strong> ${error?.message || "Unknown error"}</p>
        <p><strong>Page:</strong> ${reqBody?.tracking?.page_url || "Unknown"}</p>
        <p><strong>Session:</strong> ${reqBody?.tracking?.session_id || "Unknown"}</p>
        <p><strong>Message:</strong> ${reqBody?.message || "No message"}</p>
        <pre>${JSON.stringify(error, null, 2)}</pre>
      `,
    }),
  });
}

export default notifyChatbotError;
