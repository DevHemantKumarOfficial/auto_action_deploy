import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import MainLayout from './layouts/MainLayout/mainLayout';
import { GlobalStateProvider } from './GlobalStateContext';
import Login from './components/authentication/login/login';
import ResetPassword from './components/authentication/reset-password/reset-password';
import SetPassword from './components/authentication/set-password/set-password';
import AdminDashboard from './components/dashboard/admin-dashboard/admin-dashboard';
import AdminDashboardLayout from './layouts/AdminDashboardLayout/admin-dashboard-layout';
import AuthGuard from './auth-guard/auth-guard';
import { AuthProvider } from './auth-guard/auth-context';
import axiosInstance from './components/config/axiosConfig';
import { Bounce, toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
const IdleTimeoutHandler: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const userId = sessionStorage.getItem("user_id");
  const navigate = useNavigate();

  const idleTimeLimit = 28 * 60 * 1000;
  const countdownStart = 2 * 60;

  const [showModal, setShowModal] = useState(false);
  const [timer, setTimer] = useState(countdownStart);
  const [countdownInterval, setCountdownInterval] = useState<NodeJS.Timeout | null>(null);

  let idleTimer: NodeJS.Timeout;

  // useEffect(() => {
  //   const handleUnload = () => {
  //     logoutUser();
  //   };

  //   window.addEventListener("beforeunload", handleUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleUnload);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const logoutUser = async () => {
    sessionStorage.clear();
    toast.error('Logged out', {
      position: "top-center",
      autoClose: 900,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
    setTimeout(() => {
      setShowModal(false);
      navigate("/");
    }, 900)
    if (!process.env.isLocal) {
      await axiosInstance.get(`${process.env.URL}/auth/adminLogout?userId=${userId}`);
    }
  };

  const startCountdown = () => {
    setTimer(countdownStart); // Reset the countdown to 5 minutes
    if (countdownInterval) clearInterval(countdownInterval); // Clear any existing interval
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval); // Stop the countdown
          logoutUser(); // Automatically log out when countdown ends
          return 0;
        }
        return prev - 1; // Decrement the timer
      });
    }, 1000); // Update every second
    setCountdownInterval(interval); // Save the interval to state
  };

  const resetTimer = () => {
    if (!showModal) {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        setShowModal(true); // Show the modal after inactivity
        startCountdown(); // Start the countdown
      }, idleTimeLimit);
    }
  };
  const updateSession = async () => {
    if (!process.env.isLocal) {
      await axiosInstance.get(`${process.env.URL}/auth/updateAdminSession?userId=${userId}`);
    }
  };
  const handleModalClose = () => {
    if (countdownInterval) clearInterval(countdownInterval); // Stop the countdown
    setCountdownInterval(null); // Clear the interval reference
    setShowModal(false);
    resetTimer(); // Reset the idle timer when "Stay Logged In" is clicked
    updateSession();
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };
  useEffect(() => {
    if (userId) {
      const handleActivity = () => {
        resetTimer(); // Always reset the timer on activity
      };

      const events = ["mousemove", "keydown", "scroll", "click"];
      events.forEach((event) => window.addEventListener(event, handleActivity));

      resetTimer(); // Initialize the idle timer on mount

      return () => {
        clearTimeout(idleTimer);
        if (countdownInterval) clearInterval(countdownInterval); // Cleanup on unmount
        events.forEach((event) => window.removeEventListener(event, handleActivity));
      };
    } else {
      // If no user is logged in, ensure any existing timers are cleared
      clearTimeout(idleTimer);
      if (countdownInterval) clearInterval(countdownInterval);
    }
  }, [userId, showModal, countdownInterval]);

  return (
    <>
      {children}
      <Modal show={showModal} onHide={logoutUser} top>
        <Modal.Header >
          <div className='modal_title'>Inactivity Warning</div>
        </Modal.Header>
        <Modal.Body>
          You have been inactive for a while. Please click "Stay" to stay logged in.
          Otherwise, you will be logged out automatically in <strong>{formatTime(timer)}</strong>.
        </Modal.Body>
        <Modal.Footer>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <button className='modal_btn' onClick={handleModalClose}>
              Stay
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <div className="scrollbar" id="custome_scrollbar">
    </div>
    <IdleTimeoutHandler>
      <Routes>

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Login />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="setPassword" element={<SetPassword />} />
        </Route>
        <Route path="/dashboard" element={<AuthGuard>
          <AdminDashboardLayout />
        </AuthGuard>}>
          <Route index element={<AdminDashboard />} />
        </Route>
      </Routes>
    </IdleTimeoutHandler>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GlobalStateProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </GlobalStateProvider>
);
