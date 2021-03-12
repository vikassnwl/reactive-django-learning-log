import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import $ from "jquery";
import { Link } from "react-router-dom";

function Dashboard({ user_id }) {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(false);
  const [id, setId] = useState(null);

  const inputRef = useRef(null);

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
      const config = {
        headers: {
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
      };
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
    const config = {
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };

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
    const config = {
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
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
    const fd = new FormData();
    fd.append("myFile", file, file.name);
    const config = {
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };
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

  // ========================================================================================
  // =================================== Returning JSX ======================================
  // ========================================================================================

  return (
    <div className="container mt-5">
      <h1>TODO App</h1>

      {/* ==========================FORM BEGINS========================== */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            type="text"
            className="form-control"
            placeholder="New Task"
          />
        </div>
        <div className="form-group">
          <button className="btn btn-primary fa fa-send mr-2" />
          <input
            onChange={handleFileChange}
            ref={inputRef}
            style={{ display: "none" }}
            type="file"
          />
          <button
            onClick={handleFileSelect}
            className="btn btn-secondary fa fa-paperclip"
          />
        </div>
      </form>
      {/* ==========================FORM ENDS========================== */}

      {/* ==========================LIST BEGINS========================== */}
      <ul className="list-group mt-5">
        {tasks.map((task) => (
          <li className="list-group-item">
            {task.item_type == "file" ? (
              <>
                <img
                  className=""
                  src={`/api/media/${
                    task.item_name
                      .split(".")
                      .slice(0, task.item_name.split(".").length - 1)
                      .join() +
                    "-thumb." +
                    task.item_name
                      .split(".")
                      .slice(task.item_name.split(".").length - 1)
                  }/`}
                />

                <span>{task.item_name}</span>
              </>
            ) : (
              <span
                style={{
                  cursor: "pointer",
                  textDecoration: task.isCompleted && "line-through",
                }}
                onClick={() => handleStrike(task)}
              >
                {task.item_name}
              </span>
            )}

            <span className="float-right">
              {task.item_type == "file" ? (
                <button
                  onClick={() =>
                    (window.location.href = `/api/media/${task.item_name}/`)
                  }
                  className="fa fa-eye btn btn-success mr-2"
                />
              ) : (
                <button
                  onClick={() => handleUpdate(task)}
                  className="fa fa-edit btn btn-info mr-2"
                />
              )}
              <button
                onClick={() => handleDelete(task)}
                className="fa fa-trash btn btn-danger"
              />
            </span>
          </li>
        ))}
      </ul>
      {/* ==========================LIST ENDS========================== */}
    </div>
  );
}

const mapStateToProps = (state) => ({
  user_id: state.user_id,
});

export default connect(mapStateToProps, {})(Dashboard);
