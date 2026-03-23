import "./BucketList.css";
import React, { useState, useEffect } from "react";
import app from "./firebaseConfig";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import useLoginStore from "./useLoginStore";

const BucketList = () => {
  const db = getFirestore(app);
  const isLogined = useLoginStore((state) => state.isLogined);
  const userName = useLoginStore((state) => state.userName);

  const [bucketList, setBucketList] = useState([]);
  const [newPlace, setNewPlace] = useState("");

  useEffect(() => {
    fetchBucketList();
  }, []);

  const fetchBucketList = async () => {
    const querySnapshot = await getDocs(collection(db, "bucketList"));
    const list = [];
    querySnapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });
    setBucketList(list);
  };

  const addPlace = async () => {
    if (!isLogined) {
      alert("로그인 후 추가 가능합니다.");
      return;
    }
    if (!newPlace) return;
    await addDoc(collection(db, "bucketList"), {
      place: newPlace,
      likes: 0,
      user: userName,
    });
    setNewPlace("");
    fetchBucketList();
  };

  const removePlace = async (id) => {
    await deleteDoc(doc(db, "bucketList", id));
    fetchBucketList();
  };

  const likePlace = async (id, currentLikes) => {
    await updateDoc(doc(db, "bucketList", id), {
      likes: currentLikes + 1,
    });
    fetchBucketList();
  };

  return (
    <div className="bucket-wrapper">
      <h1 className="bucket-title">My Bucket List!</h1>

      <div className="bucket-input-box">
        <input
          className="bucket-input"
          type="text"
          value={newPlace}
          onChange={(e) => setNewPlace(e.target.value)}
          placeholder="어디로 여행 가고 싶나요?"
        />
        <button className="bucket-add-btn" onClick={addPlace}>
          추가
        </button>
      </div>

      <ul className="bucket-list">
        {bucketList.map((item) => (
          <li key={item.id} className="bucket-item">
            <div className="bucket-left">
              <span className="bucket-place">{item.place}</span>
              <span className="likes-text">💙 {item.likes}</span>
            </div>

            <div className="bucket-btn-box">
              <button
                className="like-btn"
                onClick={() => likePlace(item.id, item.likes)}
              >
                💙 여기 꼭 가보고 싶어요!
              </button>

              {isLogined && (
                <button
                  className="delete-btn"
                  onClick={() => removePlace(item.id)}
                >
                  삭제
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BucketList;
