import React, { useState } from "react";
import axios from "axios";
import './ItemComp.css';
import AddPhotoBlock from "../AddPhotoBlock/AddPhotoBlock";

function ItemComp(props) {
  const itemId = props.id;
  const [newPrice, setNewPrice] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [text, setText] = useState("");
  const [expertView, setExpertView] = useState("");
  const [expertViewPrice, setExpertViewPrice] = useState("");
  
  function handleChangePrice() {
    if (!newPrice) {
      setText("Пожалуйста, введите новую цену.");
      return;
    }

    if (isNaN(newPrice)) {
      setText("Пожалуйста, введите числовое значение для цены.");
      return;
    }

    const requestData = {
      id: itemId,
      price: newPrice
    };

    axios
      .put("https://localhost:7166/Admin/changePriceOfItem", requestData)
      .then(() => {
        setText("Цена успешно изменена.");
        props.onUpdate(); // Обновление списка услуг в родительском компоненте
        // Additional logic if needed after successful price update
      })
      .catch((error) => {
        console.log(error.response.data);
        setText(error.response.data);
      });
  }
  
  function handleChangeQuantity() {
    if (!newQuantity) {
      setText2("Пожалуйста, введите новое количетсво.");
      return;
    }

    if (isNaN(newQuantity)) {
      setText2("Пожалуйста, введите числовое значение для количества.");
      return;
    }

    const requestData = {
      id: itemId,
      quantity: newQuantity
    };

    axios
      .put("https://localhost:7166/Admin/ChangeQuantityOfItem", requestData)
      .then(() => {
        setText2("Количество успешно изменена.");
        props.onUpdate(); // Обновление списка услуг в родительском компоненте
        // Additional logic if needed after successful price update
      })
      .catch((error) => {
        console.log(error.response.data);
        setText2(error.response.data);
      });
  }
  function handleChangeExpert() {
    if (!expertView || !expertViewPrice) {
      setText1("Пожалуйста, заполните все поля.");
      return;
    }

    if (isNaN(expertViewPrice)) {
      setText1("Пожалуйста, введите числовое значение для цены анализа.");
      return;
    }

    const requestData = {
      itemId: itemId,
      newView: expertView,
      newPriceOfView: expertViewPrice
    };

    axios
      .put("https://localhost:7166/Admin/editExpertView", requestData)
      .then((response) => {
        setText1(response.data);
        props.onUpdate(); // Обновление списка услуг в родительском компоненте
      })
      .catch((error) => {
        console.log(error.response.data);
        setText1(error.response.data);
      });
  }

  return (
    <>
      <div className="actionsBlock">
        <span className="changePriceBlock">
          <h3>Изменить цену</h3>
          <input
            placeholder="Введите новую цену"
            className="inputPriceField"
            maxLength="3"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
          />
          <button onClick={handleChangePrice}>Изменить</button>
          <h5>{text}</h5>
        </span>
        <span className="changeExpertBlock">
          <h3>Изменить платный анализ</h3>
          <textarea
            placeholder="Введите платный анализ"
            className="addItemInput"
            maxLength="100"
            value={expertView}
            onChange={(e) => setExpertView(e.target.value)}
          />
          <input
            placeholder="Введите цену анализа"
            className="addPriceViewInput"
            maxLength="3"
            value={expertViewPrice}
            onChange={(e) => setExpertViewPrice(e.target.value)}
          />
          <button onClick={handleChangeExpert}>Изменить</button>
          <h5>{text1}</h5>
        </span>
      </div>

      <div className="actionsBlock">
        <span className="changePriceBlock">
          <h3>Изменить количество</h3>
          <input
            placeholder="Введите новое количество"
            className="inputPriceField"
            maxLength="3"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
          />
          <button onClick={handleChangeQuantity}>Изменить</button>
          <h5>{text2}</h5>
        </span>
        <span className="changeExpertBlock">
        <AddPhotoBlock objectId={itemId} role={3} />
  
        </span>
      </div>
    </>
  );
}

export default ItemComp;