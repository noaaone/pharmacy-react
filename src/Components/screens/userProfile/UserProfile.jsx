import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import './UserProfile.css'
import ReplenishBalace from "../../replenishBalance/ReplenishBalance";
import AddCard from "../../AddCreditCard/AddCreditCard";
import HelpBlock from "../../helpBlock/HelpBlock";
import EditProfile from "../../EditProfile/EditProfile";
import MyOrders from "../../MyOrders/MyOrders";

function UserProfile() {
  // eslint-disable-next-line
  const { user, setUser } = useContext(AuthContext);
  const [balance, setBalance] = useState();
  const navigate = useNavigate();
  const [selectedComponent, setSelectedComponent] = useState('replenishBalance');

  useEffect(() => {
    if (user) {
      setBalance(user.balance);
    }
  }, [user]);

  function handleExit() {
    setUser(null);
    navigate('/authorization');
  }
  if (user == null) {
    return (
      <>
        Вы не авторизованы
        <div className="buttons">
          <Link to="/authorization"><button>Войти</button></Link>
        </div>
      </>);
  }

  const handleButtonClick = (component) => {
    setSelectedComponent(component);
  }


  const renderComponent = () => {
    switch (selectedComponent) {
      case 'replenishBalance':
        return <ReplenishBalace />;
      case 'addCreditCard':
        return <AddCard />;
      case 'helpBlock':
        return <HelpBlock />;
      case 'editProfile':
        return <EditProfile />;
      case 'myOrders':
        return <MyOrders />
      default:
        return <ReplenishBalace />;
    }
  }



  return <>

    <header>
      <div className="logo">
        <Link to="/userMain" title=" Перейти на главную страницу"><p>Pharmacy+</p></Link>
      </div>
    </header>
    <div className="profileMenu">
      <img src="images/profileIcon.png" alt="Иконка профиля" className="avatar" />
      <div className="avatarBalance" title="Ваш баланс"><p className="profileBalance">Баланс = {balance}</p></div>
      <button className="profileButt" title="Мои заказы" onClick={() => handleButtonClick('myOrders')}><p className="textInMenu">Мои заказы</p></button>
      <button className="profileButt" title="Пополнить баланс" onClick={() => handleButtonClick('replenishBalance')}> <p className="textInMenu"><img src="/images/replenish.png" className="menuIcon" alt="Иконка пополнения" />Пополнить</p></button>
      <button className="profileButt" title="Добавить кредитную карту" onClick={() => handleButtonClick('addCreditCard')}><p className="textInMenu"><img src="/images/card.png" className="menuIcon" alt="Иконка карты" />Добавить карту</p></button>
      <button className="profileButt" title="Редактировать ваш профиль" onClick={() => handleButtonClick('editProfile')}><p className="textInMenu" ><img src="/images/editIcon.png" className="menuIcon" alt="Иконка редактирования" />Редактировать профиль</p></button>
      <button className="profileButt" title="Получить помощь" onClick={() => handleButtonClick('helpBlock')}><p className="textInMenu"><img src="/images/helpIcon.png" className="menuIcon" alt="Иконка помощи" />Помощь и поддержка</p></button>
      <button className="profileButt" onClick={handleExit} title="Выйти из аккаунта"><p className="textInMenu"><img src="/images/exitIcon.png" className="menuIcon" alt="Иконка выхода" />Выйти</p></button>
    </div>
    {renderComponent(selectedComponent)}
  </>

}

export default UserProfile;