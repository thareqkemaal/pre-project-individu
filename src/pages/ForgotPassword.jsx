import React from "react";
import axios from "axios";
import { API_URL } from "../helper";
import { useNavigate } from "react-router-dom";
import bg from '../images/bg.jpg';
import Footer from "../component/footer";
import check from '../images/check.png';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
} from '@chakra-ui/react';

const ForgotPassPage = (props) => {
    const [userData, setUserData] = React.useState([]);
    const [inputForgot, setInputForgot] = React.useState("");
    const [displayText, setDisplayText] = React.useState(false);
    const [toggleOpen, setToggleOpen] = React.useState(false);

    const navigate = useNavigate();

    React.useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            let res = await axios.get(API_URL + '/auth/users');
            console.log(res.data)
            setUserData(res.data);
        } catch (error) {
            console.log(error)
        }
    };

    const search = async () => {
        try {
            if (userData.length > 0){
                
                let check = userData.map((val, idx) => {
                    if (val.username == inputForgot || val.email == inputForgot){
                       return true;
                    } else {
                        return false;
                    }
                })

                if (check == true || inputForgot == ""){
                    setDisplayText(true);
                    setTimeout(() => {
                        setDisplayText(false);
                    }, 5000);
                } else {
                    //disini axios ke api
                    setToggleOpen(true);
                    setTimeout(() => {
                        setToggleOpen(false);
                        //navigate("/login")
                    }, 5000);
                }

            } else {
                alert("user not exist");
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
                                <div className="row py-5">
                                    <div className="col-1">{/*BLANK SPACE*/}</div>
                                    {/*INPUT FORM*/}
                                    <div className="col-10">
                                        <div className="fs-1 fw-bold color-eee">FORGOT PASSWORD.</div>
                                        <div className="row">
                                            <div className="col-12">
                                                <span className="color-eee">Enter your email or username :</span>
                                            </div>
                                            {/*USERNAME EMAIL INPUT*/}
                                            <div className="col-12 bg-color-eee my-3">
                                                <div className="row">
                                                    <div className="col-2 col-sm-1 bg-color-dfb d-flex justify-content-center align-items-center">
                                                        <span className="material-icons color-231">
                                                            person
                                                        </span>
                                                    </div>
                                                    <div className="col-10 col-sm-11 py-2">
                                                        <input className="fs-5 p-2 w-100 bg-transparent color-231"
                                                            type="text"
                                                            placeholder="Username or Email"
                                                            onChange={(e) => setInputForgot(e.target.value)}>
                                                        </input>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="color-red">{displayText == true ? "Username/Email not exist" : ""}</span>
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
                                        style={{ borderRadius: "20px" }} onClick={search}>SEARCH
                                    </button>
                                </div>
                                <div className="col-2 col-sm-3"></div>
                            </div>
                            <Modal closeOnOverlayClick={false} isOpen={toggleOpen} isCentered>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader className="text-center fw-bold fs-3 color-253">Thank you for the Registration</ModalHeader>
                                    <ModalBody className="d-flex flex-column align-items-center">
                                        <img src={check} style={{ width: "150px" }} />
                                        <span className="fw-bold my-3 fs-5 color-253">Please check your email</span>
                                    </ModalBody>
                                </ModalContent>
                            </Modal>
                        </div>
                    </div>
                    <div className="d-none d-sm-block col-sm-1 col-lg-3"></div>
                </div>
            </div>
            <Footer />
        </div>
    )
};

export default ForgotPassPage;