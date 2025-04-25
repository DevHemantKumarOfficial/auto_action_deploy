import { useEffect, useState } from "react";

import "./admin-dashboard.css"

import dashboardIcon from "../../../assets/images/dashboard icon.svg"
import addUserIcon from "../../../assets/images/add user icon.svg"
import Dashboard from "../dashboard/dashboard";
import dashboardIconSelected from "../../../assets/images/dashboard icon selected.svg";
import addUserIconSelected from "../../../assets/images/add user icon selected.svg"
import AdminLatestUpdateDetail from "../../../assets/json/getAdminLatestUpdateDetail.json";
import axiosInstance from "../../config/axiosConfig";
import DataMapping from "../data-mapping/data-mapping";
import UserRegistration from "../user-registration/user-registration";
import mappingIcon from "../../../assets/images/network_mapping.svg"
import mappingIconSelected from "../../../assets/images/network_mapping_white.svg"




const AdminDashboard = () => {
    const [activePage, setActivePage] = useState("dashboard"); // Tracks the active page
    const [update, setUpdate] = useState([]);
    const adminUserId = sessionStorage.getItem("user_id");

    const fetchAdminLatestUpdate = async () => {
        try {
            if (!process.env.isLocal) {
                const response = await axiosInstance.get(
                    `${process.env.URL}getAdminLatestUpdateDetail?adminUserId=${adminUserId}`
                );
                setUpdate(response.data.result);
            } else {
                const localResponse: any = AdminLatestUpdateDetail;
                setUpdate(localResponse);
            }
        } catch (error: any) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchAdminLatestUpdate();
    }, []);

    return (
        <div className="admin-dashboard">
            <div className="sidebar">
                <div className="menu-link">
                    {/* Dashboard */}
                    <div
                        className={`menu-item ${activePage === "dashboard" ? "sidebar-selected" : ""}`}
                        onClick={() => setActivePage("dashboard")}
                    >
                        <div className="element-container">
                            {activePage === "dashboard" ? (
                                <img className="element-icon" src={dashboardIconSelected} alt="Dashboard Icon" />
                            ) : (
                                <img className="element-icon" src={dashboardIcon} alt="Dashboard Icon" />
                            )}
                            <div className={`text ${activePage === "dashboard" ? "sidebar-selected-text" : ""}`}>
                                Dashboard
                            </div>
                        </div>
                    </div>

                    {/* User Registration */}
                    <div
                        className={`menu-item ${activePage === "userRegistration" ? "sidebar-selected" : ""}`}
                        onClick={() => setActivePage("userRegistration")}
                    >
                        <div className="element-container">
                            {activePage === "userRegistration" ? (
                                <img className="element-icon" src={addUserIconSelected} alt="User Registration Icon" />
                            ) : (
                                <img className="element-icon" src={addUserIcon} alt="User Registration Icon" />
                            )}
                            <div
                                className={`text ${activePage === "userRegistration" ? "sidebar-selected-text" : ""}`}
                            >
                                User Registration
                            </div>
                        </div>
                    </div>

                    {/* Mapping Page */}
                    <div
                        className={`menu-item ${activePage === "mappingPage" ? "sidebar-selected" : ""}`}
                        onClick={() => setActivePage("mappingPage")}
                    >
                        <div className="element-container">
                            {activePage === "mappingPage" ? (
                                <img className="element-icon" src={mappingIconSelected} alt="Mapping Page Icon" />
                            ) : (
                                <img className="element-icon" src={mappingIcon} alt="Mapping Page Icon" />
                            )}
                            <div className={`text ${activePage === "mappingPage" ? "sidebar-selected-text" : ""}`}>
                                Manage Headers
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="content">
                {activePage === "dashboard" && <Dashboard update={update} fetchUpdates={fetchAdminLatestUpdate} />}
                {activePage === "userRegistration" && <UserRegistration fetchUpdates={fetchAdminLatestUpdate} />}
                {activePage === "mappingPage" && <DataMapping />}
            </div>
        </div>
    );
};


export default AdminDashboard;