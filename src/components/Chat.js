// Chat.js
import React, { useState, useEffect } from "react";

import ChatHeader from "./ChatHeader";
import ChatContent from "./ChatContent";
import ChatMessage from "./ChatMessage";
import ChatModal from "./ChatModal";

const Chat = ({ activeUser, activeChat, messages, submitMessage }) => {
  const [isModalOpened, setIsModalOpened] = useState(false);

  const openModal = (file) => {
    console.log(file);
    setIsModalOpened(true);
  };

  const closeModal = () => {
    setIsModalOpened(false);
  };

  return (
    <div className="chat">
      <ChatHeader activeUser={activeUser} />
      <ChatContent messages={messages} activeChat={activeChat} />
      <ChatMessage submitMessage={submitMessage} openModal={openModal} />
      <ChatModal isModalOpened={isModalOpened} closeModal={closeModal} />
    </div>
  );
};

export default Chat;
