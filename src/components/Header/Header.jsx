import React, { useEffect } from "react";
import { useUser } from "./UserContext"; 
import "./Header.scss";

const Header = () => {
  const { user } = useUser(); 

  useEffect(() => {
    console.log("Имя", user);
  }, [user]);

  return (
    <>
      <header className="header">
        <div className="header__title">
          Пользователь: <span className="header__user">{user}</span>
        </div>
      </header>
    </>
  );
};

export default Header;
