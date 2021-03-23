import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import $ from "jquery";
import { thumb_name } from "../utils";
import { Link } from "react-router-dom";

function Dashboard(props) {
  const [topics, setTopics] = useState([]);
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(false);
  const [id, setId] = useState(null);
  const [option, setOption] = useState("");

  const config = {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  };

  const refreshList = () => {
    $(".loader, .overlay").css("display", "block");
    axios.get("/api/users/" + props.user_id + "/").then((res) => {
      $(".loader, .overlay").css("display", "none");
      setTopics(res.data.topic_set);
      setText("");
      setEditing(false);
    });
  };

  useEffect(() => {
    refreshList();
  }, []);

  const handleDelete = (topic) => {
    if (window.confirm(`'${topic.name}' will be deleted`)) {
      $(".loader, .overlay").css("display", "block");
      axios.delete("/api/delete-topic/" + topic.id + "/", config).then(() => {
        $(".loader, .overlay").css("display", "none");

        refreshList();
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      name: text,
      user: props.user_id,
      type: option,
    };
    let url = "/api/create-topic/";
    if (editing) {
      url = "/api/update-topic/" + id + "/";
    }

    $(".loader, .overlay").css("display", "block");
    axios.post(url, data, config).then(() => {
      $(".loader, .overlay").css("display", "none");
      refreshList();
    });
  };

  const handleUpdate = (topic) => {
    setText(topic.name);
    setEditing(true);
    setId(topic.id);
  };

  const handleOption = (e) => {
    setOption(e.target.value);
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit}>
        <h1 className="display-4">Topics</h1>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          type="text"
          className="form-control mb-2"
          placeholder="New Topic"
        />

        <button className="btn btn-outline-primary fa fa-send me-4" />
        <label className="me-2">Type:</label>
        <select value={option} onChange={handleOption}>
          <option>--select--</option>
          <option value="tasks">Tasks</option>
        </select>
      </form>

      <ul className="list-group mt-5">
        {topics.map((topic) => (
          <li
            style={{ wordWrap: "break-word" }}
            key={topic.id}
            className="list-group-item"
          >
            <Link
              to={`/dashboard/${topic.id}`}
              style={{ textDecoration: "none" }}
            >
              <i className="fa fa-folder-o me-2" />
              <span className="me-2">{topic.name}</span>
            </Link>
            {topic.type === "tasks" && (
              <span className="badge rounded-pill bg-dark text-light">
                Tasks
              </span>
            )}
            <span style={{ float: "right" }}>
              <button
                onClick={() => handleUpdate(topic)}
                className="fa fa-edit btn btn-outline-info me-2"
              />

              <button
                onClick={() => handleDelete(topic)}
                className="fa fa-trash btn btn-outline-danger"
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
const mapStateToProps = (state) => ({
  user_id: state.user_id,
});

export default connect(mapStateToProps, {})(Dashboard);
