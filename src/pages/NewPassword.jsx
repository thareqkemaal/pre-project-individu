import React from "react";
import bgblur from '../images/bgblur.jpg';
import logo from '../images/gazebologo.png';
import Footer from "../component/footer";
import { usePasswordValidation } from "../component/PasswordChecker.js";
import { useNavigate } from "react-router-dom";

const NewPassPage = (props) => {
    
    const [password, setPassword] = React.useState("");
    const [repeatPassword, setRepeatPassword] = React.useState("");
    const [passwordType, setPasswordType] = React.useState("password");
    const [repeatPasswordType, setRepeatPasswordType] = React.useState("password");

    const navigate = useNavigate();

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
        if (passwordType === "password"){
            setPasswordType("text")
        } else {
            setPasswordType("password")
        }
        console.log(passwordType);
    };

    const toggleRepeatPassword = () => {
        if (repeatPasswordType === "password"){
            setRepeatPasswordType("text")
        } else {
            setRepeatPasswordType("password")
        }
        console.log(repeatPasswordType);
    };

    return (
    <div className="static-bg" style={{backgroundImage: `url(${bgblur})`}}>
        <div className="container">
            <div className="row vh-100">
                <div className="d-none d-sm-block col-sm-1 col-lg-3"></div>
                <div className="col-12 col-sm-10 col-lg-6 d-flex align-items-center justify-content-center">
                        <img src={logo} style={{width: "150px", position: "absolute", zIndex: "3", top: "5%"}}/>
                        <div className="d-flex flex-column">
                            <div className="shadow-lg w-100 h-100" style={{backgroundColor: "#e6e8ea", borderRadius: "30px"}}>
                                {/*LOGIN FORM*/}
                                <div className="row my-5 py-5">
                                        <div className="col-1">{/*BLANK SPACE*/}</div>
                                        {/*INPUT FORM*/}
                                        <div className="col-10">
                                            <div className="row">
                                                <div className="col-12">
                                                    <span className="fw-bold">Create New Password :</span>
                                                </div>
                                                {/*PASSWORD*/}
                                                <div className="col-12 bg-color-476 my-2">
                                                    <div className="row">
                                                        <div className="col-2 col-sm-1 bg-color-231 d-flex justify-content-center align-items-center">
                                                            <span className="material-icons text-white">key</span>
                                                        </div>
                                                        <div className="col-6 col-sm-9 py-2">
                                                            <input className="bg-transparent text-white fs-5 p-2 w-100" type={passwordType} placeholder="Password"
                                                            onChange={(e) => setPassword(e.target.value)}></input>
                                                        </div>
                                                        <div className="col-2 col-sm-1 d-flex justify-content-center align-items-center">
                                                            <span className="material-icons color-green">{match ? "check_circle" : ""}</span>
                                                        </div>
                                                        <div className="col-2 col-sm-1 d-flex justify-content-center align-items-center">
                                                            <span type="button" className="material-icons text-white" onClick={togglePassword}
                                                            >{passwordType === "password" ? `visibility_off` : `visibility`}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 color-231">
                                                    <ul className="row" style={{listStyleType: "none"}}>
                                                        <li className="col-12">Password must contain :</li>
                                                        <li className={validLength ? "color-green col-8 col-lg-4 text-center" : "color-red col-8 col-lg-4 text-center"}>min. 8 Characters</li>
                                                        <li className={upperCase ? "color-green col-4 col-lg-2 text-center" : "color-red col-4 col-lg-2 text-center"}>Capital</li>
                                                        <li className={hasNumber ? "color-green col-8 col-lg-2 text-center" : "color-red col-8 col-lg-2 text-center"}>Number</li>
                                                        <li className={specialChar ? "color-green col-4 col-lg-2 text-center" : "color-red col-4 col-lg-2 text-center"}>Symbol</li>
                                                    </ul>
                                                </div>
                                                {/*REPEAT PASSWORD*/}
                                                <div className=" bg-color-476 mt-2 mb-2">
                                                    <div className="row">
                                                        <div className="col-2 col-sm-1 bg-color-231 d-flex justify-content-center align-items-center">
                                                            <span className="material-icons text-white">key</span>
                                                        </div>
                                                        <div className="col-6 col-sm-9 py-2">
                                                            <input className="bg-transparent text-white fs-5 p-2 w-100 " type={repeatPasswordType} 
                                                            placeholder={validLength && hasNumber && upperCase && specialChar ? "Repeat Password" : "Repeat Password (Disabled)"}
                                                            onChange={(e) => setRepeatPassword(e.target.value)}
                                                            disabled={validLength && hasNumber && upperCase && specialChar ? false : true}
                                                            ></input>
                                                        </div>
                                                        <div className="col-2 col-sm-1 d-flex justify-content-center align-items-center">
                                                            <span className="material-icons color-green">{match ? "check_circle" : ""}</span>
                                                        </div>
                                                        <div className="col-2 col-sm-1 d-flex justify-content-center align-items-center">
                                                            <span type="button" className="material-icons text-white" onClick={toggleRepeatPassword}
                                                            >{repeatPasswordType === "password" ? `visibility_off` : `visibility`}</span>
                                                        </div>
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
                                        <button type="button" className="btn btn-secondary w-100 bg-color-476 border-0 rounded-top shadow-lg text-center fs-4 d-flex align-items-center justify-content-center"
                                            style={{borderRadius: "20px"}} onClick={() => navigate("/login")}
                                            disabled={match ? false : true}>NEXT
                                            <span className="material-icons">play_arrow</span>
                                        </button>
                                    </div>
                                    <div className="col-2 col-sm-3"></div>
                            </div>
                        </div>
                </div>
                <div className="d-none d-sm-block col-sm-1 col-lg-3"></div>
            </div>
        </div>
        <Footer/>
    </div>
    )
};

export default NewPassPage;