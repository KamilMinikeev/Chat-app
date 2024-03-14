import React from "react";

const ChatHeader = ({ activeUser }) => {
  return (
    <div className="chat-header">
      {activeUser && (
        <div className="chat-header__user">
          <div className="chat-header__user-img">
            {activeUser.username && (
              <>
                {activeUser.username.charAt(0).toUpperCase()}
                {activeUser.url && <img src={activeUser.url} alt="" />}
              </>
            )}
          </div>
          <div className="chat-header__user-info">
            {activeUser.username && (
              <h3 className="chat-header__user-title">{activeUser.username}</h3>
            )}
            <p className="chat-header__user-status">last seen recently</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
