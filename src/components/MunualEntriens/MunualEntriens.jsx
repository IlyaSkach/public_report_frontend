import React, { useState, useEffect } from "react";
import "./MunualEntriens.scss";
import { format } from "date-fns";
import SideBar from "../SideBar/SideBar";
import Header from "../Header/Header";
import { UserProvider } from "../Header/UserContext";

const MunualEntriens = () => {
  const [name, setGroupName] = useState("");
  const [date, setPurchaseDate] = useState("");
  const [value, setPrice] = useState("");
  const [select, setSelect] = useState([]);
  const [publicId, setPublicId] = useState("");
  const [entries, setEntries] = useState([]);

  const deleteEntriens = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:3001/entries/${id}`, // http://5.35.29.249:3001/data/users/${userId}
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Ошибка при удалении пользователя");
      }
      // Обновление списка пользователей после удаления
      setEntries(entries.filter((entries) => entries.id !== id));
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formattedPurchaseDate = date
      ? format(new Date(date), "yyyy-MM-dd")
      : "";
    const formData = {
      name,
      value,
      date: formattedPurchaseDate,
      publicId,
    };

    console.log("Отправляемые данные:", formData);

    try {
      const response = await fetch("http://127.0.0.1:3001/addMunual", {
        // "http://5.35.29.249:3001/addMunual"
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Ошибка при отправке данных: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const result = await response.json();
      console.log("Успешно:", result);
      const newEntry = {
        id: result.id,
        name,
        date: formattedPurchaseDate,
        value,
      };

      // Добавляем новое размещение в начало массива и обрезаем его до последних трех элементов
      const updatedEntries = [newEntry, ...entries].slice(0, 3);

      setEntries(updatedEntries);
    } catch (error) {
      console.error("Ошибка:", error);
      if (error.response) {
        console.error("Статус ответа:", error.response.status);
        error.response
          .text()
          .then((text) => console.error("Тело ответа:", text));
      } else {
        console.error("Ошибка не связана с ответом сервера.");
      }
    }
  };
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch("http://127.0.0.1:3001/socialNames"); //  "http://5.35.29.249:3001/socialNames"
        if (!response.ok) {
          throw new Error(
            `Ошибка при получении данных: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        console.log("Прилетает список пабликов:", data);

        const selectOptions = data.map((item) => ({
          value: item.name,
          label: item.name,
          publicId: item.id,
        }));
        setSelect(selectOptions);
      } catch (error) {
        console.error("Ошибка при выполнении запроса:", error.message);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:3001/entries");
        if (!response.ok) {
          throw new Error("Ошибка при запросе данных");
        }
        let data = await response.json();
        // Фильтрация данных, оставляем только записи с type === 1
        data = data.filter((entry) => entry.type === 1);
        // Сортировка по дате
        data = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        // Получение последних трех записей
        data = data.slice(0, 3);
        setEntries(data);
      } catch (error) {
        console.error("Ошибка:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <UserProvider>
        <Header />
      </UserProvider>
      <section className="munual">
        <SideBar />

        <form onSubmit={handleSubmit}>
          <h1 title="">Добавить ручное размещение</h1>
          <div class="group">
            <label for="">Название паблика:</label>
            <select
              id="publicSelect"
              placeholder="Выбирите паблик"
              value={name}
              // onChange={(e) => setGroupName(e.target.value)}
              onChange={(e) => {
                const selectedOption = select.find(
                  (option) => option.value === e.target.value
                );
                setGroupName(selectedOption.label); // Сохраняем имя для отображения
                setPublicId(selectedOption.publicId); // Сохраняем id для отправки на сервер
              }}
            >
              <option>Выбирите паблик</option>
              {select.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div class="group">
            <label for="">Дата размещения:</label>
            <input
              type="date"
              placeholder="Укажите дату размещения"
              value={date}
              onChange={(e) => setPurchaseDate(e.target.value)}
            />
          </div>
          <div class="group">
            <label for="">Стоимость:</label>
            <input
              type="number"
              placeholder="Укажите стоимость"
              value={value}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div class="group">
            <center>
              <button type="submit">Добавить</button>
            </center>
          </div>
          <style></style>
        </form>
      </section>
      <div class="munual">
        <table class="responsive-table">
          <caption>Последнии 3 размещения</caption>
          <thead>
            <tr>
              <th scope="col">Название</th>
              <th scope="col">Дата</th>
              <th scope="col">Сумма</th>
              <th scope="col">Удалить</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <th scope="row">{entry.name}</th>
                <td>{format(new Date(entry.date), "dd.MM.yyyy")}</td>
                <td>{entry.value}</td>
                <td>
                  <button
                    className="registration__button"
                    onClick={() => deleteEntriens(entry.id)}
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
};

export default MunualEntriens;
