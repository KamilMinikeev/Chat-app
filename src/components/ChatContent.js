import React, { useEffect, useRef } from "react";
import { useUser } from "../context/UserContext";

const ChatContent = ({ messages }) => {
  const { user } = useUser();

  const chatContentRef = useRef();

  // Эффект для прокрутки вниз при добавлении нового сообщения
  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-content" ref={chatContentRef}>
      {messages.length > 0
        ? messages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.senderId === user.id ? "sender" : "recipient"
              }`}
            >
              {message.message}
            </div>
          ))
        : ""}
    </div>
  );
};

export default ChatContent;
