import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Registration.css"

function Registration() {
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [login, setLogin] = useState("");
  const [errorMessage, setText] = useState("");

  const handleCreateNew = (event) => {
    if (login === password) {
      setText("Логин должен отличаться от пароля");
      return;
    }
    event.preventDefault();

    axios
      .post("https://localhost:7166/Authorization/Register", {//1-user, 2 - admin
        login,
        password,
        passwordRepeat
      })
      .then((response) => {
        if (response.status === 200) {
          setText(response.data);
        }
      })
      .catch((error) => {
        console.error(error.response.data);
        setText(error.response.data);
      });
  };

  return (
    <>
      <div className="container">
        <div className="login">
          <div className="container">
            <h1>Регистрация</h1>
            <input
              className="input"
              type="email"
              placeholder="Логин"
              value={login}
              maxLength={30}
              onChange={(event) => setLogin(event.target.value)}
            /><br></br>
            <input
              className="input"
              type="password"
              placeholder="Пароль"
              maxLength={30}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            /><br></br>
            <input
              className="input"
              type="password"
              placeholder="Повторите пароль"
              maxLength={30}
              value={passwordRepeat}
              onChange={(event) => setPasswordRepeat(event.target.value)}
            /><br></br>
            <button onClick={handleCreateNew}>Зарегистрироваться</button>
            <div className="clearfix"></div>
            <span className="copyright">&copy;2024</span>
            <p className="errorMess">{errorMessage}</p>
          </div>
        </div>

        <div className="register">
          <div className="container">
            <div>
              <h2>Ты сможешь:</h2>
              <div>
                <p> - Просматривать показатели товара</p>
                <p> - Подписываться на товар</p>
                <p> - Анализировать цену</p>
                <p> - Получать платный анализ</p>
              </div>
            </div>

            <Link to="/authorization">
              <button>Авторизация</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Registration;
