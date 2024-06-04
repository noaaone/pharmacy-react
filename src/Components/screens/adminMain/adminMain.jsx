import React, { useContext, useState } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { Link } from "react-router-dom";
import AdminProfileMenu from "../../AdminProfileMenu/AdminProfileMenu";
import ManageUsers from "../../manageUsers/ManageUsers"
import './adminMain.css'
import ManageManufacturers from "../../ManageManufacturers/ManageManufacturers";
import ManageOrders from "../../ManageOrders/ManageOrders";
import ManageItems from "../../ManageItems/ManageItems";

function AdminMain() {
  const [typeOfIcon, setTypeOfIcon] = useState(false);
  const [activeComponent, setActiveComponent] = useState(null);
  const { user } = useContext(AuthContext);

  if (user == null) {
    return (
      <>
        Вы не авторизованы
        <div className="buttons">
          <Link to="/authorization">
            <button>Войти</button>
          </Link>
        </div>
      </>
    );
  }

  function handleProfileIcon() {
    setTypeOfIcon(!typeOfIcon);
  }

  // Функции для обработки нажатий на кнопки и установки активного компонента
  function handleUsersClick() {
    setActiveComponent(<ManageUsers/>);
  }

  function handleManufacturersClick() {
    setActiveComponent(<ManageManufacturers/>);
  }

  function handleOrderClick() {
    setActiveComponent(<ManageOrders/>);
  }

   
  function handleItemsClick() {
    setActiveComponent(<ManageItems />);
  }

  return (
    <>
      {typeOfIcon && <AdminProfileMenu />}

      <header>
        <div className="logo"></div>
        <div className="rightBlock">
          <span>
            <img
              src="images/profileIcon.png"
              alt="Иконка профиля"
              className="profileIcon"
              onClick={handleProfileIcon}
            />
          </span>
        </div>
      </header>

      <div className="buttonsBlockAdmin">
        <button onClick={handleUsersClick} className = "userButton">Пользователи</button>
        <button onClick={handleManufacturersClick} className = "userButton">Производители</button>
        <button onClick={handleOrderClick} className = "userButton">Заказы</button>
        <button onClick={handleItemsClick} className = "userButton">Товары</button>
      </div>

      {/* Отображение активного компонента */}
      {activeComponent}
    </>
  );
}

export default AdminMain;