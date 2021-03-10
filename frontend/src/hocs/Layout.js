import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { connect } from "react-redux";
import { checkAuthenticated } from "../actions/auth";

function Layout({ children, checkAuthenticated }) {
  useEffect(() => {
    const loader = (loading) => {
      if (loading) {
        document.querySelector(".loader").style.display = "block";
      } else {
        document.querySelector(".loader").style.display = "none";
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
          zIndex: "2",
        }}
        src="../../static/images/loader.gif"
      />
      <Navbar />
      {children}
    </>
  );
}

export default connect(null, { checkAuthenticated })(Layout);
