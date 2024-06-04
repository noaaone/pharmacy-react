import React, {useContext} from "react";
import './profileMenu.css'
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";

function ProfileMenu()
{
    const navigate =useNavigate();
    // eslint-disable-next-line
    const {user, setUser} = useContext(AuthContext);

    function handleExit()
    {
        setUser(null);
        navigate('/authorization');
    }

    return <div className="iconMenu">
        <div><button className="linkProfileButton" onClick={()=>navigate('/userProfile')}>
        <img src="/images/settingsIcon.png" className="exitIcon" alt="Иконка настроек"/>
            <p className="butText">Настройки</p></button></div>
        <div><button className="linkProfileButton" onClick={handleExit}>
            <img src="/images/exitIcon.png" className="exitIcon" alt="Иконка выхода"/><p className="butText">Выйти</p></button></div>
        </div>
    
}
export default ProfileMenu;