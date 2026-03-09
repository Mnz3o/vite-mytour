//App.jsx
//import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, NavLink } from "react-router";
import Home from "./Home";
import Photos from "./Photos";
import Tour from "./Tour";
import EditTrip from "./EditTrip";
import Login from "./Login";
import useLoginStore from "./useLoginStore";
import Top3 from "./Top3";
import BucketList from "./BucketList";

function App() {
  const isLogined = useLoginStore((state) => state.isLogined);
  const userName = useLoginStore((state) => state.userName);

  return (
    <BrowserRouter>
      <div style={{ textAlign: "center" }}>
        <div className="header-wrapper">
          <h1 className="header">MY TOUR ARCHIVE</h1>
          <div className="login-status">
            {isLogined ? userName : "Logged out"}
          </div>
        </div>
      </div>
      <nav className="navi">
        <NavLink to="/" className="nav-item">
          Home
        </NavLink>
        <NavLink to="/photos" className="nav-item">
          My Diary
        </NavLink>
        <NavLink to="/top3" className="nav-item">
          My Picks
        </NavLink>
        <NavLink to="/bucketlist" className="nav-item">
          Bucket List
        </NavLink>
        <NavLink to="/tour" className="nav-item add-btn">
          +
        </NavLink>
        <NavLink to="/login" className="nav-item">
          Login
        </NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/tour" element={<Tour />} />
        <Route path="/top3" element={<Top3 />} />
        <Route path="/bucketlist" element={<BucketList />} />
        <Route path="/editTrip/:docId" element={<EditTrip />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
