import React, { useEffect, useState } from "react";
import "./ManageOrders.css";
import axios from "axios";

function ManageOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("https://localhost:7166/Admin/GetAllOrders")
      .then((response) => setOrders(response.data))
      .catch((error) => console.log(error.response.data));
  }, []);

  function handleDeleteOrder(orderId) {
    axios
      .delete("https://localhost:7166/Admin/DeleteOrder?orderId=" + orderId)
      .then(() => {
        const updatedOrders = orders.filter((order) => order.id !== orderId);
        setOrders(updatedOrders);
      })
      .catch((error) => console.log(error.response.data));
  }
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("ru-RU", options);
  }

  function handleStatusChange(orderId, status) {
    const requestData = {
      orderId: orderId,
      status: status,
    };
    axios
      .put("https://localhost:7166/Admin/EditOrderStatus", requestData)
      .then((response) => {
        console.log(response.data);
        // Refresh the user list after successful role update
        axios
          .get("https://localhost:7166/Admin/GetAllOrders")
          .then((response) => {
            setOrders(response.data);
          })
          .catch((error) => {
            console.log(error.response.data);
          });
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }
  return (
    <>
      <div className="orderBlock">
        <h2 className="manHeading">Управление заказами</h2>

        <table className="order-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Заказ</th>
              <th>Статус</th>
              <th>Дата</th>
              <th>ID юзера</th>
              <th>Удалить</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.orderInfo}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                  >
                    <option value="принят">принят</option>
                    <option value="выполнен">выполнен</option>
                    <option value="отменен">отменен</option>
                  </select>
                </td>
                <td>{formatDate(order.date)}</td>
                <td>{order.userId}</td>
                <td>
                  <button onClick={() => handleDeleteOrder(order.id)}>
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ManageOrders;