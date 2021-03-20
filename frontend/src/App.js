import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Dashboard from "./containers/Dashboard";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Layout from "./hocs/Layout";
import { Provider } from "react-redux";
import { store } from "./store";
import PrivateRoute from "./hocs/PrivateRoute";
import Register from "./containers/Register";
import Entries from "./containers/Entries";

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Layout>
            <Route exact path="/" component={Home} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute
              exact
              path="/dashboard/:topic_id"
              component={Entries}
            />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
          </Layout>
        </Router>
      </Provider>
    );
  }
}

const appDiv = document.querySelector("#app");
render(<App />, appDiv);
