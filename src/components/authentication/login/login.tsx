import { useEffect, useState } from "react";
import "./login.css";
import "../auth-common.css"
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/images/inphamed-logo.svg"
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../auth-guard/auth-context";
import axiosInstance from "../../config/axiosConfig";

export const Login = () => {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load stored credentials
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');
    if (storedEmail) {
      setFormData(prevFormData => ({ ...prevFormData, email: storedEmail }));
      setRememberMe(true);
    }
    if (storedPassword) {
      setFormData(prevFormData => ({ ...prevFormData, password: storedPassword }));
    }
  }, []);
  // Handle input changes
  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });

  };

  const handleEmailChange = (event: any) => {
    handleChange(event);
    const { value } = event.target;
    if (!validateEmail(value)) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
    }
  }
  const handlePasswordChange = (event: any) => {
    handleChange(event);
    validatePassword(event);
  }

  const handleRememberMeChange = (e: any) => {
    setRememberMe(e.target.checked);
  };

  const { login } = useAuth();


  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (rememberMe) {
      localStorage.setItem('email', formData.email);
      localStorage.setItem('password', formData.password);
    } else {
      localStorage.removeItem('email');
      localStorage.removeItem('password');
    }

    let valid = true;

    if (emailError !== '' || passwordError !== '') {
      valid = false;
    }


    if (valid) {
      try {
        if (!process.env.isLocal) {
          const response = await axiosInstance.post(`${process.env.URL}auth/adminLogin`, {
            email: formData.email,
            password: formData.password
          });
          if (response.status === 200) {
            const data = response.data.data;
            sessionStorage.setItem("user_id", data.id);
            sessionStorage.setItem("user_name", data.userName);
            login();
            toast.success('Login Successfull', {
              position: "top-center",
              autoClose: 700,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            });
            setTimeout(() => {
              navigate('/dashboard');
            }, 900)

          } else {
            toast.error('Invalid Credentials!', {
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
          toast.success('Login Successfull', {
            position: "top-center",
            autoClose: 700,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
          sessionStorage.setItem("user_id", "Test_ID");
          sessionStorage.setItem("user_name", "Demo User");
          setTimeout(() => {
            navigate('/dashboard');
          }, 900)
        }
      } catch (error: any) {
        const msg = error.response.data.message;
        console.log("Error : ", msg);

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


    }
  };


  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (e: any) => {
    // e.preventDefault();

    const password = formData.password || e.target.value;
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    ) {
      setPasswordError("");

    } else {
      setPasswordError(
        "Password must contain at least 8 characters, including uppercase, lowercase, numeric, and special characters."
      );
    }
  };


  const moveToResetPassword = () => {
    navigate('reset-Password');
  }

  return (
    <div className="bg">
      <ToastContainer></ToastContainer>
      <div className="frame">
        <div className="head">
          <img src={logo} className="logo"></img>
          {/* <img className="logo" src="/src/assets/images/inphamed-logo.svg" alt="inphamed-logo" /> */}
          <p className="tagline">Automation test 2</p>
        </div>
        <div className="form">
          <form onSubmit={handleSubmit}>
            <div className="form-input">
              <label className="input-label" htmlFor="name">Email Address</label>
              <input
                type="email"
                id="email"
                className="inp"
                name="email"
                value={formData.email}
                placeholder="example@gmail.com"
                onChange={handleEmailChange}
              />
              {emailError && <span className="error">{emailError}</span>}
            </div>

            <div className="form-input">
              <label className="input-label" htmlFor="name">Password</label>


              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                className="inp"
                name="password"
                value={formData.password}
                onChange={handlePasswordChange}
                onBlur={validatePassword}
              />
              {passwordError && <span className="error">{passwordError}</span>}
              <span
                className="password-toggle-icon"
                onClick={togglePasswordVisibility}
              >
                <i
                  className={
                    passwordVisible ? "fas fa-eye" : "fas fa-eye-slash"
                  }
                ></i>
              </span>


            </div>
            <div className="form-extras">
              <div className="remember-me">
                <input className="checkbox" type="checkbox" name="remember-me" id="remember-me" checked={rememberMe}
                  onChange={handleRememberMeChange} />
                <span className="text">Remember me</span>
              </div>
              <div className="reset-password">
                <a onClick={moveToResetPassword} >Reset Password ?</a>
              </div>
            </div>

            <button type="submit">Log In</button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default Login;