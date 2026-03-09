//Tours.jsx
import React, { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "./firebaseConfig";
import useLoginStore from "./useLoginStore";
import "./App.css";

const Tour = () => {
  const db = getFirestore(app);
  const storage = getStorage(app);
  const isLogined = useLoginStore((state) => state.isLogined);

  let [location1, setLocation1] = useState("");
  let [date1, setDate1] = useState("");
  let [comment, setComment] = useState("");
  let [image, setImage] = useState(null);

  const locHandle = (e) => setLocation1(e.target.value);
  const dateHandle = (e) => setDate1(e.target.value);
  const commentHandle = (e) => setComment(e.target.value);
  const handleReset = () => {
    setLocation1("");
    setDate1("");
    setComment("");
    setImage(null);
  };

  const storeHandle = async (e) => {
    e.preventDefault();
    if (!isLogined) {
      alert("로그인을 해야 업로드가 가능합니다.");
      return;
    }
    if (!image) return;
    const storageRef = ref(storage, "images/" + image.name);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      null,
      (error) => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          addDoc(collection(db, "tourMemo"), {
            location: location1,
            date: date1,
            comment,
            photoURL: downloadURL,
          });
          handleReset();
          alert("한 건의 여행 추억을 등록하였습니다.");
        });
      }
    );
  };

  return (
    <div>
      <div className="recordTitleContainer">
        <div className="recordTitleBox">
          <h1>
            나의 여행 기록 추가하기
            <span className="loggedInfo">(Only logged-in users)</span>
          </h1>
        </div>
      </div>
      <form>
        <div className="tourContainer">
          <div>여 행 지</div>
          <input type="text" onChange={locHandle} value={location1} />
          <div>날 짜</div>
          <input type="date" onChange={dateHandle} value={date1} />
          <div>한 줄 평</div>
          <textarea cols="40" onChange={commentHandle} value={comment} />
          <div>사 진 첨 부</div>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          <div className="tour-btns">
            <button
              type="submit"
              className="tour-btn tour-btn-save"
              onClick={storeHandle}
            >
              저장하기
            </button>
            <input
              type="reset"
              className="tour-btn tour-btn-reset"
              value="초기화"
              onClick={handleReset}
            />
            <span className="plus-button"></span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Tour;
