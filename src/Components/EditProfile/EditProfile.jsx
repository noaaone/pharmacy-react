import React, { useState,useContext } from "react";
import './EditProfile.css'
import axios from "axios";
import { AuthContext } from "../../providers/AuthProvider";

function EditProfile()
{
    const [loginText, setLoginText] = useState("");
    const [passwordText, setPasswordText] = useState("");
    const [newLogin, setNewLogin] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [password, setPassword] = useState("");
    const{user} = useContext(AuthContext);

    function handleEditLogin(newLogin) {
        if (newLogin === "") {
          setLoginText("Введите новый логин");
          return;
        }
       
        if (newLogin.length < 4) {
          setLoginText("Длина логина должна быть больше 4");
          return;
        }
        const requestData = {
            id: user.id,
            newLogin: newLogin
          };
        axios.put("https://localhost:7166/User/ChangeUserName",requestData)
        .then(response =>
            {
                if(response.status===200)
                {
                    setLoginText("Логин успешно изменен на " + newLogin);
                }
            })
            .catch(error=>{
                console.log(error);
                setLoginText(error.response.data);
            });
    }
    function handleEditPassword(password,newPassword) {
        if (newPassword === "") {
            setPasswordText("Введите новый пароль");
          return;
        }
       
        if (newPassword.length < 4) {
            setPasswordText("Длина пароля должна быть больше 4");
          return;
        }
        const requestData = {
            id: user.id,
            password: password,
            newPassword:newPassword
          };
        axios.put("https://localhost:7166/User/ChangePassword",requestData)
        .then(response =>
            {
                if(response.status===200)
                {
                    setPasswordText("Пароль успешно изменен");
                }
            })
            .catch(error=>{
                console.log(error);
                setPasswordText(error.response.data);
            });
    }

    return<div className="editProfileBlock">
        <h1 className="editHeading">Изменить логин</h1>
        <input placeholder="Введите новый логин" maxLength="30" className="editField"
        value={newLogin}
        onChange={(e) => setNewLogin(e.target.value)}
        />
        <button  className="editButton" onClick={()=>handleEditLogin(newLogin)}>Изменить</button>
        <h3>{loginText}</h3>
        <h1 className="editHeading">Изменить Пароль</h1>
        <input placeholder="Введите старый пароль" className="editField"
         value={password}
         onChange={(e) => setPassword(e.target.value)}
        />
        <input placeholder="Введите новый пароль" className="editField"
        value={newPassword}
        maxLength="30"
        onChange={(e) => setNewPassword(e.target.value)}/>
        <button  className="editButton" onClick={()=>handleEditPassword(password, newPassword)}>Изменить</button>
        <h3>{passwordText}</h3>
    </div>
}

export default EditProfile