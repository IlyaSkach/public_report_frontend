import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.scss";

function LoginForm({ onAuthenticate }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:3001/login", { //  "http://5.35.29.249:3001/login"
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token); 
        onAuthenticate(true);
        navigate("/main");
        setUsername("");
        setPassword("");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Ошибка авторизации:", error);
      alert(
        "Ошибка авторизации. Пожалуйста, проверьте ваше соединение и попробуйте снова."
      );
    }
  };

  return (
    <>
      <section className="enter">
        <form className="enter__form" onSubmit={handleSubmit}>
          <h1 className="enter__title">Вход</h1>
          <div className="enter__input">
            <label htmlFor="username">Имя пользователя:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="enter__input">
            <label htmlFor="password">Пароль:</label>
            <input
              placeholder="Введите пароль"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="enter__button" type="submit">
            Войти
          </button>
        </form>
      </section>
    </>
  );
}

export default LoginForm;
