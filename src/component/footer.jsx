import React from "react";

const Footer = (props) => {

    return (
        <div style={{backgroundColor: "#231f20"}}>
            <div className="container py-3">
                <div className="row m-0 text-center">
                    <div className="footer-text col-4 col-sm-3 col-md-3 col-lg-1">About</div>
                    <div className="footer-text col-8 col-sm-5 col-md-3 col-lg-2">Terms of Service</div>
                    <div className="footer-text col-6 col-sm-4 col-md-3 col-lg-2">Privacy Policy</div>
                    <div className="footer-text col-6 col-sm-3 col-md-3 col-lg-2">Advertising</div>
                    <div className="footer-text col-6 col-sm-3 col-lg-2">Business</div>
                    <div className="footer-text col-6 col-sm-3 col-md-6 col-lg-2">Developer</div>
                    <div className="footer-text col-sm-3 col-md-3 col-lg-1">Settings</div>
                    <div className="text-white">© 2022 Gazebo</div>
                </div>
            </div>
        </div>
    )
};

export default Footer;