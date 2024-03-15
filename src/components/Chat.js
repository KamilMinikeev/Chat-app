// Chat.js
import React, { useState, useEffect } from "react";

import ChatHeader from "./ChatHeader";
import ChatContent from "./ChatContent";
import ChatMessage from "./ChatMessage";

const Chat = ({ activeUser, messages, submitMessage }) => {
  return (
    <div className="chat">
      <ChatHeader activeUser={activeUser} />
      <ChatContent messages={messages} />
      <ChatMessage submitMessage={submitMessage} activeUser={activeUser} />
    </div>
  );
};

export default Chat;
