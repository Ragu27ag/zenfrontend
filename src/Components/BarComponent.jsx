import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Box } from "@mui/material";
import backendInstance from "../Axios/axios";

const BarComponent = () => {
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

  ChartJs.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
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
        text: "Tasks Marks",
      },
    },
  };

  const datas = {
    labels: taskData
      .sort((a, b) => {
        return a.day - b.day;
      })
      .map((cal) => (cal.marks ? cal : "-")),
  };

  console.log(datas.labels);

  const data = {
    labels: classData
      .sort((a, b) => {
        return a.day - b.day;
      })
      .map((cal) => (cal.activities !== "" ? "Day-" + cal.day : "-")),
    datasets: [
      {
        label: `Marks`,
        data: classData
          .sort((a, b) => {
            return a.day - b.day;
          })
          .map((cal) =>
            datas.labels.reduce((acc, da) => {
              if (da.day === cal.day) {
                acc = da.marks;
              }
              return acc;
            }, "")
          ),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
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
    <Box height={400} width={600}>
      <Bar options={options} data={data} />
    </Box>
  );
};

export default BarComponent;
