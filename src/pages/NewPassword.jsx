import React from "react";
import bg from '../images/bg.jpg';
import Footer from "../component/footer";
import { usePasswordValidation } from "../component/PasswordChecker.js";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../helper";
import { useToast } from '@chakra-ui/react';

const NewPassPage = (props) => {

    const [password, setPassword] = React.useState("");
    const [repeatPassword, setRepeatPassword] = React.useState("");
    const [passwordType, setPasswordType] = React.useState("password");
    const [repeatPasswordType, setRepeatPasswordType] = React.useState("password");

    const navigate = useNavigate();
    const { token } = useParams();
    const toast = useToast();

    const [show, setShow] = React.useState("");

    React.useEffect(() => {
        getDataToken();
    }, []);

    const getDataToken = async () => {
        let res = await axios.get(API_URL + '/auth/users')

        let search = "";
        res.data.forEach((val) => {
            if (val.passToken == token) {
                search = "true"
            }
        })

        if (search != "true") {
            setShow("failed")
        }
    };

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

    const togglePassword = () => {
        if (passwordType === "password") {
            setPasswordType("text")
        } else {
            setPasswordType("password")
        }
        console.log(passwordType);
    };

    const toggleRepeatPassword = () => {
        if (repeatPasswordType === "password") {
            setRepeatPasswordType("text")
        } else {
            setRepeatPasswordType("password")
        }
        console.log(repeatPasswordType);
    };

    const resetBtn = async () => {
        try {
            let res = await axios.patch(API_URL + '/auth/updatepass', { password: password }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.data.success) {
                toast({
                    title: "Password Updated",
                    position: 'top',
                    status: "success",
                    isClosable: true,
                });
                navigate('/login', { replace: true })
            }
        } catch (error) {
            console.log(error)
        }
    };

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
                                        {
                                            show == "failed" ?
                                                <div className="fs-1 fw-bold color-eee text-center">SORRY, INVALID LINK</div>
                                                :
                                                <>
                                                    <div className="fs-1 fw-bold color-eee">RESET PASSWORD.</div>
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <span className="fw-bold color-eee">Create New Password :</span>
                                                        </div>
                                                        {/*PASSWORD*/}
                                                        <div className="col-12 bg-color-eee my-2">
                                                            <div className="row">
                                                                <div className="col-2 col-sm-1 bg-color-dfb d-flex justify-content-center align-items-center">
                                                                    <span className="material-icons color-231">key</span>
                                                                </div>
                                                                <div className="col-6 col-sm-8 py-2">
                                                                    <input className="bg-transparent color-231 fs-5 p-2 w-100" type={passwordType} placeholder="Password"
                                                                        onChange={(e) => setPassword(e.target.value)}></input>
                                                                </div>
                                                                <div className="col-1 d-flex justify-content-center align-items-center">
                                                                    <span className="material-icons color-green">{match ? "check_circle" : ""}</span>
                                                                </div>
                                                                <div className="col-2 d-flex justify-content-center align-items-center">
                                                                    <span type="button" className="material-icons color-231" onClick={togglePassword}
                                                                    >{passwordType === "password" ? `visibility_off` : `visibility`}</span>
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
                                                        <div className=" bg-color-eee mt-2 mb-2">
                                                            <div className="row">
                                                                <div className="col-2 col-sm-1 bg-color-dfb d-flex justify-content-center align-items-center">
                                                                    <span className="material-icons color-231">key</span>
                                                                </div>
                                                                <div className="col-6 col-sm-8 py-2">
                                                                    <input className="bg-transparent color-231 fs-5 p-2 w-100 " type={repeatPasswordType}
                                                                        placeholder="Repeat Password"
                                                                        onChange={(e) => setRepeatPassword(e.target.value)}
                                                                        disabled={validLength && hasNumber && upperCase && specialChar ? false : true}
                                                                    ></input>
                                                                </div>
                                                                <div className="col-1 d-flex justify-content-center align-items-center">
                                                                    <span className="material-icons color-green">{match ? "check_circle" : ""}</span>
                                                                </div>
                                                                <div className="col-2 d-flex justify-content-center align-items-center">
                                                                    <span type="button" className="material-icons color-231" onClick={toggleRepeatPassword}
                                                                    >{repeatPasswordType === "password" ? `visibility_off` : `visibility`}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                        }
                                    </div>
                                    <div className="col-1">{/*BLANK SPACE*/}</div>
                                </div>
                            </div>
                            {/*RESET BUTTON*/}
                            <div className="row">
                                <div className="col-2 col-sm-3"></div>
                                <div className="col-8 col-sm-6">
                                    {
                                        show == "failed" ?
                                            <button type="button" className="btn btn-color-eee w-100 rounded-top shadow-lg text-center fs-4 d-flex align-items-center justify-content-center"
                                                style={{ borderRadius: "20px" }}
                                                onClick={() => navigate("/")}>BACK
                                            </button>
                                            :
                                            <button type="button" className="btn btn-color-eee w-100 rounded-top shadow-lg text-center fs-4 d-flex align-items-center justify-content-center"
                                                style={{ borderRadius: "20px" }}
                                                disabled={match ? false : true}
                                                onClick={resetBtn}>RESET
                                            </button>
                                    }
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

export default NewPassPage;