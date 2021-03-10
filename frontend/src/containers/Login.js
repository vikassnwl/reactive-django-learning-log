import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { login } from "../actions/auth";

function Login({ login, isAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
  };

  if (isAuthenticated) return <Redirect to="/dashboard" />;

  return (
    <div className="container mt-5">
      <h1>Login</h1>
      <p>Login to your TODO App account</p>
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
