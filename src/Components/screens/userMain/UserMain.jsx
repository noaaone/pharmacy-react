import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ItemTable from "./itemTable";
import './UserMain.css';
import axios from "axios";
import ProfileMenu from "../../profileIconMenu/profileMenu.jsx";
import NotificationList from "../../NotificationList/NotificationList";

function UserMain() {
  // eslint-disable-next-line 
  const { user, setUser } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  // eslint-disable-next-line 
  const [errorMessage, setText] = useState('');
  const [typeOfIcon, setTypeOfIcon] = useState(false);
  const [typeOfNotifications, setTypeOfNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState("");
  const navigate = useNavigate();
  


  useEffect(() => {
    axios.get("https://localhost:7166/User/getItemList")
      .then(response => {
        setItems(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (user == null)
      return;
    axios.get("https://localhost:7166/User/getNumberOfNotifications?id=" + user?.id)
      .then(response => {
        if (response.data === 0) {
          return;
        }
        setNotificationCount(response.data);
      })
      .catch(error => {
        console.log(error);
      });
    // eslint-disable-next-line
  }, [user?.id]);

  if (user == null) {
    return (
      <>
        Вы не авторизованы
        <div className="buttons">
          <Link to="/authorization"><button>Войти</button></Link>
        </div>
      </>
    );
  }

  function handleProfileIcon() {
    setTypeOfIcon(!typeOfIcon);
  }

  function handleNotifications() {
    setTypeOfNotifications(!typeOfNotifications);
  }
  function handleBasket(){
    navigate("/basket");
  }

  return (
    <>
      {typeOfIcon && <ProfileMenu />}
      {typeOfNotifications && <NotificationList updateNotificationCount={setNotificationCount} />}
      <header>
        <div className="logo">
          <Link to="/userMain"><p>Pharmacy+</p></Link>
        </div>
        <div className="rightBlock">
          <div className="baksetBlock">
            <img
              src="images/basket.png"
              className="basketImage"
              alt="Иконка корзины"
              onClick={handleBasket}
            />
          </div>
          <div className="bellBlock">
            <img
              src="images/notification.png"
              className="notificationBell"
              alt="Иконка уведомления"
              onClick={handleNotifications}
            />
          </div>
          <span className="notifNumber">{notificationCount}</span>
          <span className="balance">Баланс = {user.balance}</span>
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
      <ItemTable items={items} />
      <h3 className="errorText1">{errorMessage}</h3>
    </>
  );
}

export default UserMain;