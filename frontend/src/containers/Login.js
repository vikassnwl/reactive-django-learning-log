import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { login } from "../actions/auth";
import $ from "jquery";

function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {}, []);

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
    props.login(username, password, alert, loader);
  };

  if (props.isAuthenticated) return <Redirect to={props.location.state.url} />;

  return (
    <div className="container mt-5 position-relative">
      <div style={{ display: "none" }} className="alert alert-danger"></div>
      <h1 className="display-6">Login</h1>
      <p>Login to your Learning Log account</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          id="username"
          type="text"
          className="form-control mb-3"
          placeholder="Username*"
        />

        <label htmlFor="password">Password:</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          type="password"
          className="form-control mb-3"
          placeholder="Password*"
        />

        <div className="form-group">
          <input value="Login" type="submit" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
