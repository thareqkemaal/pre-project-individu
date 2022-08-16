import React from "react";
import bg from '../images/bg.jpg';
import Navbar from "../component/navbar";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../helper";
import { Button } from "@chakra-ui/react";
import placeholder from '../images/userplaceholder.jpg';

const PostDetailPage = (props) => {
    // di dalam state ada idpost, post_user_id, post_username, post_image, 
    // post_caption, post_created, totalLike, user_profileimage
    const { id } = useParams();

    const [postDetail, setPostDetail] = React.useState({});
    const [postLike, setPostLike] = React.useState([]);
    const [postComment, setPostComment] = React.useState([]);
    const [showBtn, setShowBtn] = React.useState("");
    const [countChar, setCountChar] = React.useState(0);
    const [countEditChar, setCountEditChar] = React.useState(0);
    const [inputComment, setInputComment] = React.useState("");
    const [inputCaption, setInputCaption] = React.useState("");
    const [showEdit, setShowEdit] = React.useState("");

    const navigate = useNavigate();

    const { username, status, fullname, user_profileimage } = useSelector(({ userReducer }) => {
        return {
            username: userReducer.username,
            status: userReducer.status,
            fullname: userReducer.fullname,
            user_profileimage: userReducer.user_profileimage
        }
    })

    React.useEffect(() => {
        getPost();
        getLike();
        checkLike();
        getComment();
    }, []);

    const getPost = async () => {
        try {
            let res = await axios.get(API_URL + `/post/detail/${id}`)

            console.log(res.data);
            setPostDetail(res.data);
        } catch (error) {
            console.log(error)
        }
    };

    const getLike = async () => {
        try {
            let res = await axios.get(API_URL + `/post/like/${id}`);

            console.log(res.data);
            setPostLike(res.data);
        } catch (error) {
            console.log(error)
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

            console.log('sudah di like', res.data)
            if (res.data.idlike) {
                setShowBtn("unlike")
            } else {
                setShowBtn("");
            }
        } catch (error) {
            console.log(error)
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

            console.log(res.data);

            if (res.data.success) {
                setShowBtn("unlike");
                getLike();
            }
        } catch (error) {
            console.log(error)
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

            console.log(res.data);

            if (res.data.success) {
                setShowBtn("");
                getLike();
            }
        } catch (error) {
            console.log(error)
        }
    };

    const getComment = async () => {
        try {
            let res = await axios.get(API_URL + `/post/comment/${id}`);

            console.log(res.data);
            setPostComment(res.data.reverse());
        } catch (error) {
            console.log(error)
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
                getComment();
                setInputComment("");
                setCountChar(0);
            }
        } catch (error) {
            console.log(error)
        }
    };

    const printComment = () => {
        return postComment.map((val, idx) => {
            return (
                <div key={val.idcomment} className="border-bottom p-2">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <img className="rounded-circle" src={val.user_profileimage ? API_URL + val.user_profileimage : placeholder} style={{ width: "35px" }} />
                            <span className="ms-2 fw-bold">{val.comment_username}</span>
                        </div>
                        {/* <span className="text-end">delete comment</span> */}
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
            console.log(error)
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
                                <span className="text-center fs-5 fw-bold">Post Detail</span>
                                <div className="d-flex flex-column">
                                    <button className="btn btn-color-231 mt-1">
                                        <div className="py-2 row m-0 fs-5" onClick={() => navigate("/home")}>
                                            <span className="col-5 material-icons align-self-center text-end">arrow_back</span>
                                            <span className="col-7 text-start">Home</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-3">{/* blank */}</div>
                        {/* Middle */}
                        <div className="col-6">
                        <div className="d-flex justify-content-between">
                            
                        </div>
                            <div className="border d-flex justify-content-center mt-2">
                                <img src={API_URL + postDetail.post_image} style={{ maxHeight: "480px" }} />
                            </div>
                            <div className="my-2 d-flex justify-content-evenly align-items-center">
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
                                <span className="fw-bold">{postLike.length} Likes</span>
                                {
                                    username == postDetail.post_username &&
                                    <Button onClick={() => setShowEdit("show")}>edit</Button>
                                }
                            </div>
                            <div className="w-100 p-2 mb-2">
                                <div>
                                    <span className="fw-bold">{postDetail.post_username} </span>
                                    {postDetail.post_caption}
                                </div>
                                {
                                    showEdit == "show" ?
                                        <div className="w-100 my-2 d-flex align-items-end">
                                            <textarea type="text" className="form-control w-75"
                                                placeholder="edit your caption"
                                                maxLength={300}
                                                value={inputCaption}
                                                onChange={(e) => { setCountEditChar(e.target.value.length); setInputCaption(e.target.value) }}
                                            >
                                            </textarea>
                                            <div className="ms-2">
                                                <div>{countEditChar}/300</div>
                                                <Button type="button" colorScheme="green" onClick={saveEditBtn}>Save</Button>
                                                <Button className="ms-2" type="button" colorScheme="red" onClick={() => setShowEdit("")}>Cancel</Button>
                                            </div>
                                        </div>
                                        :
                                        ""
                                }
                            </div>
                            <div className="p-2 d-flex flex-column align-items-start">
                                <div className="me-3 w-100">Comments</div>
                                {status == "unverified" ?
                                    "" :
                                    <div className="w-100 my-2 d-flex align-items-end">
                                        <textarea type="text" className="form-control w-75"
                                            placeholder="add your comment here"
                                            onChange={(e) => { setCountChar(e.target.value.length); setInputComment(e.target.value) }}
                                            maxLength={300}
                                            value={inputComment}>
                                        </textarea>
                                        <div className="ms-2">
                                            <div>{countChar}/300</div>
                                            <Button type="button" onClick={addComment}>add comment</Button>
                                        </div>
                                    </div>
                                }
                                <div className="w-100">
                                    {printComment()}
                                </div>
                            </div>
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