import './Basket.css'
import React from 'react';
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { Link } from "react-router-dom";
import axios from 'axios';
import ProfileMenu from '../../profileIconMenu/profileMenu';
import NotificationList from '../../NotificationList/NotificationList';

const Basket = () => {
    const { user } = useContext(AuthContext);
    const [typeOfIcon, setTypeOfIcon] = useState(false);
    const [typeOfNotifications, setTypeOfNotifications] = useState(false);
    const [notificationCount, setNotificationCount] = useState("");
    const [basket, setBasket] = useState([]);
    const [itemNames, setItemNames] = useState({});
    const [text, setText] = useState("");

    useEffect(() => {
        if (user == null) return;
        axios.get("https://localhost:7166/User/getNumberOfNotifications?id=" + user?.id)
            .then(response => {
                if (response.data !== 0) {
                    setNotificationCount(response.data);
                }
            })
            .catch(error => {
                console.log(error);
            });
        // eslint-disable-next-line
    }, [user?.id]);

    const fetchBasket = () => {
        if (user == null) return;
        axios.get("https://localhost:7166/User/GetUserBasket?userId=" + user?.id)
            .then(response => {
                setBasket(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    };

    useEffect(() => {
        fetchBasket();
        // eslint-disable-next-line
    }, [user?.id]);

    useEffect(() => {
        if (basket.length === 0) return;

        const fetchItemNames = async () => {
            const names = {};
            for (const item of basket) {
                try {
                    const response = await axios.get("https://localhost:7166/Test/GetItemById?id=" + item.itemId);
                    names[item.itemId] = response.data.itemName;
                } catch (error) {
                    console.log(error);
                }
            }
            setItemNames(names);
        };

        fetchItemNames();
    }, [basket]);

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

    function handleDeleteItem(item) {
        axios.delete("https://localhost:7166/User/DeleteItemFromBasket?id=" + item.id)
        .then(() => {
            fetchBasket();
        })
        .catch(error => {
            console.log(error);
        });
    }

    function handleNotifications() {
        setTypeOfNotifications(!typeOfNotifications);
    }
    function handleAddOrder()
    {
        axios.post("https://localhost:7166/User/CreateOrder?userId=" + user.id)
        .then((response) => {
            fetchBasket();
            setText(response.data);
        })
        .catch(error => {
            console.log(error);
            setText(error.response.data.message)
        });
    }

    return <>
        {typeOfIcon && <ProfileMenu />}
        {typeOfNotifications && <NotificationList updateNotificationCount={setNotificationCount} />}
        <header>
            <div className="logo">
                <Link to="/userMain"><p>Pharmacy+</p></Link>
            </div>
            <div className="rightBlock">
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
        <div className='mainBasketBlock'>
            <h1 className='itemHeading'>Корзина</h1>

            <table className="table-style">
                <thead>
                    <tr>
                        <th className="textCell">Товар</th>
                        <th className="textCell">Цена</th>
                        <th className="textCell">Количество</th>
                        <th className="textCell">Подробнее</th>
                    </tr>
                </thead>
                <tbody>
                    {basket.map((basketItem) => (
                        <tr key={basketItem.id} className="tableRow">
                            <td className="textCell">{itemNames[basketItem.itemId] || 'Загрузка...'}</td>
                            <td className="textCell">{basketItem.price}</td>
                            <td className="textCell">{basketItem.quantity}</td>
                            <td>
                                <button onClick={() => handleDeleteItem(basketItem)} className='moreButton'>Удалить</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="divButt"><button className="subButton" onClick={handleAddOrder}>Оформить заказ</button></div>
            {text}
        </div>
    </>
}

export default Basket;
