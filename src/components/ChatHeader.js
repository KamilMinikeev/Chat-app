import React from "react";

const ChatHeader = ({ user }) => {
  return (
    <div className="chat-header">
      <div className="chat-header__user">
        <img src={user.url} alt="" className="chat-header__user-img" />
        <div className="chat-header__user-info">
          <h3 className="chat-header__user-title">{user.username}</h3>
          <p className="chat-header__user-status">last seen recently</p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
