import React from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../helper";
import bg from '../images/bg.jpg';
import verif from '../images/verif.png';
import failed from '../images/failed.png';
import Footer from "../component/footer";
import { Text } from "@chakra-ui/react";

const VerificationPage = (props) => {
    const { token } = useParams();
    const [show, setShow] = React.useState("");
    const navigate = useNavigate();

    React.useEffect(() => {
        getDataToken();
    }, []);

    const getDataToken = async () => {
        let res = await axios.get(API_URL + '/auth/users')

        let search = "";
        res.data.forEach((val) => {
            if (val.verifToken == token) {
                search = "true"
            }
        })

        if (search == "true") {
            getVerify();
        } else {
            setShow("failed")
        }
    }

    const getVerify = async () => {
        try {
            let getRes = await axios.patch(API_URL + '/auth/verify', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (getRes.data.success) {
                setShow("");
            }
        } catch (error) {
            if (error.response.status == 401) {
                setShow("failed");
            }
        }
    };

    return (
        <div className="static-bg" style={{ backgroundImage: `url(${bg})` }}>
            <div className="container">
                <div className="row vh-100">
                    <div className="d-none d-md-block col-md-3"></div>
                    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                        <div className="row m-0 w-100 h-75">
                            <div className="col-12 shadow-lg bg-color-eee d-flex align-items-center justify-content-center"
                                style={{ borderRadius: "30px", zIndex: "2" }}>
                                {
                                    show == "failed" ?
                                        <div className="d-flex flex-column align-items-center justify-content-center color-231">
                                            <Text className="fw-bold fs-1">EMAIL VERIFICATION FAILED</Text>
                                            <Text className="fw-bold fs-2">LINK EXPIRED / INVALID</Text>
                                            <img src={failed} style={{ width: "200px" }} />
                                            <Text className="fw-bold">Please login and go to your profile to repeat email verification</Text>
                                        </div>
                                        :
                                        <div className="d-flex flex-column align-items-center justify-content-center color-231">
                                            <Text className="fw-bold fs-1">CONGRATULATIONS!</Text>
                                            <Text className="fw-bold fs-2">EMAIL VERIFICATION SUCCESS</Text>
                                            <img src={verif} style={{ width: "200px" }} />
                                        </div>
                                }
                            </div>
                            {/*VERIFY BUTTON*/}
                            <div className="col-12 d-flex justify-content-center">
                                <div className="d-none d-sm-block col-sm-3 col-lg-3"></div>
                                <div className="col-12 col-sm-6 col-lg-6">
                                    {
                                        localStorage.getItem("activeUser") ?
                                            <button type="button" className="btn btn-color-231 w-100 border-0 rounded-top shadow-lg text-center fs-4"
                                                style={{ borderRadius: "20px" }}
                                                onClick={() => { navigate("/home", { replace: true }); window.location.reload(); }}>
                                                HOMEPAGE
                                            </button>
                                            :
                                            <button type="button" className="btn btn-color-231 w-100 border-0 rounded-top shadow-lg text-center fs-4"
                                                style={{ borderRadius: "20px" }}
                                                onClick={() => navigate("/login", { replace: true })}>
                                                LOGIN
                                            </button>
                                    }
                                </div>
                                <div className="d-none d-sm-block col-sm-3 col-lg-3"></div>
                            </div>
                        </div>
                    </div>
                    <div className="d-none d-md-block col-md-3"></div>
                </div>
            </div>
            <Footer />
        </div>
    )
};

export default VerificationPage;