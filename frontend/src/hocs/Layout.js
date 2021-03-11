import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { connect } from "react-redux";
import { checkAuthenticated } from "../actions/auth";

function Layout({ children, checkAuthenticated }) {
  useEffect(() => {
    const loader = (loading) => {
      if (loading) {
        $(".loader, .overlay").css("display", "block");
      } else {
        $(".loader, .overlay").css("display", "none");
      }
    };
    checkAuthenticated(loader);
  }, []);

  return (
    <>
      <img
        className="loader"
        style={{
          display: "none",
          width: "50px",
          height: "50px",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: "3",
        }}
        src="../../static/images/loader.gif"
      />

      <div
        className="overlay"
        style={{
          display: "none",
          background: "black",
          opacity: "0.5",
          position: "absolute",
          zIndex: "2",
          width: "100%",
          height: "100%",
        }}
      ></div>

      <Navbar />
      {children}
    </>
  );
}

export default connect(null, { checkAuthenticated })(Layout);
