import React, { useState, useEffect } from "react";

const SearchChats = ({ users, searchInput, chatUser }) => {
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchInput, users]);

  return (
    <div className="search-chats">
      {filteredUsers.length > 0 ? (
        <ul className="search-chats__list">
          {filteredUsers.map((user) => (
            <li
              onClick={() => chatUser(user)}
              className="search-chats__item"
              key={user.id}
            >
              <img className="search-chats__item-img" src={user.url} alt="" />
              <div className="search-chats__item-info">
                <h3 className="search-chats__item-title">{user.username}</h3>
                <p className="search-chats__item-text">{user.id}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No Results</p>
      )}
    </div>
  );
};

export default SearchChats;
