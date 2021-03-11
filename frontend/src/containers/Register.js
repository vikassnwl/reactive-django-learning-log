import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { register } from "../actions/auth";
import $ from "jquery";

function Register({ register, isAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    $("input").blur();
    const alert = (error) => {
      document.querySelector(".alert").innerHTML = error;
      document.querySelector(".alert").style.display = "block";
      $(".container").animate({ left: "10px" }, 50);
      $(".container").animate({ left: "-10px" }, 50);
      $(".container").animate({ left: "0px" }, 50);
      $(".container").animate({ left: "10px" }, 50);
      $(".container").animate({ left: "-10px" }, 50);
      $(".container").animate({ left: "0px" }, 50);
    };
    const loader = (loading) => {
      if (loading) {
        $(".loader, .overlay").css("display", "block");
      } else {
        $(".loader, .overlay").css("display", "none");
      }
    };
    register(username, password, confirmPassword, alert, loader);
  };

  if (isAuthenticated) return <Redirect to="/dashboard" />;

  return (
    <div className="container mt-5 position-relative">
      <div style={{ display: "none" }} className="alert alert-danger"></div>
      <h1>Register</h1>
      <p>Register for your TODO App account</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            id="username"
            type="text"
            className="form-control"
            placeholder="Username*"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            type="password"
            className="form-control"
            placeholder="Password*"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            id="confirm-password"
            type="password"
            className="form-control"
            placeholder="Confirm Password*"
          />
        </div>
        <div className="form-group">
          <input value="Register" type="submit" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.isAuthenticated,
});

export default connect(mapStateToProps, { register })(Register);
