import "./header.css"
import logo from "../../../assets/images/inphamed-logo.svg"
import userIcon from "../../../assets/images/user icon.svg"
import logoutIcon from "../../../assets/images/logout icon.svg"


import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../../auth-guard/auth-context"
import axiosInstance from "../../config/axiosConfig"



const MainHeader = () => {

  const navigate = useNavigate();
  const { logout: l } = useAuth();
  const logout = async () => {
    l();
    if (!process.env.isLocal) {
      await axiosInstance.get(`${process.env.URL}/auth/adminLogout`);
    }
    navigate('/');

  }

  const userName = sessionStorage.getItem('user_name');

  return (
    <div className="header">
      <Link to='/dashboard'>
        <img className="inphamed-logo-icon" alt="Inphamed Logo" src={logo} />
      </Link>

      <div className="right">
        <div className="right-1">
          <img className="user-icon" src={userIcon} alt="User Icon" />
          <div className="user-name">
            {userName}
          </div>
        </div>
        <div className="right-2" onClick={logout}>
          <img className="logout-icon" src={logoutIcon} alt="Logout Icon" />
          <div className="logout-text">
            Logout
          </div>
        </div>
      </div>


    </div>
  )
}

export default MainHeader;