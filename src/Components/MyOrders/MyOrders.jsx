import React from "react";
import './MyOrders.css'
import { AuthContext } from "../../providers/AuthProvider";
import { useContext, useEffect, useState} from "react";
import axios from "axios";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const {user} = useContext(AuthContext);
    
    useEffect(() => {
      axios
        .get("https://localhost:7166/Admin/GetUserOrders?userId=" + user.id)
        .then((response) => setOrders(response.data))
        .catch((error) => console.log(error.response.data));
    }, [user]);

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = {
          year: "numeric",
          month: "long",
          day: "numeric",
        };
        return date.toLocaleDateString("ru-RU", options);
      }

    return <div className="userOrdersBlock">
        <h1 className='itemHeading'>Мои заказы</h1>
        <table className="order-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Заказ</th>
                    <th>Статус</th>
                    <th>Дата</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((order) => (
                    <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.orderInfo}</td>
                        <td>
                            {order.status}
                        </td>
                        <td>{formatDate(order.date)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}

export default MyOrders;