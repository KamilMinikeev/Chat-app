import React, { useState } from "react";

const Chats = ({ chats, setNewChat, activeUser }) => {
  const [activeChat, setActiveChat] = useState(null);

  const chatClick = (index, chat) => {
    setActiveChat(index === activeChat ? null : index);
    setNewChat(chat);
  };

  return (
    <div className="chats">
      {chats.map((chat, index) => (
        <div
          key={index}
          className={`chats__item ${
            activeUser.id === chat.recipient.id ? "active" : ""
          }`}
          onClick={() => chatClick(index, chat)}
        >
          <div className="chats__item-img">
            {chat.recipient.username.charAt(0).toUpperCase()}
            {chat.recipient.url !== undefined ? (
              <img src={chat.sender.url} alt="" />
            ) : (
              ""
            )}
          </div>
          <div className="chats__item-info">
            <h3 className="chats__item-title">{chat.recipient.username}</h3>
            <p className="chats__item-text">{chat.lastMessage}</p>
          </div>
          <div className="chats__item-messages">
            <p className="chats__item-data">17:29</p>
            <div className="chats__item-kol">24</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
