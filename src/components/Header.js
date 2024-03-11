import React from "react";
import Search from "./Search";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const menuIcon = <FontAwesomeIcon icon={faBars} />;

const Header = ({ users, onSearchChange, searchInput }) => {
  return (
    <div className="header">
      <button className="header__menu">
        <i>{menuIcon}</i>
      </button>
      <Search onSearchChange={onSearchChange} searchInput={searchInput} />
    </div>
  );
};

export default Header;
