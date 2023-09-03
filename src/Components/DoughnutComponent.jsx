import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJs, Title, Tooltip, Legend, ArcElement } from "chart.js";
import backendInstance from "../Axios/axios";
import { Doughnut } from "react-chartjs-2";
import { Box, Typography } from "@mui/material";

const DoughnutComponent = () => {
  const User = useMemo(
    () => JSON.parse(sessionStorage.getItem("user")) || {},
    []
  );
  const navigate = useNavigate();

  const [webData, setWebData] = useState([]);
  const [capData, setCapData] = useState([]);

  const getData = useCallback(async () => {
    const types = {
      type: "webcode",
    };
    const types1 = {
      type: "capstone",
    };
    const resTask = await backendInstance.post(
      `/webcapsubmit/${User.email}`,
      types
    );
    setWebData(resTask.data);

    const resTask1 = await backendInstance.post(
      `/webcapsubmit/${User.email}`,
      types1
    );
    setCapData(resTask1.data);

    // setResult({ ...data });
  }, [setCapData, setWebData, User.email]);

  ChartJs.register(Title, Tooltip, Legend, ArcElement);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Webcode Capstone",
      },
    },
  };

  const setMarks = {
    rev1: webData.map((cal) => cal.marks),
    rev2: capData.map((cal) => cal.marks),
  };

  let totalMarks = [...setMarks.rev1, ...setMarks.rev2];

  const data = {
    labels: "",
    datasets: [
      {
        label: `Webcode Mark`,
        data: [...setMarks.rev1],
        backgroundColor: ["rgba(255, 99, 132, 0.5)"],
        borderColor: ["rgba(255, 99, 132, 1)"],
      },
      {
        label: `Capstone Mark`,
        data: [...setMarks.rev2],
        backgroundColor: ["rgba(255, 206, 86, 0.2)"],
        borderColor: ["rgba(255, 206, 86, 1)"],
      },
    ],
  };

  console.log(setMarks.rev1);

  useEffect(() => {
    if (Object.keys(User).length === 0) {
      navigate("/login");
    } else {
      if (User.role === "student") {
        getData();
        // setMarks();
      }
    }
  }, [User, navigate, getData]);

  return (
    <div>
      <Box width={400} height={400}>
        <p>
          <span>Average Score : </span>
          {(
            totalMarks?.reduce((prev, curr) => Number(prev) + Number(curr), 0) /
            totalMarks?.length
          ).toFixed(2)}
        </p>
        <Doughnut options={options} data={data} />
      </Box>
    </div>
  );
};

export default DoughnutComponent;
