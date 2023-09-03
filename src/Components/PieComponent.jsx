import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJs, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Box } from "@mui/material";
import backendInstance from "../Axios/axios";

const PieComponent = () => {
  const User = useMemo(
    () => JSON.parse(sessionStorage.getItem("user")) || {},
    []
  );
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState([]);
  const [classData, setClassData] = useState([]);

  const getData = useCallback(async () => {
    const resTask = await backendInstance.get(`/tasks/${User.email}`);
    setTaskData(resTask.data);
    const resClass = await backendInstance.get(`/classes`);
    setClassData(resClass.data);

    // setResult({ ...data });
  }, [setTaskData, User.email]);

  ChartJs.register(Title, Tooltip, ArcElement, Legend);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Tasks completed ${taskData.length} (out of ${classData.length}) `,
      },
    },
  };

  const data = {
    labels: classData.length,
    datasets: [
      {
        label: `Day`,
        data: taskData
          .sort((a, b) => {
            return a.day - b.day;
          })
          .map((cal) => cal.day),
        backgroundColor: ["rgba(255, 99, 132, 0.5)", "rgba(255, 206, 86, 1)"],
      },
    ],
  };

  useEffect(() => {
    if (Object.keys(User).length === 0) {
      navigate("/login");
    } else {
      if (User.role === "student") {
        getData();
      }
    }
  }, [User, navigate, getData]);

  console.log(data.datasets[0].data);
  return (
    <Box width={400} height={400}>
      <Pie options={options} data={data} />
    </Box>
  );
};

export default PieComponent;
