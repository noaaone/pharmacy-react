import React, { useEffect, useState } from "react";
import "./ManageItems.css";
import axios from "axios";
import ItemComp from "../ItemComp/ItemComp";

function ManageItems() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expertView, setExpertView] = useState("");
  const [expertViewPrice, setExpertViewPrice] = useState("");
  const [manufacturerId, setManufacturerId] = useState("");
  const [text, setText] = useState("");
  const [icons, setIcons] = useState({});
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    axios
      .get("https://localhost:7166/User/getItemList")

      .then((response) => {
        initializeIcons(response.data);
        setItems(response.data)
      })
      .catch((error) => console.log(error.response.data));
  }, []);

  function initializeIcons(itemList) {
    const iconsData = {};
    itemList.forEach((item) => {
      iconsData[item.id] = "/images/down.png";
    });
    setIcons(iconsData);
  }
  function handleIcon(itemId) {
    if (selectedItemId === itemId) {
      setIcons((prevIcons) => ({
        ...prevIcons,
        [itemId]: "/images/down.png",
      }));
      setSelectedItemId(null);
    } else {
      const updatedIcons = Object.keys(icons).reduce((acc, iconId) => {
        return {
          ...acc,
          [iconId]: "/images/down.png",
        };
      }, {});

      setIcons({
        ...updatedIcons,
        [itemId]: "/images/up.png",
      });
      setSelectedItemId(itemId);
    }
  }

  function handleDeleteItem(itemId) {
    axios
      .delete("https://localhost:7166/Admin/deleteItem?id=" + itemId)
      .then(() => {
        updateItems(); // Обновление списка услуг
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }

  function updateItems() {
    axios
      .get("https://localhost:7166/User/getItemList")
      .then((response) => {
        initializeIcons(response.data);
        setItems(response.data);
      })
      .catch((error) => console.log(error.response.data));
  }

  function handleAddItem() {
    if (
      itemName.trim() === "" ||
      price.trim() === "" ||
      expertView.trim() === "" ||
      quantity.trim() === "" ||
      expertViewPrice.trim() === "" ||
      manufacturerId.trim() === "") {
      setText("Заполните все поля");
      return;
    }

    if (!/^\d+$/.test(price)) {
      setText("Неверная цена");
      return;
    }

    if (!/^\d+$/.test(manufacturerId)) {
      setText("Неверное id производителя");
      return;
    }
    if (!/^\d+$/.test(expertViewPrice)) {
      setText("Неверная цена мнения");
      return;
    }
    if (!/^\d+$/.test(quantity)) {
      setText("Неверная цена мнения");
      return;
    }

    const newItem = {
      itemName: itemName,
      price: price,
      quantity: quantity,
      manufacturerId: manufacturerId,
      expertView: expertView,
      expertViewPrice: expertViewPrice,
    };

    axios
      .post("https://localhost:7166/Admin/AddItem", newItem)
      .then(() => {
        updateItems(); // Обновление списка услуг
        setItemName("");
        setPrice("");
        setExpertView("");
        setQuantity("");
        setExpertViewPrice("");
        setManufacturerId("");
        setText("");
      })
      .catch((error) => {
        console.log(error.response.data);
        setText(error.response.data);
      });
  }

  return (
    <>
      <div className="addItem">
        <h2 className="manHeading">Добавить товар</h2>
        <input
          placeholder="Введите название товара"
          className="addItemInput"
          maxLength="30"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />

        <input
          placeholder="Введите id производителя"
          className="addItemInput"
          maxLength="30"
          value={manufacturerId}
          onChange={(e) => setManufacturerId(e.target.value)}
        />
        <input
          placeholder="Введите цену товара"
          className="addItemInput"
          maxLength="3"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          placeholder="Введите количество товара"
          className="addItemInput"
          maxLength="3"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <textarea
          placeholder="Введите платный анализ"
          className="addItemInput"
          maxLength="100"
          value={expertView}
          onChange={(e) => setExpertView(e.target.value)}
        />
        <input
          placeholder="Введите цену анализа"
          className="addItemInput"
          maxLength="3"
          value={expertViewPrice}
          onChange={(e) => setExpertViewPrice(e.target.value)}
        />
        <button className="addButton" onClick={handleAddItem}>
          Добавить
        </button>
        <h5>{text}</h5>
      </div>

      <div className="itemBlock">
        <h2 className="manHeading">Управление товарами</h2>

        <table className="item-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название товара</th>
              <th>Цена</th>
              <th>Количество</th>
              <th>Платный анализ</th>
              <th>Цена анализа</th>
              <th>Удалить</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <React.Fragment key={item.id}>
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.itemName}</td>
                  <td>{item.price}</td>
                  <td>{item.quantity}</td>
                  <td>{item.expertView}</td>
                  <td>{item.expertViewPrice}</td>
                  <td>
                    <button onClick={() => handleDeleteItem(item.id)}>
                      Удалить
                    </button>
                  </td>
                  <td>
                    <img
                      src={icons[item.id]}
                      alt="Иконка вниз"
                      className="downIcon"
                      onClick={() => handleIcon(item.id)}
                    />
                  </td>
                </tr>
                {selectedItemId === item.id && (
                  <tr>
                    <td colSpan="8" >
                      <ItemComp id={item.id} onUpdate={updateItems} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ManageItems;