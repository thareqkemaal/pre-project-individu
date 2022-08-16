import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../component/footer";
import bg from '../images/bgdark.jpg';
import logincover from '../images/logincover.jpg';
import logo from '../images/gazebologo.png';

const LandingPage = (props) => {
    const navigate = useNavigate();

    return (
        <div className="static-bg" style={{ backgroundImage: `url(${bg})` }}>
            <div className="d-flex">
                {/*LEFT SIDE*/}
                <div className="d-none d-lg-flex col-lg-6">
                    <img style={{ maxWidth: "100%", maxHeight: "100%" }} src={logincover} />
                </div>
                {/*RIGHT SIDE*/}
                <div className="col-12 col-lg-6 py-5 p-lg-5 text-center color-eee" style={{ height: "100vh" }}>
                    <div>
                        <div>
                            <img className="mx-auto" src={logo} style={{ width: "100px" }} />
                        </div>
                        <div className="my-2">
                            <span className="fw-bold d-none d-md-block" style={{ fontSize: "75px" }}>LETS GO!</span>
                        </div>
                        <div className="my-2">
                            <span className="fw-bold d-block d-md-none" style={{ fontSize: "60px" }}>LETS GO!</span>
                        </div>
                        <div>
                            <span className="fw-bold fs-2">Join Gazebo now!</span>
                        </div>
                        <div className="mt-4">
                            <button type="button" className="btn btn-primary fs-4 w-50"
                                onClick={() => navigate("/register")}>Sign Up</button>
                        </div>
                        <div className="my-2">
                            <span className="fs-5">or</span>
                        </div>
                        <div>
                            <span className="fs-5">Already have an account?</span>
                        </div>
                        <div className="my-3">
                            <button type="button" className="btn btn-color-eee-outlined fs-4 w-50"
                                onClick={() => navigate("/login")}>Sign In</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
};

export default LandingPage;