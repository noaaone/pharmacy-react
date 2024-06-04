import React, {useContext} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";

function AdminProfileMenu()
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

        <div><button className="linkProfileButton" onClick={handleExit}>
            <img src="/images/exitIcon.png" className="exitIcon" alt="Иконка выхода"/><p className="butText">Выйти</p></button></div>
        </div>
    
}
export default AdminProfileMenu;