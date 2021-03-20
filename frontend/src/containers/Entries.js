import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import $ from "jquery";
import { thumb_name } from "../utils";
import { Link } from "react-router-dom";

function Entries(props) {
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(false);
  const [id, setId] = useState(null);

  const [checked, setChecked] = useState(false);

  const inputRef = useRef(null);

  const { topic_id } = props.match.params;

  const config = {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  };

  const refreshList = () => {
    $(".loader, .overlay").css("display", "block");
    axios.get("/api/users/" + props.user_id + "/").then((res) => {
      $(".loader, .overlay").css("display", "none");

      setEntries(
        res.data.topic_set.filter((topic) => topic.id == topic_id)[0].entry_set
      );
      setText("");
      setEditing(false);
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

    const data = {
      content: text,
      topic: topic_id,
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
  };

  const handleUpdate = (entry) => {
    setText(entry.content);
    setEditing(true);
    setId(entry.id);
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

  return (
    <div className="container mt-5">
      <h1 className="display-4">Entries</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="form-control mb-2"
          placeholder="New Entry"
        />

        <button className="btn btn-outline-primary fa fa-send me-2" />
      </form>

      <ul className="list-group mt-5">
        {entries.map((entry) => (
          <li key={entry.id} className="list-group-item">
            <div
              style={{ display: "inline" }}
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
