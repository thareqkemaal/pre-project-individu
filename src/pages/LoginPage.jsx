import React from "react";
import axios from "axios";
import { API_URL } from "../helper";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginAction } from "../action/userAction";
import bg from '../images/bg.jpg';
import Footer from "../component/footer";
import { useToast } from '@chakra-ui/react'

const LoginPage = (props) => {

    const [userData, setUserData] = React.useState([]);
    const [password, setPassword] = React.useState("");
    const [inputUser, setInputUser] = React.useState("");
    const [passwordType, setPasswordType] = React.useState("password");
    const [message, setMessage] = React.useState(false);

    const [toggleSpinner, setToggleSpinner] = React.useState(false);
    const [toggleDisable, setToggleDisable] = React.useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast();

    React.useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            let res = await axios.get(API_URL + '/auth/users');
            setUserData(res.data);
            //console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const togglePassword = () => {
        if (passwordType === "password") {
            setPasswordType("text")
        } else {
            setPasswordType("password")
        }
        console.log(passwordType);
    };

    const validateEmail = (email) => {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    const btnLogin = () => {
        if (userData.length > 0) {
            let userExist = "";
            userData.forEach((val, idx) => {
                if (val.username == inputUser || val.email == inputUser) {
                    userExist = "true"
                }
            })

            if (userExist == "true") {
                //console.log('acount exist');

                let loginUsername = "";
                let loginEmail = "";
                let loginPassword = "";

                if (inputUser.includes("@") || inputUser.includes(".com")) {
                    if (validateEmail(inputUser)) {
                        loginEmail = inputUser;
                        loginPassword = password;
                    } else {
                        alert("Use a valid email")
                    }
                } else {
                    loginUsername = inputUser;
                    loginPassword = password;
                };

                let input = {
                    username: loginUsername,
                    email: loginEmail,
                    password: loginPassword
                };

                if (password != "") {
                    setToggleDisable(true);
                    setToggleSpinner(true);

                    setTimeout(async () => {
                        let res = await axios.post(API_URL + `/auth/login`, input);
                        // console.log(res.data)
                        if (res.data.token) {
                            console.log("data", res.data);
                            localStorage.setItem("activeUser", res.data.token);
                            delete res.data.token;
                            dispatch(loginAction(res.data));
                            navigate("/home", { replace: true });
                            toast({
                                description: `Welcome, ${res.data.username}`,
                                status: "success",
                                duration: 3000,
                                isClosable: true,
                                position: "top"
                            })
                        } else {
                            // console.log(res.data);
                            setMessage(true);
                            setInputUser("");
                            setPassword("");
                            setTimeout(() => {
                                setMessage(false);
                            }, 4000)
                            setToggleSpinner(false);
                        };
                    }, 3000);
                } else {
                    toast({
                        description: "Enter Your Password",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                        position: "top-right"
                    })
                }
            } else {
                setMessage(true);
                setInputUser("");
                setPassword("");
                setTimeout(() => {
                    setMessage(false);
                }, 4000)
            }
        } else {
            alert("account not registered") // pake toast
        }
    }

    return (
        <div className="static-bg" style={{ backgroundImage: `url(${bg})` }}>
            <div className="container">
                <div className="row vh-100">
                    <div className="d-none d-sm-block col-sm-1 col-lg-3"></div>
                    <div className="col-12 col-sm-10 col-lg-6 d-flex align-items-center justify-content-center">
                        <div className="d-flex flex-column">
                            <div className="shadow-lg w-100 h-100 bg-color-231" style={{ borderRadius: "30px" }}>
                                {/*LOGIN FORM*/}
                                <div className="row my-5">
                                    <div className="col-1">{/*BLANK SPACE*/}</div>
                                    {/*INPUT FORM*/}
                                    <div className="col-10">
                                        <div className="fs-1 fw-bold color-eee">SIGN IN.</div>
                                        <div className="row">
                                            {/*USERNAME EMAIL*/}
                                            <div className="col-12 bg-color-eee">
                                                <div className="row">
                                                    <div className="col-2 col-sm-1 bg-color-dfb d-flex justify-content-center align-items-center">
                                                        <span className="material-icons color-231">person</span>
                                                    </div>
                                                    <div className="col-10 col-sm-11 py-2">
                                                        <input className="bg-transparent fs-5 p-2 w-100 color-231" type="text" placeholder="Username or Email"
                                                            onChange={(e) => setInputUser(e.target.value)} value={inputUser}></input>
                                                    </div>
                                                </div>
                                            </div>
                                            {/*PASSWORD*/}
                                            <div className="col-12 mt-4 mb-2 bg-color-eee">
                                                <div className="row">
                                                    <div className="col-2 col-sm-1 bg-color-dfb d-flex justify-content-center align-items-center">
                                                        <span className="material-icons color-231">key</span>
                                                    </div>
                                                    <div className="col-8 col-sm-9 py-2">
                                                        <input className="bg-transparent fs-5 p-2 w-100 color-231" type={passwordType} placeholder="Password"
                                                            onChange={(e) => setPassword(e.target.value)} value={password}></input>
                                                    </div>
                                                    <div className="col-2 d-flex justify-content-center align-items-center">
                                                        <span type="button" className="material-icons color-231" onClick={togglePassword}
                                                        >{passwordType === "password" ? "visibility_off" : "visibility"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <span className="color-red">{message == true ?
                                                    "Wrong Username/Email or Password" : ""}</span>
                                            </div>
                                            {/*FORGOT PASSWORD*/}
                                            <div className="col-12">
                                                <div className="d-flex justify-content-between">
                                                    <span className="color-eee">Don't have an account yet?
                                                        <span> </span>
                                                        <span id="txt-dec-u" className="fw-bold color-eee"
                                                            onClick={() => navigate("/register")}>Register Here</span>
                                                    </span>
                                                    <span id="txt-dec-u" className="fw-bold color-eee"
                                                        onClick={() => navigate("/forgotpass")}>Forgot Password?</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-1">{/*BLANK SPACE*/}</div>
                                </div>
                            </div>
                            {/*LOGIN BUTTON*/}
                            <div className="row">
                                <div className="col-2 col-sm-3"></div>
                                <div className="col-8 col-sm-6">
                                    <button type="button" className="btn btn-color-eee w-100 border-0 rounded-top shadow-lg text-center fs-4"
                                        style={{ borderRadius: "20px" }}
                                        disabled={inputUser != "" || password != "" ? false : true}
                                        onClick={btnLogin}>
                                        {
                                            toggleSpinner ?
                                                <div className="spinner-border" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                :
                                                <span>LOGIN</span>
                                        }
                                    </button>
                                </div>
                                <div className="col-2 col-sm-3"></div>
                            </div>
                        </div>
                    </div>
                    <div className="d-none d-sm-block col-sm-1 col-lg-3"></div>
                </div>
            </div>
            <Footer />
        </div>
    )
};

export default LoginPage;