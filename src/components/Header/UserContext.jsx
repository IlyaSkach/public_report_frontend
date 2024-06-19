import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Состояние для хранения текущего пользователя

	useEffect(() => {
		const fetchUser = async () => {
			try {
				// Извлекаем токен JWT из localStorage
				const token = localStorage.getItem('token');
				if (!token) {
					console.error('Токен не найден. Пользователь не аутентифицирован.');
					// Здесь можно добавить логику перенаправления на страницу входа
					return; // Прекращаем выполнение функции, если токен отсутствует
				}
				const response = await fetch("http://5.35.29.249:3001/api/user", {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				});
				const userData = await response.json();
				if (response.ok) {
					setUser(userData.username); // Установка данных пользователя
					console.log("Посмотреть", userData);
				} else {
					throw new Error('Ошибка при получении данных пользователя');
				}
			} catch (error) {
				console.error('Ошибка при запросе данных пользователя:', error);
			}
		};
	
		fetchUser();
	}, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};