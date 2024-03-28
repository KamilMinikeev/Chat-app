// Chat.js
import React, { useState, useEffect } from "react";

import ChatHeader from "./ChatHeader";
import ChatContent from "./ChatContent";
import ChatMessage from "./ChatMessage";

const Chat = ({
  activeUser,
  activeChat,
  messages,
  chats,
  submitMessage,
  isNewChat,
  roomId,
}) => {
  return (
    <div className="chat">
      <ChatHeader activeUser={activeUser} />
      <ChatContent messages={messages} />
      <ChatMessage
        submitMessage={submitMessage}
        activeUser={activeUser}
        activeChat={activeChat}
        isNewChat={isNewChat}
        messages={messages}
        chats={chats}
        roomId={roomId}
      />
    </div>
  );
};

export default Chat;
