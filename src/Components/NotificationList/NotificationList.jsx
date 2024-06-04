import React, { useState, useEffect, useContext } from "react";
import "./NotificationList.css";
import axios from "axios";
import { AuthContext } from "../../providers/AuthProvider";

function NotificationList({ updateNotificationCount }) {
  const { user } = useContext(AuthContext);
  const [notificationList, setNotificationList] = useState([]);

  useEffect(() => {
    axios
      .get("https://localhost:7166/User/getNotificationList?userId=" + user.id)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setNotificationList(response.data);
        } else {
          console.log("Invalid notification list data:", response.data);
        }
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }, [user.id]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("ru-RU", options);
  }

  const handleDeleteNotification = (id) => {
    axios
      .delete("https://localhost:7166/User/deleteNotification?id=" + id)
      .then((response) => {
        console.log(response.data);
        // Обновление списка уведомлений после успешного удаления
        const updatedNotificationList = notificationList.filter(
          (notification) => notification.id !== id
        );
        setNotificationList(updatedNotificationList);
        // Обновление числа уведомлений в компоненте UserMain
        updateNotificationCount(updatedNotificationList.length);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  return (
    <>
      <div className="notificationBlock">
        {notificationList.length === 0 ? (
          <p>У вас нет уведомлений</p>
        ) : (
          <>
            {notificationList.map((notification) => (
              <div key={notification.id} className="notification">
                <span className="notBody">
                  <div className="notText">{notification.notificationBody}</div>
                  <img
                    src="/images/close.png"
                    className="closeButt"
                    alt="Кнопка удаления"
                    onClick={() => handleDeleteNotification(notification.id)}
                  />
                </span>
                <div className="date">{formatDate(notification.dateTime)}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}

export default NotificationList;