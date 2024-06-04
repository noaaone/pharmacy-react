import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import "./CreditCardList.css";
import axios from "axios";

function CreditCardList({ cardAdded }) {
  const { user } = useContext(AuthContext);
  const [creditCardList, setCreditCardList] = useState([]);
  const [number, setNumber] = useState(0);

  useEffect(() => {
    fetchCreditCards();

    // Обновление списка карт при изменении состояния cardAdded
    if (cardAdded) {
      setNumber(0); // Сброс номера текущей карты
      fetchCreditCards();
    }
    // eslint-disable-next-line
  }, [user.id, cardAdded]);

  function fetchCreditCards() {
    axios
      .get("https://localhost:7166/Test/GetUserCards?id=" + user.id)
      .then((response) => {
        setCreditCardList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (!creditCardList) {
    return <p>Loading...</p>; // Отобразить загрузку, пока данные не загружены
  }

  if (creditCardList.length === 0) {
    return <p>Вы еще не добавили кредитные карты</p>; // Отобразить сообщение, если нет доступных карт
  }

  const cardNumber = creditCardList[number].cardNumber;
  const dateThru = creditCardList[number].dateThru;
  const name = creditCardList[number].name;
  const cardType = getCardType(cardNumber);

  function getCardType(cardNumber) {
    // Удаление всех пробелов из номера карты
    const cleanedCardNumber = cardNumber.replace(/\s/g, "");

    // Определение типа карты по первым цифрам
    const firstDigit = parseInt(cleanedCardNumber.charAt(0));
    const secondDigit = parseInt(cleanedCardNumber.charAt(1));

    if (firstDigit === 4) {
      return "Visa";
    } else if (
      (firstDigit === 5 && secondDigit >= 1 && secondDigit <= 5) ||
      (firstDigit === 2 && secondDigit >= 2 && secondDigit <= 7)
    ) {
      return "MasterCard";
    } else {
      return "Unknown";
    }
  }

  let logoSrc = "";
  if (cardType === "Visa") {
    logoSrc = "/images/visa.png";
  } else if (cardType === "MasterCard") {
    logoSrc = "/images/masterCard.png";
  } else {
    logoSrc = "/images/unknown.png";
  }

  function handleNext() {
    if (number < creditCardList.length - 1) {
      setNumber(number + 1);
    }
  }

  function handlePrevius() {
    if (number > 0) {
      setNumber(number - 1);
    }
  }

  return (
    <>
      <div className="cardsList">
        <div className="navigators">
            <img src="/images/previous.png" alt="Предыдущая карта" className="previous"  onClick={handlePrevius}/>
        </div>

        <div className="creditCard">
          <img src="/images/chip.png" className="chip" alt="Чип" />
          <p className="cardNumber">{cardNumber}</p>

          <div className="cardFooter">
            <div className="valid">
              <p>VALID</p>
              <p>THRU</p>
            </div>
            <p className="dateThru">{dateThru}</p>
          </div>
          <p className="name">{name}</p>
          <img src={logoSrc} className="visa" alt="VISA" />
        </div>
        <div className="navigators">
            <img src="/images/next.png" alt="Следующая карта" className="next" onClick={handleNext}/>
        </div>
      </div>
    </>
  );
}

export default CreditCardList;
