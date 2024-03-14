import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

const Search = ({ onSearchChange, searchInput }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    onSearchChange(value);
  };

  const handleFocus = (e) => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="search-inner">
      <i className={isFocused ? "active" : ""}>{<SearchIcon />}</i>
      <input
        className="search-input"
        type="text"
        placeholder="Search"
        value={searchInput}
        onChange={handleSearchChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default Search;
