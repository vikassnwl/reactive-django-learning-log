import React from "react";
import { Link, NavLink } from "react-router-dom";
import { logout } from "../actions/auth";
import { connect } from "react-redux";

function Navbar({ logout, isAuthenticated, user_name }) {
  const loader = (loading) => {
    if (loading) {
      $(".loader, .overlay").css("display", "block");
    } else {
      $(".loader, .overlay").css("display", "none");
    }
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">
        TODO App
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/dashboard">
                  Dashboard <span className="sr-only">(current)</span>
                </NavLink>
              </li>

              <li className="nav-item">
                <a
                  onClick={() => logout(loader)}
                  className="nav-link"
                  href="#!"
                >
                  Logout({user_name})
                </a>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/login">
                  Login
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/register">
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.isAuthenticated,
  user_name: state.user_name,
});

export default connect(mapStateToProps, { logout })(Navbar);
