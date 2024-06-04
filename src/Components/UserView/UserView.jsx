import React, { useEffect, useState } from "react";
import './UserView.css';
import axios from "axios";

function UserView(props) {
    const id = props.id;
    const [recentPasswords, setRecentPasswords] = useState([]);
    const [deposits, setDeposits] = useState([]);
    const [loginHistory, setLoginHistory] = useState([]);
    const [purchases, setPurchases] = useState([]);

    useEffect(() => {
        axios.get("https://localhost:7166/Admin/GetUserPreviousPasswordsList?id=" + id)
            .then(response => setRecentPasswords(response.data))
            .catch(error => console.log(error.response.data));
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        axios.get("https://localhost:7166/Admin/GetDepositsOfUser?userId=" + id)
            .then(response => setDeposits(response.data))
            .catch(error => console.log(error.response.data));
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        axios.get("https://localhost:7166/Admin/GetLoginHistoryList?id=" + id)
            .then(response => setLoginHistory(response.data))
            .catch(error => console.log(error.response.data));
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        axios.get("https://localhost:7166/Admin/GetPurchasesOfUser?userId=" + id)
            .then(response => setPurchases(response.data))
            .catch(error => console.log(error.response.data));
        // eslint-disable-next-line
    }, []);

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return date.toLocaleDateString('ru-RU', options);
    }

    return (
        <div className="viewBlock">
            <span className="passwordsBlock">
                <h4>Предыдущие пароли:</h4>
                {Array.isArray(recentPasswords) && recentPasswords.length > 0 ? (
                    recentPasswords.map((recentPassword) => (
                        <p key={recentPassword.password}>{recentPassword.password}</p>
                      ))
                ) : (
                    <p>Пароли отсутствуют</p>
                )}
            </span>
            <span className="depositsBlock">
                <h4>Депозиты:</h4>
                {Array.isArray(deposits) && deposits.length > 0 ? (
                    deposits.map((deposit) => (
                        <div key={deposit.id}>
                            <p>
                            Сумма: {deposit.sumOfDep}
                            <br/>
                            Дата: {formatDate(deposit.date)}
                             <br/>
                             </p>
                            </div>
                            
                      ))
                ) : (
                    <p>Депозиты отсутствуют</p>
                )}
            </span>
            <span className="loginHistory">
                <h4>История входов:</h4>
                {Array.isArray(loginHistory) && loginHistory.length > 0 ? (
                    loginHistory.map((history) => (
                        <div key={history.id}>
                          <p>
                            Дата: {formatDate(history.date)}
                            <br/>
                            IP-адрес: {history.ip}
                            </p>
                          <br/>
                        </div>
                      ))
                ) : (
                    <p>Депозиты отсутствуют</p>
                )}
            </span>
            <span className="puschasesBlock">
                <h4>Покупки мнений:</h4>
                {Array.isArray(purchases) && purchases.length > 0 ? (
                    purchases.map((purchase) => (
                        <div key={purchase.id}>
                          <p>
                            ID-товара: {purchase.itemId}
                            <br/>
                            Куплено за: {purchase.price}
                            </p>
                          <br/>
                        </div>
                      ))
                ) : (
                    <p>Покупки отсутствуют</p>
                )}
            </span>
        </div>
    );
}

export default UserView;