import React from "react";
import { useNavigate } from "react-router-dom";
import bg from "../images/bgnotfound.jpg";

const NotFoundPage = (props) => {

    const navigate = useNavigate();


    return (
        <div className="static-bg" style={{ backgroundImage: `url(${bg})` }}>
            <div className="container">
                <div className="row vh-100">
                    <div className="d-none d-md-block col-md-3"></div>
                    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                        <div className="row m-0 w-100 h-75">
                            <div className="col-12 d-flex justify-content-center">
                                <div className="d-none d-sm-block col-sm-3 col-lg-3"></div>
                                <div className="col-12 col-sm-6 col-lg-6 d-flex align-items-center">
                                    <button type="button" className="btn btn-color-eee w-100 border-0 shadow-lg text-center fs-4"
                                        style={{ borderRadius: "20px" }}
                                        onClick={() => navigate("/", { replace: true })}>
                                        BACK
                                    </button>
                                </div>
                                <div className="d-none d-sm-block col-sm-3 col-lg-3"></div>
                            </div>
                        </div>
                    </div>
                    <div className="d-none d-md-block col-md-3"></div>
                </div>
            </div>
        </div>
    )
};

export default NotFoundPage;