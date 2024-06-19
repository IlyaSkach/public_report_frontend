import React, { useState, useEffect } from "react";
import SideBar from "../SideBar/SideBar";
import "./Registration.scss";
import Header from "../Header/Header";
import { UserProvider } from "../Header/UserContext";

function Regestration() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [users, setUsers] = useState([]);

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(
        `https://5.35.29.249:3001/data/users/${userId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Ошибка при удалении пользователя");
      }
      // Обновление списка пользователей после удаления
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
    }
  };

  useEffect(() => {
    // Шаг 2: Выполнение запроса при монтировании компонента
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://5.35.29.249:3001/data/users");
        if (!response.ok) {
          throw new Error("Сетевой запрос за пользователями не удался");
        }
        const usersData = await response.json();
        setUsers(usersData); // Шаг 3: Обновление состояния данными пользователей
      } catch (error) {
        console.error("Ошибка при получении пользователей:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Отправляемые данные:", { username, password, role });
    try {
      const response = await fetch("https://5.35.29.249:3001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, role }),
      });
      if (!response.ok) {
        throw new Error("Сетевой запрос не удался");
      }
      await response.json();
      alert("Регистрация прошла успешно!");
    } catch (error) {
      console.error("Ошибка:", error);
      if (error.message === "Failed to fetch") {
        alert(
          "Ошибка при отправке данных на сервер. Проверьте, доступен ли сервер и настроен ли CORS."
        );
      } else {
        alert("Отправлено");
      }
    }
  };

  return (
    <>
      <UserProvider>
        <Header />
      </UserProvider>
      <section className="registration">
        <SideBar />
        <form className="registration__form" onSubmit={handleSubmit}>
          <h1 className="registration__title">Регистрация</h1>
          <div className="registration__input">
            <label htmlFor="username">Имя пользователя:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="registration__input">
            <label htmlFor="password">Пароль:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="registration__group">
            <label for="">Роль пользователя:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)} // Обновление состояния при выборе роли
              required
            >
              <option value="">Выберите роль</option>
              <option value="Инвестор">Инвестор</option>
              <option value="Менеджер">Менеджер</option>˝
            </select>
          </div>
          <button className="" type="submit">
            Зарегистрироваться
          </button>
        </form>
      </section>
      <div class="registration">
        <table class="responsive-table">
          <caption>Пользователи</caption>
          <thead>
            <tr>
              <th scope="col">Имя пользователя</th>
              <th scope="col">Роль</th>
              <th scope="col">Удалить</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <th scope="row">{user.username}</th>
                <td>{user.role}</td>
                <td>
                  <button
                    className="registration__button"
                    onClick={() => deleteUser(user.id)}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 7H20"
                        stroke="black"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M10 11V17"
                        stroke="black"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M14 11V17"
                        stroke="black"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M5 7L6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19L19 7"
                        stroke="black"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M9 7V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7"
                        stroke="black"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Regestration;
