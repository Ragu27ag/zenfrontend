import { Button, Typography } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import backendInstance from "../Axios/axios";
import SnackBarComp from "../Components/SnackBarComp";

const Tasks = () => {
  const User = useMemo(
    () => JSON.parse(sessionStorage.getItem("user")) || {},
    []
  );

  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);

  const [openSnack, setOpenSnack] = React.useState(false);

  const [dataMsg, setDataMsg] = React.useState("");

  const tasksData = useCallback(async () => {
    const { data } = await backendInstance.get(`/tasks/${User.email}`);
    setTasks(data);
  }, [User.email, setTasks]);

  const adminData = useCallback(async () => {
    const { data } = await backendInstance.get(`/tasks`);
    setAllTasks(data);
  }, [User.email, setAllTasks]);

  useEffect(() => {
    if (Object.keys(User).length === 0) {
      navigate("/login");
    }
    if (User.role === "student") {
      tasksData();
    } else {
      adminData();
    }
  }, [User, navigate, tasksData, adminData]);

  const handleClick = () => {
    console.log("opened");
    setDataMsg("Submitted Successfully");
    setOpenSnack(true);
    adminData();
  };

  const handleMarks = (e, query) => {
    document.getElementById("submitbutt").disabled = true;
    e.preventDefault();
    let dataObj = {};
    Array.from(e.target.elements).forEach((ele) => {
      if (ele.nodeName === "INPUT" || ele.nodeName === "TEXTAREA") {
        dataObj[ele.name] = ele.value;
      }
    });
    console.log(dataObj);
    if (dataObj.marks <= 0 || dataObj.marks > 10) {
      alert("Marks should not be greater than 10 or less than 0 ");
      document.getElementById("submitbutt").disabled = false;
    } else {
      dataObj = {
        ...dataObj,
        email: query.email,
        day: query.day,
        evaluated: true,
      };

      const res = backendInstance.put("/tasks", dataObj);
      if (res) {
        handleClick();
        document.getElementById("submitbutt").disabled = false;
        document.getElementById("marks").value = "";
        document.getElementById("comments").value = "";
      }
      document.getElementById("submitbutt").disabled = false;
    }
  };

  return (
    <div
      className="main-div"
      style={{
        display: "grid",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {" "}
      {User.role === "student" ? (
        <div className="query-main">
          {tasks.map((query) => (
            <div
              className="tasks-div"
              style={{
                border: "1px solid  grey",
                display: "flex",
                justifyContent: "space-around",
                flexWrap: "wrap",
                marginTop: "10px",
                borderRadius: "8px",
                boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
              }}
            >
              <div className="tasks-div1" style={{ width: "250px" }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "#555A8f", padding: "5px" }}
                >
                  {User.name}
                </Typography>
                <p
                  style={{
                    color: "#161718",
                    fontSize: "15px",
                    padding: "5px",
                    overflowWrap: "break-word",
                  }}
                >
                  Day {query.day} - {query.dayTask}
                </p>
                <p
                  style={{
                    color: "#161718",
                    fontSize: "15px",
                    padding: "5px",
                    overflowWrap: "break-word",
                  }}
                >
                  {" "}
                  <span style={{ color: "#7E8E9F" }}>URL : </span>
                  {query.url}
                </p>
              </div>
              <div className="tasks-div1" style={{ width: "250px" }}>
                {" "}
                <p
                  style={{
                    color: "#161718",
                    fontSize: "15px",
                    padding: "5px",
                    overflowWrap: "break-word",
                  }}
                >
                  <span style={{ color: "#7E8E9F" }}>Submitted on : </span>
                  {query.submitted}
                </p>
                <p
                  style={{
                    color: "#161718",
                    fontSize: "15px",
                    padding: "5px",
                    overflowWrap: "break-word",
                  }}
                >
                  <span style={{ color: "#7E8E9F" }}>Marks : </span>
                  <span
                    style={{
                      border: "1px solid #FF9828",
                    }}
                  >
                    {" "}
                    {query.marks}
                  </span>
                </p>
                <p style={{ overflowWrap: "break-word" }}>
                  <span style={{ color: "#7E8E9F" }}>Comments : </span>
                  {query.comments}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{}}>
          {allTasks
            .filter((tas) => tas.evaluated === false)
            .map((query) => (
              <div
                style={{
                  margin: "5px",
                  border: "2px solid",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-around",
                }}
              >
                <div>
                  <Typography variant="h5">
                    Day {query.day} - {query.dayTask}
                  </Typography>
                  <p>
                    {" "}
                    <span>URL : </span>
                    {query.url}
                  </p>
                  <p>
                    <span>Submitted on : </span>
                    {query.submitted}
                  </p>
                  <p>
                    <span>Submitted by : </span>
                    {query.email}
                  </p>
                </div>
                <div>
                  <form onSubmit={(e) => handleMarks(e, query)}>
                    <label htmlFor="marks">Marks</label>
                    <br />
                    <input type="text" name="marks" id="marks" required />
                    <br />
                    <label htmlFor="comments">Comments</label>
                    <br />
                    <textarea
                      name="comments"
                      id="comments"
                      rows={10}
                      cols={20}
                      required
                    ></textarea>
                    <br />
                    <br />
                    <Button
                      sx={{ backgroundColor: "buttcolor.main" }}
                      variant="contained"
                      type="submit"
                      id="submitbutt"
                    >
                      submit
                    </Button>
                  </form>
                </div>
              </div>
            ))}
        </div>
      )}
      <SnackBarComp
        openSnack={openSnack}
        setOpenSnack={setOpenSnack}
        dataMsg={dataMsg}
      />
    </div>
  );
};

export default Tasks;
