import React from "react";
import { Button, Text, useToast } from '@chakra-ui/react';
import bg from '../images/bg.jpg';
import Navbar from "../component/navbar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../helper";
import { loginAction } from "../action/userAction";
import placeholder from '../images/userplaceholder.jpg';


const EditProfilePage = (props) => {
    const [allUser, setAllUser] = React.useState([]);

    const [editProfilePic, setEditProfilePic] = React.useState("");
    const [editUsername, setEditUsername] = React.useState("");
    const [editFullname, setEditFullname] = React.useState("");
    const [editSetBio, setEditBio] = React.useState("");
    const [showPic, setShowPic] = React.useState("");
    const [showEditPic, setshowEditPic] = React.useState(false);
    const [showInput, setShowInput] = React.useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast();
    const fileRef = React.useRef();

    React.useEffect(() => {
        getUserData();
    }, []);

    const getUserData = async () => {
        try {
            let res = await axios.get(API_URL + "/auth/users")
            console.log(res.data)
            setAllUser(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const { username, status, fullname, user_bio, user_profileimage, email } = useSelector(({ userReducer }) => {
        return {
            username: userReducer.username,
            status: userReducer.status,
            fullname: userReducer.fullname,
            user_bio: userReducer.user_bio,
            user_profileimage: userReducer.user_profileimage,
            email: userReducer.email
        };
    });

    const btnSave = async () => {
        let user = localStorage.getItem("activeUser");

        let search = "";

        allUser.forEach((val, idx) => {
            if (editUsername == val.username) {
                search = "found";
            }
        })

        if (search == "found") {
            toast({
                description: "Username has been used",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            })
            setEditUsername("");
        } else {
            if (editUsername.length < 6 && editUsername.length > 0){
                toast({
                    description: "Username should have 6 - 12 Characters",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right"
                })
            } else {
                let editUser = "";
                if (editUsername == "") {
                    editUser = username;
                } else {
                    editUser = editUsername;
                };
    
                let editFull = "";
                if (editFullname == "") {
                    editFull = fullname;
                } else {
                    editFull = editFullname;
                };
    
                let editBio = "";
                if (editSetBio == "") {
                    editBio = user_bio;
                } else {
                    editBio = editSetBio;
                };
    
                let editPic = "";
                if (editProfilePic == "") {
                    editPic = user_profileimage;
                } else {
                    editPic = editProfilePic;
                };
    
                let formEdit = new FormData();
                formEdit.append('editprofile', JSON.stringify({
                    username: editUser,
                    fullname: editFull,
                    user_bio: editBio
                }));
                formEdit.append('user_profileimage', editPic);
    
                let edit = {
                    username: editUser,
                    fullname: editFull,
                    user_bio: editBio
                }
    
                let res = await axios.patch(API_URL + '/auth/edit', formEdit, {
                    headers: {
                        'Authorization': `Bearer ${user}`
                    }
                })
    
                console.log(res.data)
                if (res.data.success) {
                    dispatch(loginAction(edit));
                    toast({
                        title: "Profile Saved",
                        position: 'top',
                        status: "success",
                        isClosable: true,
                    });
                    navigate('/profile');
                }
            }
        }
    }

    return (
        <div>
            <Navbar />
            <div className="pt-5">
                <div className="pt-3">
                    <div className="row m-0">
                        {/*Left Side*/}
                        <div className="col-3 pt-2 pe-3 h-100 bg-color-eee" style={{ position: "fixed" }}>
                            <div className="d-flex flex-column">
                                <span className="text-center fs-5 fw-bold">Settings</span>
                                <div className="d-flex flex-column">
                                    <button className="btn btn-color-eee mt-1">
                                        <div className="py-2 row m-0 fs-5" onClick={() => navigate("/profile")}>
                                            <span className="col-5 material-icons align-self-center text-end">arrow_back</span>
                                            <span className="col-7 text-start">Back to Profile</span>
                                        </div>
                                    </button>
                                    <button className="btn btn-color-231">
                                        <div className="py-2 row m-0 fs-5">
                                            <span className="col-5 material-icons align-self-center text-end">badge</span>
                                            <span className="col-7 text-start">User Information</span>
                                        </div>
                                    </button>
                                    <button className="btn btn-color-eee">
                                        <div className="py-2 row m-0 fs-5">
                                            <span className="col-5 material-icons align-self-center text-end">vpn_key</span>
                                            <span className="col-7 text-start">Change Password</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-3"></div>
                        {/*Right Side*/}
                        <div className="col-9 px-5 py-3">
                            <div className="d-flex flex-column justify-content-center align-items-center">
                                <div className="fw-bold fs-2 text-center color-231">
                                    USER INFORMATION
                                </div>
                                <div className="d-flex justify-content-center p-3">
                                    {
                                        user_profileimage == "" || user_profileimage == null ?
                                            <img className="rounded-circle p-2" src={showPic ? showPic : placeholder} style={{ height: "150px", width: "150px", border: "solid", borderColor: "#231f20" }} />
                                            :
                                            <img className="rounded-circle p-2" src={showPic ? showPic : API_URL + user_profileimage} style={{ height: "150px", width: "150px", border: "solid", borderColor: "#231f20" }} />
                                    }
                                </div>
                                <div className={showEditPic ? "d-none" : "d-flex justify-content-center"}>
                                    {
                                        showInput ?
                                            <button type="button" className="btn btn-color-231 d-flex align-items-center"
                                                onClick={() => fileRef.current.click()}>
                                                <span className="material-icons">photo_camera</span>
                                                <span className="ms-1">Change Photo</span>
                                                <input type="file"
                                                    onChange={(e) => {
                                                        setShowPic(URL.createObjectURL(e.target.files[0]));
                                                        setEditProfilePic(e.target.files[0])
                                                    }} ref={fileRef} hidden
                                                />
                                            </button>
                                            :
                                            ""
                                    }
                                </div>
                                <div className="my-2">
                                    {
                                        showInput ?
                                            ""
                                            :
                                            <button className="border btn btn-color-eee"
                                                onClick={() => {setShowInput(true);  setEditBio(""); setEditFullname(""); setEditUsername("")}}>
                                                Edit Information
                                            </button>
                                    }
                                </div>
                                <div className="row m-0 w-75 align-items-center">
                                    <div className="col-2 fw-bold d-flex justify-content-between">
                                        <span>USERNAME</span>
                                        <span>:</span>
                                    </div>
                                    <div className="col-10">
                                        {
                                            showInput ?
                                                <input type="text" className="form-control" placeholder={username}
                                                    onChange={(e) => setEditUsername(e.target.value)} value={editUsername} minLength={6} maxLength={12}></input>
                                                :
                                                <span>{username}</span>
                                        }
                                    </div>
                                </div>
                                <div className="row m-0 w-75 align-items-center my-2">
                                    <div className="col-2 fw-bold d-flex justify-content-between">
                                        <span>FULLNAME</span>
                                        <span>:</span>
                                    </div>
                                    <div className="col-10">
                                        {
                                            showInput ?
                                                <input type="text" className="form-control" placeholder={fullname ? fullname : "Enter your Fullname"}
                                                    onChange={(e) => setEditFullname(e.target.value)}></input>
                                                :
                                                <span>{fullname}</span>
                                        }
                                    </div>
                                </div>
                                <div className="row m-0 w-75 align-items-center">
                                    <div className="col-2 fw-bold d-flex justify-content-between">
                                        <span>EMAIL</span>
                                        <span>:</span>
                                    </div>
                                    <div className="col-10">
                                        <span className="color-231">{email}</span>
                                    </div>
                                </div>
                                <div className="row m-0 w-75 my-2">
                                    <div className="col-2 fw-bold d-flex justify-content-between">
                                        <span>BIO</span>
                                        <span>:</span>
                                    </div>
                                    <div className="col-10">
                                        {
                                            showInput ?
                                                <textarea type="text" className="form-control" placeholder={user_bio ? user_bio : "Enter your Bio"}
                                                    onChange={(e) => setEditBio(e.target.value)}></textarea>
                                                :
                                                <span>{user_bio}</span>
                                        }
                                    </div>
                                </div>
                            </div>
                            {
                                showInput ?
                                    <div className="mt-3 d-flex justify-content-evenly">
                                        <Button type="button" className="w-25" colorScheme="green" onClick={btnSave}>SAVE</Button>
                                        <Button type="button" className="w-25" colorScheme="red" 
                                        onClick={() => setShowInput(false)}>CANCEL</Button>
                                    </div>
                                    :
                                    ""
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default EditProfilePage;