import axios from "axios";
import "./Authorization.css"
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useState, useContext } from "react";
import { AuthContext } from '../../../providers/AuthProvider';

function Authorization() {

  const [password, setPassword] = useState('');
  const [login, setLogin] = useState('');
  const [errorMessage, setText] = useState('');
  const navigate = useNavigate();
  // eslint-disable-next-line
  const { user, setUser } = useContext(AuthContext);

  const handleAuth = (event) => {
    event.preventDefault();
    axios.post('https://localhost:7166/Authorization/Login', { login, password })
      .then(response => {
        if (response.status === 200) {
          //setText(response.data);
          const user = response.data;
          // eslint-disable-next-line 
          if (user.role === 2) {
            setUser({
              id: user.id,
              login: user.login,
              password: user.password,
              balance: user.balance,
              isBlocked: user.isBlocked,
              isDeleted: user.isDeleted,
              role: user.role,
              salt: user.salt,
            })
            console.log("Это админ");
            navigate("/adminMain");
          }
          if (user.role === 1) {
            setUser({
              id: user.id,
              login: user.login,
              password: user.password,
              balance: user.balance,
              isBlocked: user.isBlocked,
              isDeleted: user.isDeleted,
              role: user.role,
              salt: user.salt,
            })
            console.log("Это юзер");
            navigate("/userMain");
          }
          return;
        }
      })
      .catch(error => {
        console.error(error.response.data);
        setText(error.response.data);
      });

  }

  return (
    <>
      <div className="container">
        <div className="login">
          <div className="container">
            <h1>Авторизация</h1>
            <input type="email" maxLength={30} placeholder="Логин" value={login} onChange={(event) => setLogin(event.target.value)} />
            <input type="password" maxLength={30} placeholder="Пароль" value={password} onChange={(event) => setPassword(event.target.value)} /><br />
            <button onClick={handleAuth}>Войти</button>
            <h4 className="errorText1">{errorMessage}</h4>
            <div className="clearfix"></div>
            <span className="copyright">&copy;2024</span>
          </div>
        </div>
        <div className="register">
          <div className="container">
            <img src="/images/peopleLogo.png" alt="Иконка человека" className="peopleLogo"></img>
            <h2>Привет, странник!</h2>
            <p>Введи свои данные и получи полный доступ ко всем возможностям</p>
            <Link to="/registration"><button>Регистрация</button></Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Authorization;
