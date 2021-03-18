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
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <Link class="navbar-brand" to="/">
          Notes
        </Link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/dashboard/0">
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
      </div>
    </nav>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.isAuthenticated,
  user_name: state.user_name,
});

export default connect(mapStateToProps, { logout })(Navbar);
