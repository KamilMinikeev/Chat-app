import React from "react";

import ChatHeader from "./ChatHeader";
import ChatContent from "./ChatContent";
import ChatMessage from "./ChatMessage";

const Chat = ({ user }) => {
  return (
    <div className="chat">
      <ChatHeader user={user} />
      <ChatContent />
      <ChatMessage />
    </div>
  );
};

export default Chat;
