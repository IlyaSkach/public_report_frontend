import React, { useEffect } from "react";
import { useUser } from "./UserContext"; // Импортируйте хук useUser
import "./Header.scss";

const Header = () => {
  const { user } = useUser(); // Используйте хук для доступа к текущему пользователю

  useEffect(() => {
    console.log("Имя", user);
  }, [user]);

  // Функция для отображения имени пользователя или "Гость", если user не определен
  // const renderUserName = () => {
  //   if (user && user.name) {
  //     return user.name;
  //   }
  //   return "Гость";
  // };

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
