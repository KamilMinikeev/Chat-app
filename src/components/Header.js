import React from "react";
import Search from "./Search";

import MenuIcon from "@mui/icons-material/Menu";

const Header = ({ users, onSearchChange, searchInput }) => {
  return (
    <div className="header">
      <button className="header__menu">
        <i>{<MenuIcon />}</i>
      </button>
      <Search onSearchChange={onSearchChange} searchInput={searchInput} />
    </div>
  );
};

export default Header;
