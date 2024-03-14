import React, { useState, useEffect } from "react";
import Header from "./Header";
import Chats from "./Chats";
import SearchChats from "./SearchChats";

import axios from "axios";

const Sidebar = ({ handleChatUser, chats, setNewChat }) => {
  // const [users, setUsers] = useState([]);
  const [users, setUsers] = useState([
    {
      id: "1",
      username: "Kamil",
      bio: "",
    },
    {
      id: "2",
      username: "Rustam",
      bio: "",
    },
    {
      id: "3",
      username: "Aliya",
      bio: "",
    },
    {
      id: "4",
      username: "Andrey",
      bio: "",
    },
    {
      id: "5",
      username: "Svetlana",
      bio: "",
    },
  ]);

  const [searchInput, setSearchInput] = useState("");

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:8080/api/v1/users");

  //       if (response.status >= 200 && response.status < 300) {
  //         setUsers(response.data);
  //       } else {
  //       }
  //     } catch (error) {
  //       console.error("Ошибка запроса:", error);
  //     }
  //   };
  const handleSearchChange = (value) => {
    setSearchInput(value);
  };

  const chatUser = (user) => {
    setSearchInput("");
    handleChatUser(user);
  };

  return (
    <div className="sidebar">
      <Header onSearchChange={handleSearchChange} searchInput={searchInput} />
      <div className="sidebar__content">
        {searchInput.length > 0 ? (
          <SearchChats
            users={users}
            searchInput={searchInput}
            chatUser={chatUser}
          />
        ) : (
          <Chats chats={chats} setNewChat={setNewChat} />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
