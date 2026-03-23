// Photos.jsx
// Photos.jsx
import React, { useState, useEffect } from "react";
import "./photos.css";
import app from "./firebaseConfig";

import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { Link, useNavigate } from "react-router";
import useLoginStore from "./useLoginStore";

const Photos = () => {
  const db = getFirestore(app);
  const storage = getStorage(app);
  const navigate = useNavigate();
  const isLogined = useLoginStore((state) => state.isLogined);

  const [displayList, setDisplayList] = useState([]);
  const [docId, setDocId] = useState([]);
  const [refreshNeeded, setRefreshNeeded] = useState(0);

  // 🔥 좋아요 상태 추가
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const querySnapshot = await getDocs(collection(db, "tourMemo"));
      setDisplayList([]);
      setDocId([]);

      let tempList = [];
      let tempDocId = [];

      querySnapshot.forEach((doc) => {
        tempDocId.push(doc.id);
        tempList.push(doc.data());
      });

      setDisplayList(tempList);
      setDocId(tempDocId);

      // 🔥 좋아요 배열도 데이터 개수에 맞춰 초기화
      setLikes(Array(tempList.length).fill(0));
    };

    getData();
  }, [refreshNeeded]);

  // ❤️ 좋아요 증가 함수
  const handleLike = (index) => {
    setLikes((prev) => {
      const updated = [...prev];
      updated[index] += 1;
      return updated;
    });
  };

  const deleteHandle = async (docId, photoURL) => {
    const photoImageRef = ref(storage, photoURL);
    deleteObject(photoImageRef)
      .then(() => console.log("이미지 삭제 완료"))
      .catch(() => console.log("이미지 삭제 실패"));

    await deleteDoc(doc(db, "tourMemo", docId));

    setRefreshNeeded((prev) => prev + 1);

    alert("데이터가 제거되었습니다.");
    navigate("/photos");
  };

  return (
    <div>
      <div className="photos-header">
        <h1>소중했던 여행의 순간들</h1>
        <h3>사진과 함께 여행의 추억을 되살려보세요.</h3>
      </div>

      <section className="cards">
        {displayList.map((item, index) => {
          return (
            <div className="card" key={index}>
              <img
                className="cardImage"
                src={item.photoURL}
                alt="추억의 사진"
              />

              <div className="cardContent">
                <h2 className="cardTitle">{item.location}</h2>
                <p className="cardText">{item.comment}</p>
                <p className="cardDate">{item.date}</p>
              </div>

              <div className="buttons">
                {/* ❤️ 좋아요 기능 (로그인 상태와 무관) */}
                <button
                  type="button"
                  className="likeButton"
                  onClick={() => handleLike(index)}
                >
                  💙 {likes[index]}
                </button>

                {/* 로그인 시에만 Edit 버튼 */}
                {isLogined && (
                  <Link to={"/editTrip/" + docId[index]} className="editButton">
                    <button type="button">Edit</button>
                  </Link>
                )}

                {/* 로그인 시에만 Delete 버튼 */}
                {isLogined && (
                  <button
                    type="button"
                    className="deleteButton"
                    onClick={() => deleteHandle(docId[index], item.photoURL)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Photos;
