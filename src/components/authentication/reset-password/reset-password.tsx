import { useEffect, useState } from "react";
import "./reset-password.css";
import "../auth-common.css"
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";
import OtpPage from "../OtpPage/otpPage";
import { Bounce, toast, ToastContainer } from "react-toastify";
import axiosInstance from "../../config/axiosConfig";
import logo from "../../../assets/images/inphamed-logo.svg"
import { Button } from "react-bootstrap";

export const ResetPassword = () => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [OtpVisible, setOtpVisible] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(4).fill(''));
  const [finalOtp, setFinalOtp] = useState("");
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState(0);
  const handleSendEmail = async (e: any) => {
    e.preventDefault();
    try {
      if (!process.env.isLocal) {
        const response = await axiosInstance.post(`${process.env.URL}auth/forgot/adminPassword`, {
          email: email
        })
        if (response.status === 200) {
          const otp_id = response.data.data;
          sessionStorage.setItem("otp_id", otp_id);
          setOtpVisible(true);
        }
      } else {
        sessionStorage.setItem("otp_id", "Test_otp_id");
        setOtpVisible(true);
      }
    } catch (error: any) {
      const msg = error.response.data.message;
      toast.error(msg, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } finally {

    }
  };

  const validateEmail = (email: string) => {
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");


    } else {
      setEmailError("");
    }
  };

  const handleEmailChange = (event: any) => {
    const { value } = event.target;
    setEmail(value);

    if (value.trim().length === 0) {
      setEmailError("Email cannot be empty");
    } else {
      validateEmail(value);
    }
  };

  const updateOtp = (otp: any) => {
    setFinalOtp(otp);
    setFinalOtp(finalOtp);
  }

  const handleOTP = async (e: any) => {
    e.preventDefault();
    try {
      const enteredOtp = otp.join('');
      if (!process.env.isLocal) {
        const response = await axiosInstance.post(`${process.env.URL}auth/forgot/password/otpSubmit`, {
          otp_id: sessionStorage.getItem("otp_id"),
          otp: enteredOtp
        })
        if (response.status === 200) {
          sessionStorage.setItem("user_id", response.data.data);
          navigate('/setPassword')
          setAttempts(0);
        }
      } else {
        sessionStorage.setItem("user_id", "test_user_id");
        navigate('/setPassword')
        setAttempts(0);
      }
    } catch (error: any) {
      const msg = error.response.data.message;
      toast.error(msg, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setAttempts((prev) => {
        if (attempts + 1 >= 3) {
          setAttempts(0);
          toast.error("OTP limit exceeded, redirecting to login...", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
          setTimeout(() => routeHome(), 1000); // Reload after 1 second
        }
        return prev + 1;
      });
    }
  }

  const routeHome = () => {
    navigate('/')
  }
  const [timer, setTimer] = useState(300); // 5 minutes = 300 seconds
  const [canResend, setCanResend] = useState(false);

  let countdown: any;
  useEffect(() => {
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    if (timer == 0) {
      setCanResend(true);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  const formatTime = (time: any) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };
  const handleResendOtp = async () => {
    try {
      if (!process.env.isLocal) {
        sessionStorage.removeItem('otp_id')
        const response = await axiosInstance.post(`${process.env.URL}auth/forgot/adminPassword`, {
          email: email
        })

        if (response.status === 200) {
          setTimer(300);
          setCanResend(false);
          setOtp(Array(4).fill(''));
          const otp_id = response.data.data;
          sessionStorage.setItem("otp_id", otp_id);
          toast.success('OTP Resent Successfully', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        }
      } else {
        sessionStorage.setItem("otp_id", 'test_otp_id');
      }
    } catch (error: any) {
      const msg = error.response.data.message;
      toast.error(msg, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }


  };
  return (
    <div className="bg">
      <ToastContainer></ToastContainer>
      <div className="frame">
        <div className="head">
          <img src={logo} className="logo" onClick={routeHome}></img>
          <p className="tagline">Delivering Compelling Pharma Insights</p>
          {OtpVisible ? (
            <p className="text">
              Please enter the OTP sent to your email address.
            </p>
          ) : (
            <p className="text">
              Please enter your email address. We'll send you an email that will
              allow you to reset your password.
            </p>
          )}

        </div>

        {OtpVisible ? (
          <div className="form">
            <form onSubmit={handleOTP} className="otp_form">
              <div className="otp-form-input">
                <label className="input-label" htmlFor="name">
                  OTP
                </label>
                <OtpPage length={4} otp={otp} setOtp={setOtp} onComplete={(otp) => updateOtp(otp)} />
              </div>
              <div className="w-100 d-flex justify-content-between align-items-center mb-3 px-2">
                <span style={{ fontSize: "14px" }}>OTP expires in {formatTime(timer)}</span>
                <div></div>
                <Button
                  variant="link"
                  disabled={!canResend}
                  onClick={handleResendOtp}
                  className={`resend_btn p-0 ${(canResend ? "" : "text-muted")}`}
                >
                  Resend OTP
                </Button>
              </div>
              <button type="submit" >Verify OTP</button>
            </form>
          </div>
        ) : (
          <div className="form">
            <form onSubmit={handleSendEmail}>
              <div className="form-input">
                <label className="input-label" htmlFor="name">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="inp"
                  name="email"
                  placeholder="example@gmail.com"
                  onChange={handleEmailChange}

                />
                {(emailError !== '') && <span className="error">{emailError}</span>}
              </div>
              <div className="form-extras-2">
                <div className="cancel">
                  <a onClick={routeHome}>Cancel</a>
                </div>
              </div>
              <button type="submit">Send Email</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
