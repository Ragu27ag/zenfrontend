import { Button, Typography } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import backendInstance from "../Axios/axios";

const Tasks = () => {
  const User = useMemo(
    () => JSON.parse(sessionStorage.getItem("user")) || {},
    []
  );

  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  const tasksData = useCallback(async () => {
    const { data } = await backendInstance.get(`/tasks/${User.email}`);
    setTasks(data);
  }, [User.email, setTasks]);

  useEffect(() => {
    if (Object.keys(User).length === 0) {
      navigate("/login");
    } else {
      tasksData();
    }
  }, [User, navigate, tasksData]);

  return (
    <div>
      {" "}
      <div
        style={{
          margin: "5px",
          border: "2px solid",
        }}
        className="query-main"
      >
        {tasks.map((query) => (
          <div style={{ margin: "5px", border: "2px solid" }}>
            <Typography variant="h5">
              Day {query.day} - {query.dayTask}
            </Typography>
            <p>{query.url}</p>
            <p>{query.submitted}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
