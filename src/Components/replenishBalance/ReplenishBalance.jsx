import React, { useState, useContext } from "react";
import axios from "axios";
import './ReplenishBalance.css';
import CreditCardList from "../CreditCardList/CreditCardList";
import { AuthContext } from "../../providers/AuthProvider";

function ReplenishBalance() {
  const [text, setText] = useState("");
  const { user, setUser } = useContext(AuthContext);
  const [sumOfDep1, setSumOfDep1] = useState("");

  function handleReplenish(userId) {
    if(sumOfDep1==="")
    {
      setText("Введите сумму пополнения");
      return;
    };
    const requestData = {
      id: userId,
      sumOfDep: sumOfDep1
    };
    axios.get("https://localhost:7166/User/GetCountOfCards?id=" + user.id)
      .then(response => {
        if (response.data) {
          axios.put("https://localhost:7166/User/ReplenishBalance", requestData)
            .then(response => {
              // Обработка успешного ответа от сервера
              console.log(response.data);
              setUser(prevUser => ({
                ...prevUser,
                balance: prevUser.balance + parseInt(sumOfDep1)
              }));
            })
            .catch(error => {
              // Обработка ошибки запроса
              console.log(error);
            });
        } else {
          setText("Сначала добавьте карту");
        }
      })
      .catch(error => {
        console.log(error);
        setText(error.response.data);
      });
  }

  return (
    <div className="replBlock">
      <h1 className="cardHeading">Пополнить баланс</h1>
      <input
        placeholder="Введите сумму депозита"
        maxLength="3"
        className="inputSum"
        onKeyPress={(e) => {
          const keyCode = e.which || e.keyCode;
          const isValidInput = /^[0-9]+$/.test(String.fromCharCode(keyCode));
          if (!isValidInput) {
            e.preventDefault();
          }
        }}
        onChange={(e) => {
          const value = e.target.value;
          
            setSumOfDep1(value);
          
        }}
      />
      <button className="replenishButt" onClick={() => handleReplenish(user.id)}>Пополнить</button>
      <CreditCardList />
      <h3>{text}</h3>
    </div>
  );
}

export default ReplenishBalance;