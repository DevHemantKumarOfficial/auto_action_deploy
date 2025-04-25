import { Outlet } from "react-router-dom";
import "./mainLayout.css"

const MainLayout = () => {
  return (
    <div>
    {/* <MainHeader /> */}
    <main>
      <Outlet />
    </main>
    {/* <MainFooter /> */}
  </div>
  );
};

export default MainLayout;
