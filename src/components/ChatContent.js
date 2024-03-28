import React, { useEffect, useRef } from "react";
import { useUser } from "../context/UserContext";

const ChatContent = ({ messages }) => {
  const { user } = useUser();

  const chatContentRef = useRef();

  // Эффект для прокрутки вниз при добавлении нового сообщения
  // пока не настроил
  // useEffect(() => {
  //   if (chatContentRef.current) {
  //     chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
  //   }
  // }, [messages]);

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop =
        chatContentRef.current.scrollHeight - 200;
    }
  }, [messages]);

  return (
    <div className="chat-content" ref={chatContentRef}>
      <div className="chat-content__messages">
        {messages.length > 0 &&
          messages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.sender.id === user.id ? "sender" : "recipient"
              }`}
            >
              <div style={{ whiteSpace: "pre-line" }}>{message.payload}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChatContent;
