import React from "react";
import bg from '../images/bg.jpg';
import check from '../images/check.png';
import placeholder from '../images/userplaceholder.jpg';
import Navbar from "../component/navbar";
import Moment from "react-moment";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../helper";
import axios from "axios";
import { Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, ModalFooter } from "@chakra-ui/react";
import { Button, ButtonGroup, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';


const UserProfilePage = (props) => {

    const [ownPost, setOwnPost] = React.useState([]);
    const [likedPost, setLikedPost] = React.useState([]);
    const [toggleOpen, setToggleOpen] = React.useState(false);
    const [toggleDelete, setToggleDelete] = React.useState(false);
    const [selectedData, setSelectedData] = React.useState(null);

    const [showLike, setShowLike] = React.useState("");

    const navigate = useNavigate();
    const toast = useToast();

    React.useEffect(() => {
        getOwnPostData();
        getLikedPostData();
    }, []);

    const getOwnPostData = async () => {
        try {
            let user = localStorage.getItem("activeUser")
            let res = await axios.get(API_URL + "/post/ownpost", {
                headers: {
                    'Authorization': `Bearer ${user}`
                }
            });
            console.log("own post", res.data)
            setOwnPost(res.data.reverse())
        } catch (error) {
            console.log(error)
        }
    };

    const getLikedPostData = async () => {
        try {
            let user = localStorage.getItem("activeUser")
            let res = await axios.get(API_URL + "/post/likedpost", {
                headers: {
                    'Authorization': `Bearer ${user}`
                }
            });
            console.log("liked post", res.data)
            setLikedPost(res.data.reverse())
        } catch (error) {
            console.log(error)
        }
    };

    const { idusers, username, status, fullname, user_bio, user_profileimage, liked } = useSelector(({ userReducer }) => {
        return {
            idusers: userReducer.idusers,
            username: userReducer.username,
            status: userReducer.status,
            fullname: userReducer.fullname,
            user_profileimage: userReducer.user_profileimage,
            user_bio: userReducer.user_bio,
            liked: userReducer.liked
        };
    });

    const getVerify = async () => {
        try {
            let token = localStorage.getItem("activeUser");

            let getRes = await axios.patch(API_URL + '/auth/resend', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (getRes.data.success) {
                setToggleOpen(true);
                setTimeout(() => {
                    setToggleOpen(false);
                }, 3000);
            }
        } catch (error) {
            console.log('ini error ', error);
        }
    };

    const deletePost = async (post_id) => {
        try {
            let res = await axios.delete(API_URL + "/post/delete/" + post_id);
            if (res.data.success) {
                console.log("item deleted");
                getOwnPostData();
                toast({
                    position: "top",
                    title: `Post Deleted`,
                    status: "warning",
                    duration: 5000,
                    isClosable: true
                });
                setSelectedData(null);
                setToggleDelete(!toggleDelete);
                window.location.reload();
            };
        } catch (error) {
            console.log(error)
        }
    };

    const printOwnPosts = () => {
        return ownPost.map((val, idx) => {
            return (
                <div key={val.idpost}>
                    <div className="border-2 border-bottom-0 rounded-top">
                        <div className="p-2 d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <img className="rounded-circle" src={val.post_user_image == null || val.post_user_image == "" ? placeholder : API_URL + val.post_user_image}
                                    style={{ height: "35px", width: "35px", border: "solid 2px #231f20" }} />
                                <div className="ms-2 d-flex flex-column">
                                    <span className="fw-bold color-231">{val.post_username}</span>
                                    <span className="text-muted" style={{ fontSize: "12px" }}><Moment fromNow>{val.post_created}</Moment></span>
                                </div>
                            </div>
                            <Menu>

                                <MenuButton>
                                    <span className="material-icons">more_vert</span>
                                </MenuButton>
                                {
                                    status == "verified" ?
                                        <MenuList>
                                            <MenuItem type="button" onClick={() => navigate(`/postdetail/${val.post_username}/${val.idpost}`)}>
                                                Post Detail
                                            </MenuItem>
                                            {
                                                idusers == val.post_user_id &&
                                                <MenuItem type="button" onClick={() => {
                                                    setSelectedData(val);
                                                    setToggleDelete(!toggleDelete)
                                                }}>
                                                    Delete Post
                                                </MenuItem>

                                            }
                                        </MenuList>
                                        :
                                        ""
                                }
                            </Menu>
                            {
                                selectedData ?
                                    <Modal isOpen={toggleDelete} onClose={() => setToggleDelete(!toggleDelete)}>
                                        <ModalOverlay />
                                        <ModalContent>
                                            <ModalHeader>Are you sure to delete this post?</ModalHeader>
                                            <ModalFooter>
                                                <ButtonGroup>
                                                    <Button type="button" variant="outline" colorScheme="yellow"
                                                        onClick={() => { setSelectedData(null); setToggleDelete(!toggleDelete) }}>No</Button>
                                                    <Button type="button" variant="outline" colorScheme="green"
                                                        onClick={() => deletePost(selectedData.idpost)}>Yes</Button>
                                                </ButtonGroup>
                                            </ModalFooter>
                                        </ModalContent>
                                    </Modal>
                                    : null
                            }
                        </div>
                    </div>
                    <div className="border-2 border-top-0 border-bottom-0 w-100 d-flex justify-content-center">
                        <img src={API_URL + val.post_image} style={{ maxHeight: "360px" }}
                            onClick={() => navigate(`/postdetail/${val.post_username}/${val.idpost}`)}
                        />
                    </div>
                    <div className="border-2 border-top-0 rounded-bottom">
                        <div className="p-2">
                            <div className="d-flex">
                                <div className="d-flex align-items-center">
                                    <span className="material-icons color-231">favorite</span>
                                    <span className="color-231">{val.like.length} Likes</span>
                                </div>
                                <div className="d-flex align-items-center ms-3">
                                    <span className="material-icons color-231 me-1">comment</span>
                                    <span className="color-231">{val.comment.length} Comments</span>
                                </div>
                            </div>
                            <p className="my-1">
                                <span className="fw-bold color-231">{val.post_username}</span> {val.post_caption}
                            </p>
                        </div>
                    </div>
                </div>
            )
        })
    };

    const printLikedPosts = () => {
        return likedPost.map((val, idx) => {
            return (
                <div key={val.idpost}>
                    <div className="border-2 border-bottom-0 rounded-top">
                        <div className="p-2 d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <img className="rounded-circle" src={val.post_user_image == null || val.post_user_image == "" ? placeholder : API_URL + val.post_user_image}
                                    style={{ height: "35px", width: "35px", border: "solid 2px #231f20" }} />
                                <div className="ms-2 d-flex flex-column">
                                    <span className="fw-bold color-231">{val.post_username}</span>
                                    <span className="text-muted" style={{ fontSize: "12px" }}><Moment fromNow>{val.post_created}</Moment></span>
                                </div>
                            </div>
                            <Menu>

                                <MenuButton>
                                    <span className="material-icons">more_vert</span>
                                </MenuButton>
                                {
                                    status == "verified" ?
                                        <MenuList>
                                            <MenuItem type="button" onClick={() => navigate(`/postdetail/${val.post_username}/${val.idpost}`)}>
                                                Post Detail
                                            </MenuItem>
                                            {
                                                idusers == val.post_user_id &&
                                                <MenuItem type="button" onClick={() => {
                                                    setSelectedData(val);
                                                    setToggleDelete(!toggleDelete)
                                                }}>
                                                    Delete Post
                                                </MenuItem>

                                            }
                                        </MenuList>
                                        :
                                        ""
                                }
                            </Menu>
                            {
                                selectedData ?
                                    <Modal isOpen={toggleDelete} onClose={() => setToggleDelete(!toggleDelete)}>
                                        <ModalOverlay />
                                        <ModalContent>
                                            <ModalHeader>Are you sure to delete this post?</ModalHeader>
                                            <ModalFooter>
                                                <ButtonGroup>
                                                    <Button type="button" variant="outline" colorScheme="yellow"
                                                        onClick={() => { setSelectedData(null); setToggleDelete(!toggleDelete) }}>No</Button>
                                                    <Button type="button" variant="outline" colorScheme="green"
                                                        onClick={() => deletePost(selectedData.idpost)}>Yes</Button>
                                                </ButtonGroup>
                                            </ModalFooter>
                                        </ModalContent>
                                    </Modal>
                                    : null
                            }
                        </div>
                    </div>
                    <div className="border-2 border-top-0 border-bottom-0 w-100 d-flex justify-content-center">
                        <img src={API_URL + val.post_image} style={{ maxHeight: "360px" }}
                            onClick={() => navigate(`/postdetail/${val.post_username}/${val.idpost}`)}
                        />
                    </div>
                    <div className="border-2 border-top-0 rounded-bottom">
                        <div className="p-2">
                            <div className="d-flex">
                                <div className="d-flex align-items-center">
                                    <span className="material-icons color-231">favorite</span>
                                    <span className="color-231">{val.like.length} Likes</span>
                                </div>
                                <div className="d-flex align-items-center ms-3">
                                    <span className="material-icons color-231 me-1">comment</span>
                                    <span className="color-231">{val.comment.length} Comments</span>
                                </div>
                            </div>
                            <p className="my-1">
                                <span className="fw-bold color-231">{val.post_username}</span> {val.post_caption}
                            </p>
                        </div>
                    </div>
                </div>
            )
        })
    };

    return (
        <div>
            <Navbar />
            <div>
                <div className="pt-5">
                    <div className="pt-3">
                        <div className="row m-0">
                            {/*Left Side*/}
                            <div className="col-3 pt-2 pe-3 h-100 bg-color-eee" style={{ position: "fixed" }}>
                                <div className="d-flex flex-column">
                                    <span className="text-center fs-5 fw-bold">Menu</span>
                                    <div className="d-flex flex-column">
                                        <button className="btn btn-color-eee mt-1">
                                            <div className="py-2 row m-0 fs-5" onClick={() => navigate("/home")}>
                                                <span className="col-5 material-icons align-self-center text-end">home</span>
                                                <span className="col-7 text-start">Home</span>
                                            </div>
                                        </button>
                                        <button className="btn btn-color-eee">
                                            <div className="py-2 row m-0 fs-5">
                                                <span className="col-5 material-icons align-self-center text-end color-231">question_answer</span>
                                                <span className="col-7 text-start color-231">Message</span>
                                            </div>
                                        </button>
                                        <button className="btn btn-color-231" onClick={() => navigate("/profile")}>
                                            <div className="py-2 row m-0 fs-5">
                                                <span className="col-5 material-icons align-self-center text-end">assignment_ind</span>
                                                <span className="col-7 text-start">Profile</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-3">{/* blank */}</div>
                            {/*Middle*/}
                            <div className="col-6">
                                <div className="p-2 pb-3 mb-2" style={{ borderBottom: "solid", borderColor: "#231f20" }}>
                                    <div className="d-flex justify-content-end my-2" style={{ position: "absolute", left: "66%" }}>
                                        {
                                            status == "unverified" ?
                                                "" :
                                                <button type="button" className="btn btn-color-231 d-flex align-items-center" onClick={() => navigate("/editprofile")}>
                                                    <span className="material-icons align-self-center text-end">settings</span>
                                                    <span className="ms-2">Settings</span>
                                                </button>
                                        }
                                    </div>
                                    <div className="d-flex justify-content-center p-3">
                                        {
                                            user_profileimage == "" || user_profileimage == null ?
                                                <img className="rounded-circle p-2" src={placeholder}
                                                    style={{ height: "200px", width: "200px", border: "solid", borderColor: "#231f20" }} />
                                                :
                                                <img className="rounded-circle p-2" src={API_URL + user_profileimage}
                                                    style={{ height: "200px", width: "200px", border: "solid", borderColor: "#231f20" }} />
                                        }
                                    </div>
                                    <div className="fw-bold fs-4 text-center">
                                        {fullname ? fullname : "USER FULLNAME"}
                                    </div>
                                    <div className="fs-5 text-center my-2">
                                        <a className="fw-bold ">@{username}</a><br />
                                        <span className="text-muted" style={{ fontSize: "15px" }}>{status === "unverified" ? "(unverified)" : ""}</span>
                                    </div>
                                    <div className={status == "unverified" ? "d-flex justify-content-center" : "d-none"}>
                                        <button type="button" className="btn btn-warning" onClick={getVerify}>VERIFY YOUR EMAIL</button>
                                        <Modal isOpen={toggleOpen} isCentered>
                                            <ModalOverlay />
                                            <ModalContent>
                                                <ModalHeader className="text-center fw-bold fs-3 color-231">Verification link has been sent</ModalHeader>
                                                <ModalBody className="d-flex flex-column align-items-center">
                                                    <img src={check} style={{ width: "150px" }} />
                                                    <span className="fw-bold mt-3 fs-5 color-231">Please check your email</span>
                                                </ModalBody>
                                            </ModalContent>
                                        </Modal>
                                    </div>
                                    <div className="fs-5 text-center my-2">
                                        {user_bio ? user_bio : "USER BIO"}
                                    </div>

                                </div>
                                <div className="pb-2 mb-2" style={{ borderBottom: "solid", borderColor: "#231f20" }}>
                                    <button className={showLike == "true" ? "w-50 py-2 btn-white color-231" : "w-50 py-2 btn-color-231"} onClick={() => setShowLike("")}>{username} Post</button>
                                    <button className={showLike == "true" ? "w-50 py-2 btn-color-231" : "w-50 py-2 btn-white color-231"} onClick={() => setShowLike("true")}>Liked Post</button>
                                </div>
                                <div>
                                    {
                                        status === "verified" ?
                                            showLike == "true" ?
                                                <div>
                                                    {printLikedPosts()}
                                                </div>
                                                :
                                                <div>
                                                    {printOwnPosts()}
                                                </div>
                                            :
                                            ""
                                    }
                                </div>
                            </div>
                            {/*Right*/}
                            <div className="col-3 px-3 bg-color-eee" style={ownPost.length > 0 || liked.length > 0 ? {} : { height: "100vh" }}>
                                <div style={{ position: "fixed", width: "23%" }}>
                                    <div className="mt-2">
                                        <div className="d-flex justify-content-between color-231">
                                            <span className="text-center fw-bold">Suggestion For You</span>
                                            <span className="text-muted fw-bold">see all</span>
                                        </div>
                                        <div id="suggestion" className="mt-3 pb-4"
                                            style={{ borderBottom: "solid", borderColor: "#231f20" }}>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-center">
                                                    <div>
                                                        <img className="rounded-circle" src={placeholder} style={{ width: "50px", border: "solid 3px #231f20" }} />
                                                    </div>
                                                    <div className="d-flex flex-column ms-2 color-231">
                                                        <span className="fw-bold">User Fullname</span>
                                                        <span className="text-muted">@username</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <button className="btn btn-color-231 rounded-pill">Follow</button>
                                                </div>
                                            </div>
                                            <div className="my-2 d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-center">
                                                    <div>
                                                        <img className="rounded-circle" src={placeholder} style={{ width: "50px", border: "solid 3px #231f20" }} />
                                                    </div>
                                                    <div className="d-flex flex-column ms-2 color-231">
                                                        <span className="fw-bold">User Fullname</span>
                                                        <span className="text-muted">@username</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <button className="btn btn-color-eee rounded-pill" style={{ border: "solid 2px #231f20" }}>Unfollow</button>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-center">
                                                    <div>
                                                        <img className="rounded-circle" src={placeholder} style={{ width: "50px", border: "solid 3px #231f20" }} />
                                                    </div>
                                                    <div className="d-flex flex-column ms-2 color-231">
                                                        <span className="fw-bold">User Fullname</span>
                                                        <span className="text-muted">@username</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <button className="btn btn-color-231 rounded-pill">Follow</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <div className="d-flex justify-content-between color-231 mb-3">
                                            <span className="text-center fw-bold">Trending For You</span>
                                            <span className="text-muted fw-bold">see all</span>
                                        </div>
                                        <div id="trending">
                                            <div className="d-flex flex-column">
                                                <span className="text-muted">trending worldwide</span>
                                                <span className="fw-bold">#LoremIpsum</span>
                                            </div>
                                            <div className="d-flex flex-column my-3">
                                                <span className="text-muted">trending worldwide</span>
                                                <span className="fw-bold">#LoremIpsum</span>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <span className="text-muted">trending indonesia</span>
                                                <span className="fw-bold">#LoremIpsum</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default UserProfilePage;