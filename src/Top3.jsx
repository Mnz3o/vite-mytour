// Top3.jsx
import React, { useState, useEffect } from "react";
import "./Top3.css";
import app from "./firebaseConfig";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const Top3 = () => {
  const db = getFirestore(app);
  const [top3List, setTop3List] = useState([]);

  useEffect(() => {
    const fetchTop3ById = async () => {
      const top3Ids = [
        "UTdF9wU1dykfn6jtVjtJ", // 1위
        "WyGz7DH9gflYdCM5YKHX", // 2위
        "PKadkWAj9FrdT2LotDX5", // 3위
      ];

      const data = [];
      for (const id of top3Ids) {
        const docRef = doc(db, "tourMemo", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          data.push(docSnap.data());
        }
      }
      setTop3List(data);
    };

    fetchTop3ById();
  }, []);

  return (
    <>
      <div className="top3-header-wrapper">
        <span className="top3-header-text">TOP 3!</span>
      </div>
      <div className="top3-container">
        {top3List.map((item, index) => (
          <div className="top3-item" key={index}>
            <div className={`rank-number ${"rank-" + (index + 1)}`}>
              {index + 1}
            </div>
            <div className="top3-card">
              <img src={item.photoURL} alt={item.location} />
              <div className="top3-card-content">
                <h2 className="top3-card-title">{item.location}</h2>
                <p className="top3-card-comment">{item.comment}</p>
                <p className="top3-card-date">{item.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Top3;
