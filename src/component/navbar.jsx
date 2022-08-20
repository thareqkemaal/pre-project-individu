import React from "react";
import mainlogo from '../images/gazebologo.png';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarBadge, Badge } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import {
    Menu,
    Button,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
} from "@chakra-ui/react";
import axios from "axios";
import { API_URL } from "../helper";
import { logoutAction } from "../action/userAction";
import placeholder from '../images/userplaceholder.jpg';

const Navbar = (props) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { username, fullname, status, userProfPic } = useSelector(({ userReducer }) => {
        return {
            username: userReducer.username,
            fullname: userReducer.fullname,
            status: userReducer.status,
            userProfPic: userReducer.user_profileimage
        };
    });

    const btnLogout = () => {
        console.log(status)
        axios.get(API_URL + `/auth/users?username=${username}&status=${status}`)
            .then(res => {
                localStorage.removeItem("activeUser");
                dispatch(logoutAction());
                navigate("/", { replace: true });
            })
    };

    return (
        <div className="w-100 " style={{ position: "fixed", zIndex: "3" }}>
            <div className="row m-0 w-100 py-2 px-5 bg-color-eee">
                <div type="button" className="col-4 d-flex align-items-center"
                    onClick={() => navigate("/home")}>
                    <img src={mainlogo} style={{ maxWidth: "35px" }} />
                    <span className="fs-3 fw-bold ms-2 color-231 d-none d-sm-block">| GAZEBO</span>
                </div>
                <div className="col-4 d-flex align-items-center">
                    <div className="border-2 w-100 p-2 d-flex bg-white" style={{ borderRadius: "20px", borderColor: "#006442" }}>
                        <input className="ps-2 color-231 bg-transparent" style={{ width: "90%" }} placeholder="Search" />
                        <div className="d-flex align-items-center justify-content-center" style={{ width: "10%" }}>
                            <button className="d-flex align-items-center justify-content-center">
                                <span className="material-icons">search</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-4 d-flex justify-content-end">
                    {
                        username ?
                            <div className="d-flex align-items-center">
                                <div className="me-2 d-flex flex-column">
                                    <span>{fullname ? fullname : username}</span>
                                    <span className={status === "unverified" ? "text-muted" : "d-none"} style={{fontSize: "12px"}}>{status === "unverified" ? "(unverified)" : ""}</span>
                                </div>
                                <Menu>
                                    <MenuButton>
                                        <img src={userProfPic == null || userProfPic == "" ? placeholder : API_URL + userProfPic}
                                            className="rounded-circle" style={{ border: "solid 3px #231f20", width: "48px", height: "48px" }} />
                                    </MenuButton>
                                    <MenuList>
                                        <div>
                                            <MenuItem type="button" className="d-flex justify-content-between" onClick={() => navigate("/profile")}>
                                                <div>
                                                    Profile
                                                </div>
                                                <div>
                                                    <i>{status}</i>
                                                </div>
                                            </MenuItem>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <MenuItem type="button" className="fw-bold" onClick={btnLogout}>
                                                <div>
                                                    Log Out
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <span className="material-icons">logout</span>
                                                </div>
                                            </MenuItem>
                                        </div>
                                    </MenuList>
                                </Menu>
                            </div>
                            :
                            <div className="btn-group">
                                <button type="button" className="btn btn-color-eee-outline" onClick={() => navigate("/login")}>Sign In</button>
                                <button type="button" className="btn btn-color-231" onClick={() => navigate("/register")}>Sign Up</button>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
};

export default Navbar;