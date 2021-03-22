import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import $ from "jquery";
import { thumb_name } from "../utils";

function Entries(props) {
  const [topic, setTopic] = useState({ entry_set: [] });
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(false);
  const [id, setId] = useState(null);
  const inputRef = useRef(null);
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");

  const { topic_id } = props.match.params;

  const config = {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  };

  // ================Dragging logic goes here==============
  const draggables = document.querySelectorAll(".draggable");
  const containers = document.querySelectorAll(".draggable-container");

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
    });
    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");
    });
  });

  containers.forEach((container) => {
    container.addEventListener("dragover", (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(container, e.clientY);
      const draggable = document.querySelector(".dragging");

      if (afterElement == null) {
        container.appendChild(draggable);
      } else {
        container.insertBefore(draggable, afterElement);
      }
    });
  });

  function getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll(".draggable:not(.dragging)"),
    ];
    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
      }
    ).element;
  }
  // ================Dragging logic ends here==================

  const refreshList = () => {
    $(".loader, .overlay").css("display", "block");
    axios.get("/api/users/" + props.user_id + "/").then((res) => {
      $(".loader, .overlay").css("display", "none");

      setTopic(res.data.topic_set.filter((topic) => topic.id == topic_id)[0]);
      setText("");
      setEditing(false);
      setFileName("");
    });
  };

  useEffect(() => {
    refreshList();
  }, []);

  const handleDelete = (entry) => {
    if (window.confirm(`'${entry.content}' will be deleted`)) {
      $(".loader, .overlay").css("display", "block");
      axios.delete("/api/delete-entry/" + entry.id + "/", config).then(() => {
        $(".loader, .overlay").css("display", "none");

        refreshList();
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (fileName) {
      const fd = new FormData();
      console.log(fileName);
      fd.append("myFile", file, file.name);

      $(".loader, .overlay").css("display", "block");
      axios.post("/api/save-file/", fd, config).then((res) => {
        $(".loader, .overlay").css("display", "none");

        const data = {
          content: text,
          topic: topic_id,
          image: res.data,
        };

        let url = "/api/create-entry/";
        if (editing) {
          url = "/api/update-entry/" + id + "/";
        }

        $(".loader, .overlay").css("display", "block");
        axios.post(url, data, config).then(() => {
          $(".loader, .overlay").css("display", "none");
          refreshList();
        });
      });
    } else {
      const data = {
        content: text,
        topic: topic_id,
        image: fileName,
      };

      let url = "/api/create-entry/";
      if (editing) {
        url = "/api/update-entry/" + id + "/";
        const data = {
          content: text,
          topic: topic_id,
        };
      }

      $(".loader, .overlay").css("display", "block");
      axios.post(url, data, config).then(() => {
        $(".loader, .overlay").css("display", "none");
        refreshList();
      });
    }
  };

  const handleUpdate = (entry) => {
    const fname = entry.image;
    if (fname.length > 15) {
      setFileName(
        fname.substring(0, 15) + "..." + fname.substring(fname.length - 5)
      );
    } else {
      setFileName(fname);
    }

    setText(entry.content);
    setEditing(true);
    setId(entry.id);
  };

  const handleStrike = (entry) => {
    const data = {
      ...entry,
      isCompleted: !entry.isCompleted,
    };

    const url = "/api/update-entry/" + entry.id + "/";

    $(".loader, .overlay").css("display", "block");
    axios.post(url, data, config).then(() => {
      $(".loader, .overlay").css("display", "none");
      refreshList();
    });
  };

  const handleLinks = (words) => {
    let result2 = [];
    let result = [];
    for (let word of words.split("<br />")) {
      for (let word2 of word.split("&nbsp;")) {
        if (word2.includes("://")) {
          word2 = `<a target="_blank" href='${word2}'>${word2}</a>`;
        }
        result.push(word2);
      }
      result2.push(result.join("&nbsp;"));
      result = [];
    }

    return result2.join("<br />");
  };

  const handleFileSelect = (e) => {
    e.preventDefault();
    inputRef.current.click();
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    const fname = e.target.files[0].name;
    if (fname.length > 15) {
      setFileName(
        fname.substring(0, 15) + "..." + fname.substring(fname.length - 5)
      );
    } else {
      setFileName(fname);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="display-4">{topic.name}</h1>

      <form onSubmit={handleSubmit}>
        <input
          onChange={handleFileChange}
          ref={inputRef}
          type="file"
          style={{ display: "none" }}
        />
        {topic.type === "tasks" ? (
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="form-control mb-2"
            placeholder="New Entry"
          />
        ) : (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="form-control mb-2"
            placeholder="New Entry"
          />
        )}

        <button className="btn btn-outline-primary fa fa-send me-2" />
        <input
          onChange={handleFileChange}
          ref={inputRef}
          type="file"
          style={{ display: "none" }}
        />
        <button
          onClick={handleFileSelect}
          className="btn btn-outline-secondary fa fa-paperclip me-2"
        />
        {fileName}
      </form>

      <ul
        className={
          topic.type === "tasks"
            ? "list-group mt-5 draggable-container"
            : "list-group mt-5"
        }
      >
        {topic.entry_set.map((entry) => (
          <li
            draggable={topic.type === "tasks" && "true"}
            key={entry.id}
            className={
              topic.type === "tasks"
                ? "list-group-item draggable"
                : "list-group-item"
            }
          >
            {topic.type === "tasks" ? (
              <span
                onClick={() => handleStrike(entry)}
                style={{
                  textDecoration: entry.isCompleted && "line-through",
                  cursor: "pointer",
                }}
                dangerouslySetInnerHTML={{
                  __html: handleLinks(
                    entry.content
                      .split(" ")
                      .join("&nbsp;")
                      .split("\n")
                      .join("<br />")
                  ),
                }}
              />
            ) : (
              <>
                {entry.image && (
                  <img
                    style={{ display: "block" }}
                    className="mb-2"
                    src={`/api/media/${thumb_name(entry.image)}/`}
                  />
                )}

                <span
                  dangerouslySetInnerHTML={{
                    __html: handleLinks(
                      entry.content
                        .split(" ")
                        .join("&nbsp;")
                        .split("\n")
                        .join("<br />")
                    ),
                  }}
                />
              </>
            )}

            <span style={{ float: "right" }}>
              <button
                onClick={() => handleUpdate(entry)}
                className="fa fa-edit btn btn-outline-info me-2"
              />

              <button
                onClick={() => handleDelete(entry)}
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

export default connect(mapStateToProps, {})(Entries);
