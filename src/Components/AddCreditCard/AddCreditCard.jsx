import React, { useState, useContext } from "react";
import './AddCreditCard.css';
import CreditCardList from "../CreditCardList/CreditCardList";
import { AuthContext } from "../../providers/AuthProvider";
import axios from "axios";

function AddCard() {
  const [errorMessage, setText] = useState('');
  const { user } = useContext(AuthContext);
  const [cardNumber, setCardNumber] = useState("");
  const [validThru, setValidThru] = useState("");
  const [owner, setOwner] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardAdded, setCardAdded] = useState(0);

  function handleAdd(userId) {
    const requestData = {
        id: userId,
        cardNumber: cardNumber,
        name: owner,
        goodTrue: validThru,
        cvv: cvv
      };
    axios.post('https://localhost:7166/User/AddCreditCard', requestData)
      .then(response => {
        console.log(response.data);
        if (response.status === 200) {
            setText("Карта успешно добавлена" );
            setCardAdded(cardAdded + 1);
        }
      })
      .catch(error => {
        console.error(error.response.data);
        setText(error.response.data);
      });
  }

  return (
    <div className="addCardBlock">
      <h1 className="cardHeading">Список кредитных карт:</h1>
      <CreditCardList cardAdded={cardAdded} />
      <h1 className="cardHeading">Добавить новую карту:</h1>
      <div>
        <input
          placeholder="Номер карты"
          className="inputNumberCard"
          maxLength="16"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        /><br />
        <input
          placeholder="Срок действия"
          className="validTrue"
          maxLength="5"
          value={validThru}
          onChange={(e) => {
            const input = e.target.value;
            let formattedInput = input;

            if (input.length === 2 && input.charAt(1) !== "/") {
              // Добавляем "/" между вторым и третьим символами
              formattedInput = input.slice(0, 2) + "/" + input.slice(2);
            } else if (input.length === 3 && input.charAt(2) === "/") {
              // Удаляем "/" если он находится на третьей позиции
              formattedInput = input.slice(0, 2) + input.slice(3);
            }

            setValidThru(formattedInput);
          }}
      /><br />
        <input
          placeholder="Имя держателя"
          className="inputNameOfOwner"
          maxLength="30"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
        />
        <input
          placeholder="CVV"
          className="cvv"
          maxLength="3"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          onKeyPress={(e) => {
            const keyCode = e.which || e.keyCode;
            const isValidInput = /^[0-9]+$/.test(String.fromCharCode(keyCode));
            if (!isValidInput) {
              e.preventDefault();
            }
          }}
        /><br />
        <button onClick={() => handleAdd(user.id)} className="addButt"> Добавить</button>
      </div>
      <h3 className="errorText1">{errorMessage}</h3>
    </div>
  );
}

export default AddCard;