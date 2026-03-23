//import React from "react";
const Home = () => {
  return (
    <div className="home-wrapper">
      <div className="home-bg"></div>

      <div className="home-content">
        <h1 className="home-title">나만의 여행 기록 보관소</h1>
        <p className="home-desc">
          떠났던 순간들을 다시 꺼내볼 수 있는 공간.
          <br /> 사진과 기록을 모아 나만의 아카이브를 만들어보세요.
        </p>

        <button
          className="home-btn"
          onClick={() => (window.location.href = "/photos")}
        >
          My Diary에서 첫 번째 기록 열기
        </button>
      </div>
    </div>
  );
};

export default Home;
