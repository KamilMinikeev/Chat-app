import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";

const Home = () => {
  const [searchedUser, setSearchedUser] = useState({});
  const handleChatUser = (user) => {
    setSearchedUser(user);
    localStorage.setItem("searchedUser", JSON.stringify(user));
  };

  const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("searchedUser");
    if (savedUser) {
      setSearchedUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <div className="home">
      <Sidebar handleChatUser={handleChatUser} />
      <div className="chat-inner">
        {!isEmptyObject(searchedUser) ? <Chat user={searchedUser} /> : ""}
      </div>
    </div>
  );
};

export default Home;
