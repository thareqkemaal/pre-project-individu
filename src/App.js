import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { loginAction } from './action/userAction';
import './App.css';
import { API_URL } from './helper';
import EditProfilePage from './pages/EditProfile';
import ForgotPassPage from './pages/ForgotPassword';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import NewPassPage from './pages/NewPassword';
import NotFoundPage from './pages/NotFoundPage';
import PostDetailPage from './pages/PostDetail';
import RegisterPage from './pages/RegisterPage';
import UserProfilePage from './pages/UserProfile';
import VerificationPage from './pages/VerificationPage';

const App = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { username } = useSelector(({ userReducer }) => {
    return {
      username: userReducer.username
    };
  });

  const keepLogin = async () => {
    try {
      let activeUser = localStorage.getItem("activeUser");

      if (activeUser) {
        let res = await axios.patch(API_URL + `/auth/keep`, {}, {
          headers: {
            'Authorization': `Bearer ${activeUser}`
          }
        })

        if (res.data.idusers) {
          //console.log("get user data",res.data)
          localStorage.setItem("activeUser", res.data.token);
          delete res.data.token;
          dispatch(loginAction(res.data));
        };
      }
    } catch (error) {
      console.log(error)
    }
  };


  React.useEffect(() => {
    keepLogin()
  }, []);

  return (
    <div>
      {/* <Navbar/> */}
      <Routes>
        <Route path="/" element={username ? <Navigate to="/home" replace /> : <LandingPage />} />
        {
          username ?
            <>
              <Route path="/home" element={<HomePage />} />
              <Route path="/editprofile" element={<EditProfilePage />} />
              <Route path="/postdetail/:username/:id" element={<PostDetailPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/verification/:token" element={<VerificationPage />} />
            </>
            :
            <>
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
            </>
        }
        <Route path="/forgotpass" element={<ForgotPassPage />} />
        <Route path="/newpass" element={<NewPassPage />} />
        <Route path="*" element={<NotFoundPage />} />
        {/* <Route path="/stylepage" element={<StylePage/>}/> */}
      </Routes>
    </div>
  );
}

export default App;
