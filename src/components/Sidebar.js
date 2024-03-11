import React, { useState, useEffect } from "react";
import Header from "./Header";
import Chats from "./Chats";
import SearchChats from "./SearchChats";

import axios from "axios";

const Sidebar = ({ handleChatUser }) => {
  // const [users, setUsers] = useState([]);
  const [users, setUsers] = useState([
    {
      username: "Kamil",
      id: "1",
      url: "http://cdn1.flamp.ru/a992cfb02dd71b2dc22b2f577067ddd8.jpg",
    },
    {
      username: "Rustam",
      id: "2",
      url: "https://mykaleidoscope.ru/x/uploads/posts/2022-10/1666240926_15-mykaleidoscope-ru-p-grustnii-i-veselii-chelovek-instagram-20.jpg",
    },
    {
      username: "Aliya",
      id: "3",
      url: "https://w.forfun.com/fetch/ea/eaa626bfeedf4b90cb715b2c5b311477.jpeg",
    },
  ]);

  const [searchInput, setSearchInput] = useState("");

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get("");
  //       setUsers(response.data);
  //     } catch (error) {
  //       console.error("Ошибка получения пользователей:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

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
          <Chats />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
