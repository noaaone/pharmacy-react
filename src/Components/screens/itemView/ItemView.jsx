import { useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../providers/AuthProvider";
import PriceChart from "../../PriceChart/PriceChart";
import { Link, useNavigate } from "react-router-dom";
import './ItemView.css';
import ProfileMenu from "../../profileIconMenu/profileMenu";
import NotificationList from "../../NotificationList/NotificationList";

function ItemView() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const location = useLocation();
  const item = location.state?.item; // проверяем, что значение определено
  const navigate = useNavigate();
  // eslint-disable-next-line
  const { user, setUser } = useContext(AuthContext);
  const [manufacturer, setManufacturer] = useState(null); // устанавливаем начальное значение null для индикации загрузки
  const [button, setButton] = useState();
  const [expertView, setExpertView] = useState();
  const [type, setType] = useState();
  const [typeOfIcon, setTypeOfIcon] = useState(false);
  const [typeOfNotifications, setTypeOfNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState("");
  const [text, setText] = useState("");
  const [text1, setText1] = useState("");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoUrl1, setPhotoUrl1] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [oldQuantity, setOldQuantity] = useState(null);


  useEffect(() => {
    setOldQuantity(item.quantity);
    if (!item || !user) return; // если item не определено, то ничего не делаем
    axios.get("https://localhost:7166/User/getExpertView?userId=" + user.id + "&itemId=" + item.id)
      .then(response => {
        // eslint-disable-next-line
        if (response.data == "Мнение не куплено") {
          setExpertView(<div className="divButt"><button className="subButton" onClick={handleBuyExpertView}>Разблокировать за {item.expertViewPrice}</button></div>);
        }
        else {
          setExpertView(item.expertView);
        }
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
          const response = await axios.get(`https://localhost:7166/Photo/GetPhoto/${item.id}?role=3`, {
            responseType: 'arraybuffer',  // Указываем, что ожидаем двоичные данные
          });
          const response1 = await axios.get(`https://localhost:7166/Photo/GetPhoto/${item.manufacturerId}?role=4`, {
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
          }

          if (response1.status === 200) {
            const base64String = btoa(
              new Uint8Array(response1.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
              )
            );
            setPhotoUrl1(`data:image/jpeg;base64,${base64String}`);
          }
        }
      } catch (error) {
      }
    };

    fetchData();
    // eslint-disable-next-line
  }, [user && user.id]);

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

  function handleBuyExpertView() {
    openModal();
    setType(2);
  }

  const handleAnswer = (answer) => {
    setText("");
    if (answer) {
      // Proceed with the buy operation
      var userId = user.id;
      var itemId = item.id;
      axios
        .post("https://localhost:7166/User/buyExpertView", { userId, itemId })
        .then((response) => {
          console.log(response.data);
          user.balance -= item.expertViewPrice;
          setExpertView(item.expertView);
          closeModal();
        })
        .catch((error) => {
          setText(error.response.data)
          console.log(error);
        });
    } else {
      closeModal();
    }
  };



  useEffect(() => {
    if (!item || !user) return; // если item не определено, то ничего не делаем
    axios.get("https://localhost:7166/Test/isSubscribed?userId=" + user.id + "&itemId=" + item.id)
      .then(response => {
        // eslint-disable-next-line
        if (response.data === "Пользователь подписан") {
          setButton("Отписаться");
        }
        else {
          setButton("Подписаться");
        }
      })
      .catch(error => {
        console.log(error);
      });
    // eslint-disable-next-line
  }, []);

  function handleSubscribe() {
    var userId = user.id;
    var itemId = item.id;
    if (button === "Подписаться") {
      axios.post("https://localhost:7166/User/addSubscription", { userId, itemId })
        .then(response => {
          console.log(response.data);
          setType(1);
          openModal();
        })
        .catch(error => {
          console.log(error); // можно добавить обработку ошибок
        });
      setButton("Отписаться");
    } else {
      axios.delete("https://localhost:7166/User/deleteSubscription", { data: { userId, itemId } })
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.log(error); // можно добавить обработку ошибок
        });
      setButton("Подписаться");
    }
  }

  useEffect(() => {
    if (!item || !item.manufacturerId) return; // если item не определено, то ничего не делаем

    axios.get("https://localhost:7166/Admin/getManufacturerById?id=" + item.manufacturerId)
      .then(response => {
        setManufacturer(response.data);
      })
      .catch(error => {
        console.log(error); // можно добавить обработку ошибок
      });
    // eslint-disable-next-line
  }, []);


  if (user == null) {
    return (
      <>
        Вы не авторизованы
        <div className="buttons">
          <Link to="/authorization"><button>Войти</button></Link>

        </div>
      </>);
  }

  if (!item || !manufacturer) {
    return <div>Loading...</div>; // добавляем индикатор загрузки, если данные еще не загружены
  }
  const handleViewManufacturer = (manufacturerId) => {
    navigate("/manufacturerProfile", { state: { manufacturerId } });
  };

  function modalView(type) {
    // eslint-disable-next-line
    if (type == 1) {
      return <>
        <div className="modal">
          <div className="modal-content">
            <h2 className="closeHeading">Вы успешно подписались</h2>
            <div>
              <img src="/images/bell.gif" alt="GIF" />
            </div>
            <p className="closeText">При изменении цены вам придет уведомление.</p>
            <button onClick={closeModal} className="closeButton">Закрыть окно</button>
          </div>
        </div>
      </>
    }
    // eslint-disable-next-line
    if (type == 2) {
      return <>
        <div className="modal">
          <div className="modal-content">
            <h2 className="closeHeading">Вы точно хотите разблокировать анализ?</h2>
            <div>
              <img src="/images/wtf.gif" alt="GIF" width="200px" />
            </div>
            <p className="closeText">С вашего баланса будет снято {item.expertViewPrice} д.</p>
            <h3>{text}</h3>
            <div><button onClick={() => handleAnswer(true)} className="closeButton">Да</button>
              <button onClick={() => handleAnswer(false)} className="closeButton">Нет</button></div>
          </div>
        </div>
      </>
    }
  }
  function handleProfileIcon() {
    setTypeOfIcon(!typeOfIcon);
  }
  function handleBasket() {
    navigate("/basket");
  }
  const handleAddToBasket = () => {
    const requestData = {
      itemId: item.id,
      userId: user.id,
      quantity: quantity
    }

    axios.post("https://localhost:7166/User/AddItemToBasket", requestData)
      .then(response => {
        setText1(response.data);
        setOldQuantity(oldQuantity - quantity)
      })
      .catch(error => {
        console.log(error);
        setText1(error.response.data);
      });

  }
  return (<>
    {isOpen && (
      modalView(type)
    )}

    <div className={isOpen ? 'page-content blocked' : 'page-content'}>
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



      <div className="itemInfo">
        <div className="mainItemInfoBlock">
          <div className="mainItemInfoTextBlock">
            <h1 className="itemHeading">Информация</h1>
            <div className="manufacturerAvatar">
              <svg width="100%" height="100%" viewBox="0 0 1 1" xmlns="http://www.w3.org/2000/svg">
                <clipPath id="circleClip">
                  <circle cx="0.5" cy="0.5" r="0.5" />
                </clipPath>
                <image x="0" y="0" width="100%" height="100%" xlinkHref={photoUrl} clipPath="url(#circleClip)" alt="Иконка профиля" />
              </svg>
            </div>
            <p>Название: {item.itemName}</p>
            <p>Цена: {item.price}</p>
            <p>Количество: {oldQuantity}</p>
          </div>
          <div className="mainItemInfoTextBlock">
            <h1 className="itemHeading">Производитель</h1>
            <div className="manufacturerAvatar">
              <svg width="100%" height="100%" viewBox="0 0 1 1" xmlns="http://www.w3.org/2000/svg">
                <clipPath id="circleClip">
                  <circle cx="0.5" cy="0.5" r="0.5" />
                </clipPath>
                <image x="0" y="0" width="100%" height="100%" xlinkHref={photoUrl1} clipPath="url(#circleClip)" alt="Иконка профиля" />
              </svg>
            </div>
            <p>Имя: <button
              onClick={() => handleViewManufacturer(item.manufacturerId)}
              style={{ textDecoration: 'none', backgroundColor: '#fff', border: 'none', cursor: 'pointer', padding: '0' }}>
              <p className="manufacturerLink" title="Перейти в профиль" style={{ textDecoration: 'none', margin: '0' }}>
                {manufacturer.name}
              </p>
            </button></p>
            <p>Страна: {manufacturer.country}</p>
            <p>Телефон: {manufacturer.phone}</p>
            <p>Email: {manufacturer.email}</p>
          </div>
          <div className="mainItemInfoTextBlock">
            <h1 className="itemHeading">Купить</h1>
            <input
              placeholder="Количество товара"
              className="inputQuantity"
              maxLength="4"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              onKeyPress={(e) => {
                const keyCode = e.which || e.keyCode;
                const isValidInput = /^[0-9]+$/.test(String.fromCharCode(keyCode));
                if (!isValidInput) {
                  e.preventDefault();
                }
              }}
            />
            <div className="divButt"><button className="subButton" onClick={handleAddToBasket}>В корзину</button></div>
            {text1}
          </div>
        </div>
      </div>
    </div>
    <div className="mainView">

      <h1 className="itemHeading"> График предыдущих цен</h1>
      <div className="chart"><PriceChart itemId={item.id} /></div>

    </div>
    <div className="buttonsBlock">
      <h1 className="itemHeading"> Оформить подписку</h1>
      <div className="subscribeBlock">
        <img src="images/example.jpg" className="exaplePhoto" alt="Фото примера" />

        <div className="divButt">
          <p className="TextOfSubscribeBlock">Оформите подписку и сможете получать уведомления при изменении цены товара</p>
          <button className="subButton" onClick={handleSubscribe}>{button}</button></div>
      </div>
      <div className="analystBlock">
        <h1 className="itemHeading">Платный анализ</h1>
        <div>{expertView}</div>
      </div>
    </div>
  </>

  );
};

export default ItemView;