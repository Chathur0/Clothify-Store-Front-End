import React from "react";

const Loading = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div className="spinner-border text-primary" role="status" style={{ width: "5rem", height: "5rem" }}>
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
