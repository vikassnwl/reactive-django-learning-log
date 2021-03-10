import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { connect } from "react-redux";
import { checkAuthenticated } from "../actions/auth";

function Layout({ children, checkAuthenticated }) {
  useEffect(() => {
    checkAuthenticated();
  }, []);

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default connect(null, { checkAuthenticated })(Layout);
