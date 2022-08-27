import React from "react";
import axios from "axios";
import { API_URL } from "../helper";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Moment from "react-moment";
import Navbar from "../component/navbar";
import { Button, ButtonGroup, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import placeholder from '../images/userplaceholder.jpg';
import InfiniteScroll from 'react-infinite-scroll-component';
import lock from '../images/lock.png';

const HomePage = (props) => {
    const [allDataPost, setAllDataPost] = React.useState([]);
    const [inputPostImage, setInputPostImage] = React.useState("");
    const [inputPostCaption, setInputPostCaption] = React.useState("");
    const [previewPost, setPreviewPost] = React.useState("");
    const [toggleDelete, setToggleDelete] = React.useState(false);
    const [selectedData, setSelectedData] = React.useState(null);
    const [countData, setCountData] = React.useState([]);
    const [countOwnPost, setCountOwnPost] = React.useState([]);
    const [offset, setOffset] = React.useState(1);

    const fileRef = React.useRef();
    const toast = useToast();
    const navigate = useNavigate();

    const { idusers, username, status, fullname, user_bio, user_profileimage } = useSelector(({ userReducer }) => {
        return {
            idusers: userReducer.idusers,
            username: userReducer.username,
            status: userReducer.status,
            fullname: userReducer.fullname,
            user_bio: userReducer.user_bio,
            user_profileimage: userReducer.user_profileimage
        };
    });

    React.useEffect(() => {
        getAllPostData();
        countPostData();
    }, []);

    const getAllPostData = async () => {
        try {
            let res = await axios.get(API_URL + `/post/get/5/0`)

            if (res.data.length > 0) {
                console.log("get all post data", res.data)
                setAllDataPost(res.data)
            }
        } catch (error) {
            console.log(error)
        }
    };

    const moreData = async () => {
        try {
            console.log(offset)
            let res = await axios.get(API_URL + `/post/more/5/${offset * 5}`)

            if (res.data.length > 0) {
                console.log(res.data)
                let newData = [];
                res.data.forEach(val => newData.push(val))
                setAllDataPost((oldData) => [...oldData, ...newData]);
                setOffset(offset + 1);
                console.log("combine data", [...allDataPost, ...res.data])
            }
        } catch (error) {
            console.log(error)
        }
    }

    const countPostData = async () => {
        try {
            let res = await axios.get(API_URL + `/post/countdata`);
            //console.log("post",res.data)
            setCountData(res.data);

            let search = [];
            res.data.forEach((val, idx) => {
                if (val.post_user_id == idusers) {
                    search.push(val);
                }
            })
            setCountOwnPost(search);

        } catch (error) {
            console.log("error count post data", error)
        }
    };

    const btnPost = async () => {
        try {
            let formPost = new FormData();
            formPost.append('postdata', JSON.stringify({
                post_user_id: idusers,
                post_username: username,
                post_caption: inputPostCaption,
                post_user_image: user_profileimage
            }));
            formPost.append('post_image', inputPostImage);

            console.log(inputPostCaption);
            console.log(inputPostImage);
            console.log(formPost);

            let res = await axios.post(API_URL + "/post/add", formPost);

            if (res.data.success) {
                toast({
                    title: "Post Created",
                    position: 'top',
                    status: "success",
                    isClosable: true
                });
                countPostData();
                setPreviewPost("");
                setInputPostCaption("");
                setOffset(1);
                getAllPostData();
            }
        } catch (error) {
            console.log("error add post", error)
            toast({
                title: "Insert a Picture",
                position: 'top',
                status: "error",
                isClosable: true
            });
        }
    };

    const deletePost = async (post_id) => {
        try {
            let res = await axios.delete(API_URL + "/post/delete/" + post_id);

            if (res.data.success) {
                console.log("item deleted");
                toast({
                    position: "top",
                    title: `Post Deleted`,
                    status: "warning",
                    duration: 5000,
                    isClosable: true
                });
                countPostData();
                setSelectedData(null);
                setToggleDelete(!toggleDelete);
                setOffset(1);
                console.log("reset", offset);
                getAllPostData();
            }
        } catch (error) {
            console.log("error delete post", error)
        }
    };

    const printPosts = () => {
        return allDataPost.map((val, idx) => {
            return (
                <div key={val.idpost}>
                    <div className="border-2 border-bottom-0 rounded-top">
                        <div className="p-2 d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <img className="rounded-circle" src={val.user_profileimage == null || val.user_profileimage == "" ? placeholder : API_URL + val.user_profileimage}
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
                                            <MenuItem type="button">
                                                Share Post
                                            </MenuItem>
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
                        <img src={API_URL + val.post_image} style={{ maxHeight: "360px" }} />
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
            <div className="pt-5">
                <div className="pt-3">
                    <div className="row m-0">
                        {/*Left Side*/}
                        <div className="col-3 pt-2 pe-3 h-100 bg-color-eee" style={{ position: "fixed" }}>
                            <div className="d-flex flex-column">
                                <span className="text-center fs-5 fw-bold">Menu</span>
                                <div className="d-flex flex-column">
                                    <button className="btn btn-color-231 mt-1">
                                        <div className="py-2 row m-0 fs-5" onClick={() => { navigate("/home") }}>
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
                                    <button className="btn btn-color-eee" onClick={() => { navigate("/profile") }}>
                                        <div className="py-2 row m-0 fs-5">
                                            <span className="col-5 material-icons align-self-center text-end color-231">assignment_ind</span>
                                            <span className="col-7 text-start color-231">Profile</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                            <div className="d-flex mt-4">
                                <div className="w-25">
                                    {
                                        user_profileimage == "" || user_profileimage == null ?
                                            <img className="rounded-circle mx-auto" src={placeholder} style={{ height: "75px", width: "75px", border: "solid", borderColor: "#231f20" }} />
                                            :
                                            <img className="rounded-circle mx-auto" src={API_URL + user_profileimage} style={{ height: "75px", width: "75px", border: "solid", borderColor: "#231f20" }} />
                                    }
                                </div>
                                <div className="w-75 d-flex flex-column justify-content-center px-2">
                                    <div className="d-flex align-items-center">
                                        <span className="fs-5 fw-bold">{fullname == "" || fullname == null ? username : fullname}</span>
                                        <span className="text-muted" style={{ fontSize: "15px" }}>{status === "unverified" ? "(unverified)" : ""}</span>
                                    </div>
                                    {
                                        fullname == "" || fullname == null ?
                                            ""
                                            :
                                            <div>
                                                <span className="text-muted fw-bold">@{username}</span>
                                            </div>
                                    }
                                    <div className="d-flex justify-content-between">
                                        <span>{countOwnPost.length} Post</span>
                                        <span>0 Followers</span>
                                        <span>0 Following</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-3">{/* blank */}</div>
                        {/*Middle*/}
                        <div className="col-6">
                            {
                                status == "unverified" ?
                                    <div className="d-flex justify-content-center align-items-center flex-column text-center" style={{ height: "90vh" }}>
                                        <img src={lock} style={{ width: "200px" }} />
                                        <span className="fw-bold fs-1">! You need to verify to use this feature !</span>
                                        <span>Go to your Profile, click Verify Button.</span>
                                    </div>
                                    :
                                    <>
                                        <div className="border-2 rounded-3 p-2 my-2"
                                            style={{ borderColor: "#006442" }}>
                                            <div>
                                                <span>The more you share, the more you have...</span>
                                            </div>
                                            <div className="d-flex justify-content-center">
                                                <img src={previewPost ? previewPost : ""} style={{ maxHeight: "360px" }} />
                                            </div>
                                            <div>
                                                <textarea className="border-2 w-100" rows="3" placeholder="Write your story here"
                                                    onChange={(e) => setInputPostCaption(e.target.value)} value={inputPostCaption}></textarea>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <button type="file" className="border btn btn-secondary p-2 d-flex align-items-center"
                                                    onClick={() => fileRef.current.click()}>
                                                    <span>Add Image</span>
                                                    <span className="material-icons">add_a_photo</span>
                                                    <input type="file"
                                                        onChange={(e) => {
                                                            // console.log(e.target.files[0])
                                                            setPreviewPost(URL.createObjectURL(e.target.files[0]));
                                                            setInputPostImage(e.target.files[0])
                                                        }} ref={fileRef} hidden
                                                    />
                                                </button>
                                                <button type="button" className="py-2 px-4 btn btn-success" onClick={btnPost}>
                                                    <span className="fw-bold">Share</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <InfiniteScroll
                                                dataLength={allDataPost.length}
                                                next={() => {
                                                    setTimeout(() => {
                                                        moreData()
                                                    }, 2000)
                                                }}
                                                hasMore={true}
                                                loader={
                                                    countData.length == allDataPost.length ?
                                                        ""
                                                        :
                                                        <div className="d-flex justify-content-center">
                                                            <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                                                        </div>
                                                }>
                                                {printPosts()}
                                            </InfiniteScroll>
                                        </div>
                                        <div className="text-center py-2">
                                            {
                                                countData.length == allDataPost.length ?
                                                    <span>Yay you've seen it all</span>
                                                    :
                                                    ""
                                            }
                                        </div>
                                    </>
                            }
                        </div>
                        {/*Right*/}
                        <div className="col-3 px-3 bg-color-eee" style={allDataPost.length > 0 ? {} : { height: "100vh" }}>
                            <div style={{ position: "fixed", width: "23%" }}>
                                {
                                    status === "unverified" ?
                                        <div className="d-flex justify-content-center align-items-center flex-column text-center" style={{ height: "90vh" }}>
                                            <img src={lock} style={{ width: "75px" }} />
                                            <span className="fw-bold fs-3">! You need to verify to use this feature !</span>
                                        </div>
                                        :
                                        <>
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
                                        </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default HomePage;