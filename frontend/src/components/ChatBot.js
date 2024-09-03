import React, { useState } from 'react';

function ChatBot() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <textarea
        value={message}
        onChange={handleMessageChange}
        placeholder="Ask the bot anything about HVAC, plumbing, electrical, etc."
      />
      <button onClick={handleSendMessage}>Send</button>
      <p>Response: {response}</p>
    </div>
  );
}

export default ChatBot;
