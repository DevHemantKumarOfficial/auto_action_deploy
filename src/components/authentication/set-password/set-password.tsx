import { useState } from "react";
import "./set-password.css";
import "../auth-common.css"
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import axiosInstance from "../../config/axiosConfig";
import logo from "../../../assets/images/inphamed-logo.svg"

export const SetPassword = () => {

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passMatchError, setPassMatchError] = useState("");


    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleNewPassword = (event: any) => {
        const { value } = event.target;
        validatePassword();
        setNewPassword(value);
    };

    const handleConfirmPassword = (event: any) => {
        const { value } = event.target;
        setConfirmPassword(value);
    };

    const navigate = useNavigate();

    const routeHome = () => {
        navigate("/");
    };

    const validatePassword = () => {
        // e.preventDefault();
        const password = newPassword;
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
            // handleSubmit();
        } else {
            setPasswordError(
                "Password must contain at least 8 characters, including uppercase, lowercase, numeric, and special characters."
            );
        }
    };

    const handleSubmit = async (event: any) => {
        event?.preventDefault();
        try {
            if ((newPassword === confirmPassword) && passwordError == '') {
                const userId = sessionStorage.getItem("user_id");

                if (!userId) {
                    throw new Error("User ID not found in session storage");
                }

                if (!process.env.isLocal) {
                    const response = await axiosInstance.post(
                        `${process.env.URL}auth/forgot/password/updatePassword`,
                        {
                            userID: userId,
                            password: newPassword,
                        }
                    );

                    if (response.status === 200) {

                        toast.success("Password Changed Successfully", {
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
                            sessionStorage.clear()
                            navigate("/");
                        }, 900);
                    }
                } else {
                    navigate("/");
                }
            } else {
                throw new Error("Passwords must match");
            }
        } catch (error: any) {
            let errorMsg = "An error occurred";
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                errorMsg = error.response.data.message;
            } else if (error.message) {
                errorMsg = error.message;
            }
            toast.error(errorMsg, {
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
    }

    const checkPasswordMatch = (e: any) => {
        const { value } = e.target;
        if (value != newPassword) {
            setPassMatchError("Both passwords are not same.")
        } else {
            setPassMatchError("")
        }
    }



    return (
        <div className="bg">
            <ToastContainer></ToastContainer>
            <div className="frame">
                <div className="head">
                    <img src={logo} className="logo" onClick={routeHome}></img>
                    <p className="tagline">Delivering Compelling Pharma Insights</p>
                </div>
                <div className="form">
                    <form >

                        <div className="form-input">
                            <label className="input-label" htmlFor="name">Enter New Password </label>
                            <input
                                id="password"
                                type="password"
                                className="inp"
                                name="password"
                                onChange={handleNewPassword}
                                onBlur={validatePassword}
                            />
                            {(passwordError !== "") && <span className="error">{passwordError}</span>}

                        </div>

                        <div className="form-input">
                            <label className="input-label" htmlFor="name">Confirm Password</label>
                            <input
                                type={passwordVisible ? "text" : "password"}
                                id="confirmPassword"
                                className="inp"
                                name="confirmPassword"
                                onBlur={checkPasswordMatch}
                                onChange={handleConfirmPassword}
                            />
                            {(passMatchError !== "") && <span className="error">{passMatchError}</span>}
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


                        <button
                            onClick={handleSubmit}
                            disabled={
                                newPassword == "" ||
                                confirmPassword == "" ||
                                newPassword !== confirmPassword
                            }>Submit</button>
                    </form>
                </div>
            </div>

        </div>
    );


};

export default SetPassword;