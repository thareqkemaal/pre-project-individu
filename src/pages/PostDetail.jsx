import React from "react";
import Navbar from "../component/navbar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../helper";
import placeholder from '../images/userplaceholder.jpg';
import { Button, ButtonGroup, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import Moment from "react-moment";
import { deleteLiked, likedPost } from "../action/userAction";

const PostDetailPage = (props) => {
    // di dalam state ada idpost, post_user_id, post_username, post_image, 
    // post_caption, post_created, totalLike, user_profileimage
    const { id } = useParams();

    const [postDetail, setPostDetail] = React.useState({});
    const [postLike, setPostLike] = React.useState([]);
    const [postComment, setPostComment] = React.useState([]);
    const [countComm, setCountComm] = React.useState([]);
    const [showBtn, setShowBtn] = React.useState("");
    const [countChar, setCountChar] = React.useState(0);
    const [countEditChar, setCountEditChar] = React.useState(0);
    const [inputComment, setInputComment] = React.useState("");
    const [inputCaption, setInputCaption] = React.useState("");
    const [showEdit, setShowEdit] = React.useState("");
    const [toggleDelete, setToggleDelete] = React.useState(false);
    const [selectedData, setSelectedData] = React.useState(null);
    const [offset, setOffset] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(true);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast();

    const { idusers, username, status } = useSelector(({ userReducer }) => {
        return {
            idusers: userReducer.idusers,
            username: userReducer.username,
            status: userReducer.status
        }
    })

    React.useEffect(() => {
        getPost();
        getLike();
        checkLike();
        getComment();
        countComments();
        setTimeout(() => {
            setIsLoading(false)
        }, 2000);
    }, []);

    const getPost = async () => {
        try {
            let res = await axios.get(API_URL + `/post/detail/${id}`)

            console.log("get detail post", res.data);
            setPostDetail(res.data);
        } catch (error) {
            console.log("error getPostDetail",error)
        }
    };

    const getLike = async () => {
        try {
            let res = await axios.get(API_URL + `/post/like/${id}`);

            console.log("get like", res.data);
            setPostLike(res.data);
        } catch (error) {
            console.log("error getLikedata",error)
        }
    };

    const checkLike = async () => {
        try {
            let getToken = localStorage.getItem("activeUser");

            let res = await axios.post(API_URL + "/post/check", { idpost: id }, {
                headers: {
                    'Authorization': `Bearer ${getToken}`
                }
            });

            console.log('check like', res.data)
            if (res.data.idlike) {
                setShowBtn("unlike")
            } else {
                setShowBtn("");
            }
        } catch (error) {
            console.log("error check like",error)
        }
    };

    const addLike = async () => {
        try {
            let getToken = localStorage.getItem("activeUser");

            let res = await axios.post(API_URL + '/post/addlike', { idpost: id }, {
                headers: {
                    'Authorization': `Bearer ${getToken}`
                }
            });

            //console.log(res.data);

            if (res.data.success) {
                //console.log(res.data.liked)
                dispatch(likedPost({ liked: res.data.liked }));
                setShowBtn("unlike");
                getLike();
            }
        } catch (error) {
            console.log("error addlike",error)
        }
    };

    const deleteLike = async () => {
        try {
            let getToken = localStorage.getItem("activeUser");

            let res = await axios.delete(API_URL + `/post/deletelike/${id}`, {
                headers: {
                    'Authorization': `Bearer ${getToken}`
                }
            });

            //console.log(res.data);

            if (res.data.success) {
                dispatch(deleteLiked({ liked: res.data.liked }));
                setShowBtn("");
                getLike();
            }
        } catch (error) {
            console.log("error delete like",error)
        }
    };

    const getComment = async (offset) => {
        try {
            if (offset) {
                console.log(offset);
                let res = await axios.get(API_URL + `/post/comment/${id}?limit=5&offset=${offset}`);

                console.log(res.data);
                const newComment = [];
                res.data.forEach((val) => newComment.push(val))
                setPostComment((oldData) => [...oldData, ...newComment]);

            } else {
                let res = await axios.get(API_URL + `/post/comment/${id}?limit=5&offset=0`);
                console.log(res.data);
                setPostComment([...res.data]);
            }
        } catch (error) {
            console.log("error getcomment",error)
        }
    };

    const handleComment = () => {
        setOffset(offset + 5);
        getComment(offset);
    };

    const countComments = async () => {
        try {
            let res = await axios.get(API_URL + `/post/countcomment/${id}`);
            //console.log("count", res.data);
            setCountComm(res.data);
        } catch (error) {
            console.log("error count comment",error)
        }
    };

    const addComment = async () => {
        try {
            let getToken = localStorage.getItem("activeUser");

            let res = await axios.post(API_URL + '/post/addcomment', { idpost: id, comment: inputComment }, {
                headers: {
                    'Authorization': `Bearer ${getToken}`
                }
            });
            console.log(res.data)

            if (res.data.success) {
                getComment(0);
                countComments();
                setInputComment("");
                setCountChar(0);
                setOffset(0);
            }
        } catch (error) {
            console.log("error add comment",error)
        }
    };

    const printComment = () => {
        return postComment.map((val, idx) => {
            return (
                <div key={val.idcomment} className="border-bottom p-2">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <img className="rounded-circle" src={val.user_profileimage ? API_URL + val.user_profileimage : placeholder}
                                style={{ border: "solid 2px #231f20", width: "35px" }}
                                alt={`img ${idx}`}
                            />
                            <div className="ms-2 d-flex flex-column">
                                <span className="fw-bold">{val.comment_username}</span>
                                <span className="text-muted" style={{ fontSize: "12px" }}><Moment fromNow>{val.comment_created}</Moment></span>
                            </div>
                        </div>
                    </div>
                    <div className="ms-5">
                        <div>{val.comment_content}</div>
                    </div>
                </div>
            )
        })
    };

    const saveEditBtn = async () => {
        try {
            let res = await axios.patch(API_URL + `/post/editcaption/${id}`, { caption: inputCaption });

            console.log(res.data);
            if (res.data.success) {
                setShowEdit("");
                getPost();
            }
        } catch (error) {
            console.log("error edit caption", error)
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
                setSelectedData(null);
                setToggleDelete(!toggleDelete);
                navigate("/home", {replace: true})
            };
        } catch (error) {
            console.log("error delete post",error)
        }
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
                                <span className="text-center fs-5 fw-bold">Post Detail</span>
                                <div className="d-flex flex-column">
                                    <button className="btn btn-color-231 mt-1">
                                        <div className="py-2 row m-0 fs-5" onClick={() => {navigate("/home")}}>
                                            <span className="col-5 material-icons align-self-center text-end">arrow_back</span>
                                            <span className="col-7 text-start">Back</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-3">{/* blank */}</div>
                        {/* Middle */}
                        <div className="col-6">
                            {
                                isLoading ?
                                    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                                        <div className="lds-facebook"><div></div><div></div><div></div></div>
                                    </div>
                                    :
                                    <>
                                        <div className=" mt-2 d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                <img className="rounded-circle" src={postDetail.post_user_image == null || postDetail.post_user_image == "" ? placeholder : API_URL + postDetail.post_user_image}
                                                    style={{ height: "35px", width: "35px" }} />
                                                <div className="ms-2 d-flex flex-column">
                                                    <span className="fw-bold color-231">{postDetail.post_username}</span>
                                                    <span className="text-muted" style={{ fontSize: "15px" }}><Moment fromNow>{postDetail.post_created}</Moment></span>
                                                </div>
                                            </div>
                                            <Menu>

                                                <MenuButton>
                                                    <span className="material-icons">more_vert</span>
                                                </MenuButton>
                                                {
                                                    status == "verified" ?
                                                        <MenuList>
                                                            {
                                                                username == postDetail.post_username &&
                                                                <MenuItem onClick={() => setShowEdit("show")}>Edit Caption</MenuItem>
                                                            }
                                                            <MenuItem type="button">
                                                                Share Post
                                                            </MenuItem>
                                                            {
                                                                idusers == postDetail.post_user_id &&
                                                                <MenuItem type="button" onClick={() => {
                                                                    setSelectedData(postDetail);
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
                                        <div className="border d-flex justify-content-center mt-2">
                                            <img src={API_URL + postDetail.post_image} style={{ maxHeight: "480px" }} />
                                        </div>
                                        <div className="mt-2 ps-2 d-flex align-items-center">
                                            {
                                                showBtn == "unlike" ?
                                                    <span type="button" className="material-icons" onClick={deleteLike}
                                                        disabled={status == "unverified" ? true : false} style={{ color: "red" }}>
                                                        favorite
                                                    </span>
                                                    :
                                                    <span type="button" className="material-icons text-muted" onClick={addLike}
                                                        disabled={status == "unverified" ? true : false}>
                                                        favorite_border
                                                    </span>
                                            }
                                            <span className="fw-bold ms-2">{postLike.length} Likes</span>
                                        </div>
                                        <div className="w-100 p-2">
                                            <div>
                                                <span className="fw-bold">{postDetail.post_username} </span>
                                                {postDetail.post_caption}
                                            </div>
                                            {
                                                showEdit == "show" ?
                                                    <div className="w-100 my-2">
                                                        <div className="d-flex">
                                                            <textarea type="text" className="form-control"
                                                                placeholder="edit your caption"
                                                                maxLength={300}
                                                                value={inputCaption}
                                                                onChange={(e) => { setCountEditChar(e.target.value.length); setInputCaption(e.target.value) }}
                                                            >
                                                            </textarea>
                                                            <div>{countEditChar}/300</div>
                                                        </div>
                                                        <div className="my-2">
                                                            <Button type="button" colorScheme="green" onClick={saveEditBtn}>Save</Button>
                                                            <Button className="ms-2" type="button" colorScheme="red" onClick={() => setShowEdit("")}>Cancel</Button>
                                                        </div>
                                                    </div>
                                                    :
                                                    ""
                                            }
                                        </div>
                                        <div className="p-2 d-flex flex-column align-items-start" style={{ borderTop: "solid", borderColor: "#231f20" }} >
                                            <div className="me-3 w-100 fw-bold">{countComm.length} Comments</div>
                                            {status == "unverified" ?
                                                "" :
                                                <div className="w-100 my-2 d-flex align-items-end">
                                                    <textarea type="text" className="form-control"
                                                        placeholder="add your comment here"
                                                        onChange={(e) => { setCountChar(e.target.value.length); setInputComment(e.target.value) }}
                                                        maxLength={300}
                                                        value={inputComment}>
                                                    </textarea>
                                                    <div className="ms-2">
                                                        <div>{countChar}/300</div>
                                                        <button type="button" className="btn btn-color-231" onClick={addComment}>comment</button>
                                                    </div>
                                                </div>
                                            }
                                            <div className="w-100">
                                                {printComment()}
                                            </div>
                                            {
                                                postComment.length >= 5 &&
                                                <div className="w-100 text-center">
                                                    {
                                                        countComm.length == postComment.length ?
                                                            <span>Yay you've seen it all</span>
                                                            :
                                                            <button onClick={handleComment}>see more</button>
                                                    }
                                                </div>
                                            }
                                        </div>
                                    </>
                            }
                        </div>
                        {/*Right*/}
                        <div className="col-3 px-3 bg-color-eee">
                            <div style={{ position: "fixed", width: "23%" }}>
                                <div className="mt-2 ">
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
    )
};

export default PostDetailPage;