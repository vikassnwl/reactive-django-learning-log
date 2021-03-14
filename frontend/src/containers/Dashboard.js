import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import $ from "jquery";
import { thumb_name } from "../utils";

function Dashboard({ user_id }) {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(false);
  const [id, setId] = useState(null);

  const inputRef = useRef(null);

  const config = {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  };

  const refreshList = () => {
    $(".loader, .overlay").css("display", "block");
    axios.get("/api/users/" + user_id + "/").then((res) => {
      $(".loader, .overlay").css("display", "none");
      setTasks(res.data.tasks);
      setText("");
      setEditing(false);
    });
  };

  useEffect(() => {
    refreshList();
  }, []);

  const handleDelete = (task) => {
    if (window.confirm(`'${task.item_name}' will be deleted`)) {
      $(".loader, .overlay").css("display", "block");
      axios.delete("/api/delete-task/" + task.id + "/", config).then(() => {
        $(".loader, .overlay").css("display", "none");

        refreshList();
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      item_name: text,
      user: user_id,
    };
    let url = "/api/create-task/";
    if (editing) {
      url = "/api/update-task/" + id + "/";
    }

    $(".loader, .overlay").css("display", "block");
    axios.post(url, data, config).then(() => {
      $(".loader, .overlay").css("display", "none");
      refreshList();
    });
  };

  const handleUpdate = (task) => {
    setText(task.task_name);
    setEditing(true);
    setId(task.id);
  };

  const handleStrike = (task) => {
    const data = {
      item_name: task.item_name,
      isCompleted: !task.isCompleted,
      user: user_id,
    };

    $(".loader, .overlay").css("display", "block");
    axios.post("/api/update-task/" + task.id + "/", data, config).then(() => {
      $(".loader, .overlay").css("display", "none");
      refreshList();
    });
  };

  const handleFileSelect = (e) => {
    e.preventDefault();
    inputRef.current.click();
  };

  const handleFileChange = (e) => {
    console.log(e.target.files[0]);
    const file = e.target.files[0];
    e.target.value = "";
    const fd = new FormData();
    fd.append("myFile", file, file.name);

    $(".loader, .overlay").css("display", "block");
    axios.post("/api/save-file/", fd, config).then((res) => {
      console.log(res);
      const data = {
        item_name: res.data,
        item_type: "file",
        user: user_id,
      };
      axios.post("/api/create-task/", data, config).then((res) => {
        $(".loader, .overlay").css("display", "none");
        console.log("in create task api");
        console.log(res);
        refreshList();
      });
    });
  };

  return (
    <div className="container mt-5">
      <h1 className="display-4">TODO App</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          type="text"
          className="form-control mb-2"
          placeholder="New Task"
        />

        <div className="form-group">
          <button className="btn btn-outline-primary fa fa-send me-2" />
          <input
            onChange={handleFileChange}
            ref={inputRef}
            style={{ display: "none" }}
            type="file"
          />
          <button
            onClick={handleFileSelect}
            className="btn btn-outline-secondary fa fa-paperclip"
          />
        </div>
      </form>

      <ul className="list-group mt-5">
        {tasks.map((task) => (
          <li className="list-group-item">
            {task.item_type == "file" ? (
              <>
                <img
                  style={{ display: "block" }}
                  className="mb-2"
                  src={`/api/media/${thumb_name(task.item_name)}/`}
                />

                <span>{task.item_name}</span>
              </>
            ) : (
              <span
                style={{
                  cursor: "pointer",
                  textDecoration: task.isCompleted && "line-through",
                  verticalAlign: "center",
                }}
                onClick={() => handleStrike(task)}
              >
                {task.item_name}
              </span>
            )}

            <span style={{ float: "right" }}>
              {task.item_type == "file" ? (
                <a
                  href={`/api/media/${task.item_name}/`}
                  className="fa fa-eye btn btn-outline-success me-2"
                />
              ) : (
                <button
                  onClick={() => handleUpdate(task)}
                  className="fa fa-edit btn btn-outline-info me-2"
                />
              )}
              <button
                onClick={() => handleDelete(task)}
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
