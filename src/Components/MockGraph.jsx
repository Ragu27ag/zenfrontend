import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Box } from "@mui/material";
import backendInstance from "../Axios/axios";

const MockGraph = () => {
  const User = useMemo(
    () => JSON.parse(sessionStorage.getItem("user")) || {},
    []
  );
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState([]);

  const getData = useCallback(async () => {
    const resTask = await backendInstance.get(`/mock/${User.email}`);
    setTaskData(resTask.data);
    // const resClass = await backendInstance.get(`/mock`);
    // setClassData(resClass.data);

    // setResult({ ...data });
  }, [setTaskData, User.email]);

  ChartJs.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Mock Marks",
      },
    },
  };

  const data = {
    labels: ["First", "Second", "third"],
    datasets: [
      {
        fill: true,
        label: `Marks`,
        data: taskData
          .sort((a, b) => {
            return a.date - b.date;
          })
          .map((cal) => cal.score),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const res = {
    arr: taskData.map((tas) => tas.score),
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
    <Box width={400} height={600}>
      <p>
        <span>Average Score : </span>
        {(
          res.arr?.reduce((prev, curr) => Number(prev) + Number(curr), 0) /
          taskData?.length
        ).toFixed(2)}
      </p>
      <Line options={options} data={data} />
    </Box>
  );
};

export default MockGraph;
