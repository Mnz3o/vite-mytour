//Login.jsx

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import app from "./firebaseConfig";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import useLoginStore from "./useLoginStore";

const Login = () => {
  const { isLogined, logined, logouted } = useLoginStore();
  let [nickName, setNickName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let pwRef = useRef();
  const navigate = useNavigate();
  const auth = getAuth(app);

  const nickNameChangeHandle = (e) => setNickName(e.target.value);
  const emailChangeHandle = (e) => setEmail(e.target.value);
  const passwordChangeHandle = (e) => setPassword(e.target.value);

  const signUpHandle = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      alert("비밀번호의 길이는 6자리 이상 사용해야 합니다.");
      pwRef.current.focus();
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        updateProfile(userCredential.user, { displayName: nickName });
        alert("회원가입이 완료되었습니다.");
        setNickName("");
        setEmail("");
        setPassword("");
      })
      .catch((error) => console.log(error));
  };

  const signInHandle = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        logined(userCredential.user.displayName);
        alert("로그인하였습니다.");
        setEmail("");
        setPassword("");
        navigate("/");
      })
      .catch((error) => console.log("에러 발생 :", error));
  };

  const logOutHandle = () => {
    signOut(auth)
      .then(() => {
        logouted();
        alert("로그아웃이 완료되었습니다.");
        navigate("/login");
      })
      .catch(() => {});
  };

  return (
    <div className="loginPage">
      <div className="loginHighlight">Log in / Sign up</div>
      <form className="loginForm">
        <label>
          Nick Name :
          <input
            type="text"
            value={nickName}
            onChange={nickNameChangeHandle}
            placeholder="회원가입시에만 입력"
          />
        </label>
        <label>
          e-mail :
          <input type="text" value={email} onChange={emailChangeHandle} />
        </label>
        <label>
          password :
          <input
            type="password"
            ref={pwRef}
            value={password}
            onChange={passwordChangeHandle}
          />
        </label>
        <p>
          {isLogined ? (
            <button type="button" className="logout-btn" onClick={logOutHandle}>
              로그아웃
            </button>
          ) : (
            <button
              type="button"
              className="login-btn login-btn-main"
              onClick={signInHandle}
            >
              로그인
            </button>
          )}
          &nbsp;|&nbsp;
          <button type="button" className="register-btn" onClick={signUpHandle}>
            회원가입
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
