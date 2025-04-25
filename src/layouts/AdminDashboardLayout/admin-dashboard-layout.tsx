import MainHeader from "../../components/Commom/header/header";
import { Outlet } from "react-router-dom";

const AdminDashboardLayout = () => {
   
    return (
        <div className="admin-layout">
            <MainHeader />
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default AdminDashboardLayout;
