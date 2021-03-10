import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { register } from "../actions/auth";

function Register({ register, isAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    register(username, password, confirmPassword);
  };

  if (isAuthenticated) return <Redirect to="/dashboard" />;

  return (
    <div className="container mt-5">
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
