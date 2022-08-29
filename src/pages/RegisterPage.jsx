import React from "react";
import axios from "axios";
import { API_URL } from '../helper.js';
import { useNavigate } from "react-router-dom";
import { usePasswordValidation } from "../component/PasswordChecker.js";
import bg from '../images/bg.jpg';
import check from '../images/check.png';
import logo from '../images/gazebologolight.png';
import Footer from "../component/footer";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';

const RegisterPage = (props) => {
    // get data user
    const [dataUsers, setDataUsers] = React.useState([]);
    // input
    const [inputUser, setInputUser] = React.useState("");
    const [inputEmail, setInputEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [repeatPassword, setRepeatPassword] = React.useState("");
    // check input
    const [checkEmail, setCheckEmail] = React.useState("");
    const [checkUsername, setCheckUsername] = React.useState("");
    // toggle password
    const [passwordType, setPasswordType] = React.useState("password");
    const [repeatPasswordType, setRepeatPasswordType] = React.useState("password");
    // password validation
    const [
        validLength,
        hasNumber,
        upperCase,
        lowerCase,
        match,
        specialChar,
    ] = usePasswordValidation({
        firstPassword: password,
        secondPassword: repeatPassword,
    });

    const [toggleOpen, setToggleOpen] = React.useState(false);
    const [toggleSpinner, setToggleSpinner] = React.useState(false);
    const [toggleDisable, setToggleDisable] = React.useState(false);

    const navigate = useNavigate();
    const toast = useToast();

    React.useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            let res = await axios.get(API_URL + "/auth/users")
            console.log("getData registerpage", res.data);
            setDataUsers(res.data);
        } catch (error) {
            console.log(error)
        }
    };

    const togglePassword = () => {
        if (passwordType === "password") {
            setPasswordType("text")
        } else {
            setPasswordType("password")
        }
        // console.log(passwordType);
    };

    const toggleRepeatPassword = () => {
        if (repeatPasswordType === "password") {
            setRepeatPasswordType("text")
        } else {
            setRepeatPasswordType("password")
        }
        // console.log(repeatPasswordType);
    };

    const validateEmail = (email) => {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    const btnCheckRegister = async () => {
        try {
            if (dataUsers.length > 0) {
                let newUser = "";
                let newEmail = "";
                let check = [];

                dataUsers.forEach((val, idx) => {
                    if (val.username === inputUser) {
                        setCheckUsername("Username has already taken");
                        setPassword("");
                        setRepeatPassword("");
                        setTimeout(() => {
                            setCheckUsername("");
                        }, 3000);
                        setInputUser("");
                        check.push(false)
                    } else {
                        if (inputUser.length < 6) {
                            setCheckUsername("Username should have min. 6 characters");
                            setPassword("");
                            setRepeatPassword("");
                            setTimeout(() => {
                                setCheckUsername("");
                            }, 3000);
                            setInputUser("");
                            check.push(false)
                        } else {
                            newUser = inputUser;
                            console.log(newUser);
                            check.push(true)
                        }
                    }

                    if (validateEmail(inputEmail)) {
                        if (val.email === inputEmail) {
                            setCheckEmail("Email has already taken");
                            setPassword("");
                            setRepeatPassword("");
                            setTimeout(() => {
                                setCheckEmail("");
                            }, 3000);
                            setInputEmail("");
                            check.push(false)
                        } else {
                            newEmail = inputEmail;
                            console.log(newEmail);
                            check.push(true)
                        }
                    } else {
                        setCheckEmail("Enter a Valid Email");
                        setPassword("");
                        setRepeatPassword("");
                        setTimeout(() => {
                            setCheckEmail("");
                        }, 3000)
                        setInputEmail("");
                        check.push(false)
                    }
                })

                // console.log("check", check);
                // console.log("includes false", check.includes(false));
                // console.log("includes false reverse", !check.includes(false));

                if (!check.includes(false)) {
                    if (password === repeatPassword) {
                        let inputNewUser = {
                            username: newUser,
                            email: newEmail,
                            password: password
                        };

                        setToggleDisable(true);
                        setToggleSpinner(true);
                        let res = await axios.post(API_URL + "/auth/register", inputNewUser);
                        //console.log('response api', res.data);
                        if (res.data.success) {
                            setTimeout(() => {
                                setToggleOpen(true);
                            }, 3000);
                            setTimeout(() => {
                                navigate("/login");
                            }, 5000);
                        }
                    } else {
                        setPassword("");
                        setRepeatPassword("");
                        toast({
                            description: "Password not Match",
                            status: "error",
                            duration: 3000,
                            isClosable: true,
                            position: "top-right"
                        })
                    }
                }
            } else {
                if (inputUser != "" && inputEmail != "" && password != "") {
                    let newUser = "";
                    let newEmail = "";

                    if (inputUser.length < 6) {
                        setCheckUsername("Username should have min. 6 characters");
                        setPassword("");
                        setRepeatPassword("");
                        setTimeout(() => {
                            setCheckUsername("");
                        }, 3000);
                        setInputUser("");
                    } else {
                        newUser = inputUser;
                    }

                    if (validateEmail(inputEmail)) {
                        newEmail = inputEmail;
                    } else {
                        setCheckEmail("Input a Valid Email");
                        setPassword("");
                        setRepeatPassword("");
                        setTimeout(() => {
                            setCheckEmail("");
                        }, 3000);
                        setInputEmail("");
                    };

                    if (newUser != "" && newEmail != "" && password != "") {
                        if (password == repeatPassword) {
                            let inputNewUser = {
                                username: newUser,
                                email: newEmail,
                                password: password
                            };

                            //console.log(inputNewUser);

                            setToggleDisable(true);
                            setToggleSpinner(true);
                            let res = await axios.post(API_URL + "/auth/register", inputNewUser);
                            console.log('response api', res.data);
                            if (res.data.success) {
                                setToggleOpen(true);
                                setTimeout(() => {
                                    navigate("/login", { replace: true });
                                }, 4000);
                            }
                        } else {
                            setPassword("");
                            setRepeatPassword("");
                            toast({
                                description: "Password not Match",
                                status: "error",
                                duration: 3000,
                                isClosable: true,
                                position: "top-right"
                            })
                        }
                    }
                } else {
                    toast({
                        description: "Input a Valid data",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                        position: "top-right"
                    })
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="static-bg" style={{ backgroundImage: `url(${bg})` }}>
            <div className="container">
                <div className="row vh-100">
                    <div className="d-none d-md-block col-md-1"></div>
                    <div className="col-12 col-md-10 d-flex align-items-center justify-content-center">
                        <div className="shadow-lg w-75 bg-color-231 d-flex flex-column align-items-center justify-content-center"
                            style={{ borderRadius: "30px", zIndex: "2", maxHeight: "90%" }}>
                            <img src={logo} style={{ position: "absolute", zIndex: "3", opacity: "0.2" }} />
                            <div className="d-flex align-items-center justify-content-center" style={{ zIndex: "4" }}>
                                {/*LOGIN FORM*/}
                                <div className="row mb-5 mt-4 w-75">
                                    <div className="d-none d-sm-block col-1">{/*BLANK SPACE*/}</div>
                                    {/*INPUT FORM*/}
                                    <div className="col-12 col-sm-10">
                                        <div className="row">
                                            <div className="col-12 fs-1 mb-3 fw-bold color-eee">REGISTER.</div>
                                            {/*USERNAME*/}
                                            <div className="col-12 bg-color-eee mb-2">
                                                <div className="row">
                                                    <div className="col-2 col-sm-1 bg-color-dfb d-flex justify-content-center align-items-center">
                                                        <span className="material-icons color-231">
                                                            person
                                                        </span>
                                                    </div>
                                                    <div className="col-10 col-sm-11 py-2">
                                                        <input className="bg-transparent color-231 fs-5 p-2 w-100"
                                                            type="text"
                                                            placeholder="Username"
                                                            onChange={(e) => setInputUser(e.target.value)}
                                                            value={inputUser}
                                                            minLength={6}>
                                                        </input>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-2" style={{ color: "red" }}>{checkUsername}</div>
                                            {/*EMAIL*/}
                                            <div className="col-12 bg-color-eee my-2">
                                                <div className="row">
                                                    <div className="col-2 col-sm-1 bg-color-dfb d-flex justify-content-center align-items-center">
                                                        <span className="material-icons color-231">
                                                            alternate_email
                                                        </span>
                                                    </div>
                                                    <div className="col-10 col-sm-11 py-2">
                                                        <input className="bg-transparent color-231 fs-5 p-2 w-100"
                                                            type="text"
                                                            placeholder="Email"
                                                            onChange={(e) => setInputEmail(e.target.value)}
                                                            value={inputEmail}>
                                                        </input>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-2" style={{ color: "red" }}>{checkEmail}</div>
                                            {/*PASSWORD*/}
                                            <div className="col-12 bg-color-eee my-2">
                                                <div className="row">
                                                    <div className="col-2 col-sm-1 bg-color-dfb d-flex justify-content-center align-items-center">
                                                        <span className="material-icons color-231">
                                                            key
                                                        </span>
                                                    </div>
                                                    <div className="col-6 col-sm-8 py-2">
                                                        <input className=" fs-5 p-2 w-100 bg-transparent color-231"
                                                            type={passwordType}
                                                            placeholder="Password"
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            value={password}>
                                                        </input>
                                                    </div>
                                                    <div className="col-1 d-flex justify-content-center align-items-center">
                                                        <span className="material-icons color-green">{match ? "check_circle" : ""}</span>
                                                    </div>
                                                    <div className="col-2 d-flex justify-content-center align-items-center">
                                                        <span type="button"
                                                            className="material-icons"
                                                            onClick={togglePassword}>
                                                            {passwordType === "password" ? "visibility_off" : "visibility"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 color-eee">
                                                <ul className="row" style={{ listStyleType: "none" }}>
                                                    <li className="col-12">Password must contain :</li>
                                                    <li className={validLength ? "color-green col-8 col-lg-4 text-center" : "color-red col-8 col-lg-4 text-center"}>min. 8 Characters</li>
                                                    <li className={upperCase ? "color-green col-4 col-lg-2 text-center" : "color-red col-4 col-lg-2 text-center"}>Capital</li>
                                                    <li className={hasNumber ? "color-green col-8 col-lg-2 text-center" : "color-red col-8 col-lg-2 text-center"}>Number</li>
                                                    <li className={specialChar ? "color-green col-4 col-lg-2 text-center" : "color-red col-4 col-lg-2 text-center"}>Symbol</li>
                                                </ul>
                                            </div>
                                            {/*REPEAT PASSWORD*/}
                                            <div className="mt-2 mb-2 bg-color-eee">
                                                <div className="row">
                                                    <div className="col-2 col-sm-1 bg-color-dfb d-flex justify-content-center align-items-center">
                                                        <span className="material-icons color-231">
                                                            key
                                                        </span>
                                                    </div>
                                                    <div className="col-6 col-sm-8 py-2">
                                                        <input className="bg-transparent color-231 fs-5 p-2 w-100" type={repeatPasswordType}
                                                            placeholder="Repeat Password"
                                                            onChange={(e) => setRepeatPassword(e.target.value)}
                                                            value={repeatPassword}
                                                            disabled={validLength && hasNumber && upperCase && specialChar ? false : true}
                                                        ></input>
                                                    </div>
                                                    <div className="col-1 d-flex justify-content-center align-items-center">
                                                        <span className="material-icons color-green">{match ? "check_circle" : ""}</span>
                                                    </div>
                                                    <div className="col-2 d-flex justify-content-center align-items-center">
                                                        <span type="button" className="material-icons" onClick={toggleRepeatPassword}
                                                        >{repeatPasswordType === "password" ? "visibility_off" : "visibility"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {/*HAVE ACCOUNT*/}
                                            <div className="col-12">
                                                <div className="d-flex justify-content-between color-eee">
                                                    <span>Already have an account?<span> </span>
                                                        <span id="txt-dec-u" className="fw-bold color-eee"
                                                            onClick={() => navigate("/login")}>
                                                            Sign In Here
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                            {/*REGISTER BUTTON*/}
                                            <div className="col-12 w-100 mt-2 d-flex justify-content-center">
                                                <div className="col-12 col-sm-6 col-lg-6 w-100">
                                                    <button id="btn-light" type="button" className="btn btn-color-eee w-100 border-0 shadow-lg text-center fs-3 py-2 fw-bold"
                                                        style={{ borderRadius: "10px" }}
                                                        onClick={() => {
                                                            btnCheckRegister();
                                                        }}
                                                        disabled={toggleDisable}
                                                    >
                                                        {
                                                            toggleSpinner ?
                                                                <div className="spinner-border" role="status">
                                                                    <span className="visually-hidden">Loading...</span>
                                                                </div>
                                                                :
                                                                <span>REGISTER</span>
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-none d-sm-block col-1">{/*BLANK SPACE*/}</div>
                                </div>
                                <Modal closeOnOverlayClick={false} isOpen={toggleOpen} isCentered>
                                    <ModalOverlay />
                                    <ModalContent>
                                        <ModalHeader className="text-center fw-bold fs-3 color-231">Thank you for the Registration</ModalHeader>
                                        <ModalBody className="d-flex flex-column align-items-center">
                                            <img src={check} style={{ width: "150px" }} />
                                            <span className="fw-bold my-3 fs-5 color-231">Please check your email</span>
                                        </ModalBody>
                                    </ModalContent>
                                </Modal>
                            </div>
                        </div>
                    </div>
                    <div className="d-none d-md-block col-md-1"></div>
                </div>
            </div>
            <Footer />
        </div>
    )
};

export default RegisterPage;