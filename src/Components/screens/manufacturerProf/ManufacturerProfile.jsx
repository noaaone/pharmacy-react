import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ItemTable from "../userMain/itemTable";
import "./ManufacturerProfile.css"
import ProfileMenu from "../../profileIconMenu/profileMenu";
import NotificationList from "../../NotificationList/NotificationList";

function ManufacturerProfile() {
  const location = useLocation();
  const manufacturerId = location.state?.manufacturerId; // проверяем, что значение определено
  // eslint-disable-next-line
  const [manufacturer, setManufacturer] = useState(null);
  const [items, setItems] = useState([])
  // eslint-disable-next-line
  const { user, setUser } = useContext(AuthContext);
  const [typeOfIcon, setTypeOfIcon] = useState(false);
  const [typeOfNotifications, setTypeOfNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState("");
  const [photoUrl, setPhotoUrl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://localhost:7166/User/getItemListByManufacturerId?id=" + manufacturerId)
      .then(response => {
        setItems(response.data);
      })
      .catch(error => {
        console.log(error);
      });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user && user.id) {  // Проверяем, что user и user.id существуют
          const response = await axios.get(`https://localhost:7166/Photo/GetPhoto/${manufacturerId}?role=4`, {
            responseType: 'arraybuffer',  // Указываем, что ожидаем двоичные данные
          });

          if (response.status === 200) {
            const base64String = btoa(
              new Uint8Array(response.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
              )
            );

            setPhotoUrl(`data:image/jpeg;base64,${base64String}`);
          } else {
            // Обработка ошибки
          }
        }
      } catch (error) {
        // Обработка ошибки
      }
    };

    fetchData();
    // eslint-disable-next-line
  }, [user && user.id]);
  useEffect(() => {
    if (!manufacturerId) return; // если item не определено, то ничего не делаем

    axios.get("https://localhost:7166/Admin/getManufacturerById?id=" + manufacturerId)
      .then(response => {
        setManufacturer(response.data);
      })
      .catch(error => {
        console.log(error); // можно добавить обработку ошибок
      });
    // eslint-disable-next-line
  }, [manufacturerId]);

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
  function handleNotifications() {
    setTypeOfNotifications(!typeOfNotifications);
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
  function handleProfileIcon() {
    setTypeOfIcon(!typeOfIcon);
  }
  function handleBasket(){
    navigate("/basket");
  }
  return (
    <>
      {typeOfIcon &&
        <ProfileMenu />
      }
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
      <h1 className="headingProfile">Профиль производителя</h1>

      <div className="profile">

        <div className="manufacturerAvatar">
          <svg width="100%" height="100%" viewBox="0 0 1 1" xmlns="http://www.w3.org/2000/svg">
            <clipPath id="circleClip">
              <circle cx="0.5" cy="0.5" r="0.5" />
            </clipPath>
            <image x="0" y="0" width="100%" height="100%" xlinkHref={photoUrl} clipPath="url(#circleClip)" alt="Иконка профиля" />
          </svg>
        </div>

        <div className="info">
          <p><strong>{manufacturer?.name}</strong></p>
          <p>Страна: {manufacturer?.country}</p>
          <p><img src="/images/phoneIcon.png" alt="Иконка телефона" className="Icon" />{manufacturer?.phone}</p>
          <p><img src="/images/emailIcon.png" alt="Иконка email" className="Icon" />{manufacturer?.email}</p>
        </div>
      </div>

      <ItemTable items={items} />
    </>
  );
}
export default ManufacturerProfile;