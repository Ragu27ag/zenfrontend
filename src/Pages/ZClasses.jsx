import { Box, Button, IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import backendInstance from "../Axios/axios.js";

import "../CSS/ZClaases.css";
import { useNavigate } from "react-router-dom";

const ZClasses = () => {
  const classList = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "10",
    "9",
    "8",
    "7",
    "6",
    "11",
    "12",
    "13",
    "14",
    "15",
    "20",
    "19",
    "18",
    "17",
    "16",
    "21",
    "22",
    "23",
    "24",
    "25",
    "30",
    "29",
    "28",
    "27",
    "26",
    "31",
    "32",
    "33",
    "34",
    "35",
    "40",
    "39",
    "38",
    "37",
    "36",
  ];

  const User = useMemo(
    () => JSON.parse(sessionStorage.getItem("user")) || {},
    []
  );

  const navigate = useNavigate();

  const [classes, setClasses] = useState(1);

  const [arr, setArr] = useState([]);

  const getClass = useCallback(async () => {
    const res = await backendInstance.get("/classes");
    setArr(res.data);
  }, []);

  useEffect(() => {
    if (Object.keys(User).length === 0) {
      navigate("/login");
    } else {
      getClass();
    }
  }, [getClass, navigate, User]);

  console.log(classes);
  console.log(arr);

  const handleClass = (no) => {
    setClasses(no);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e);
    let taskData = "";
    Array.from(e.target.elements).forEach((ele) => {
      if (ele.nodeName === "INPUT") {
        console.log(ele.value);
        taskData = ele.value;
      }
    });
    let task = arr.filter((cla) => cla.day === classes);
    let submitted = new Date();
    let taskDate = submitted.getDate();
    let taskMonth = submitted.getMonth();
    let taskYear = submitted.getFullYear();
    console.log(task);
    const obj = {
      dayTask: task[0].title,
      day: task[0].day,
      email: User.email,
      url: taskData,
      submitted: `${taskDate}/${taskMonth}/${taskYear}`,
    };
    console.log(obj);
    const res = await backendInstance.post("/task", obj);
  };

  return (
    <div className="main-div">
      <Box
        sx={{
          flex: "1 1",
          overflow: "auto",
          minWidth: "380px",
          alignSelf: "stretch",
          flexGrow: "1",
        }}
      >
        <Box
          sx={{
            backgroundColor: "secondary.main",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            color: "white",
            borderRadius: "8px",
          }}
        >
          <Typography m={1} variant="h6">
            Please watch the recording.
          </Typography>
          <Button
            sx={{
              backgroundColor: "buttcolor.main",
              marginTop: "10px",
              marginRight: "10px",
              height: "30px",
              fontSize: "15px",
              color: "white",
            }}
            variant="contained"
          >
            Play Recording
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            borderRadius: "8px",
            border: "2px solid",
            marginTop: "5px",
          }}
        >
          {arr
            .filter((val) => val.day == classes)
            .map((data) => (
              <div style={{ margin: "2px" }}>
                <Typography variant="h5">
                  Day - {data.day}&nbsp;
                  {data.title}
                </Typography>
                <p>
                  {data.date} {data.time}
                </p>
                <p>Contents</p>
                {data.contents.map((con) => (
                  <div style={{ paddingLeft: "12px" }}>
                    <li>{con}</li>
                  </div>
                ))}
              </div>
            ))}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            height: "200px",
            borderRadius: "8px",
            border: "2px solid",
            marginTop: "5px",
          }}
        >
          <div style={{ margin: "10px", width: "100%", border: "2px solid" }}>
            <Typography variant="h6">Activities</Typography>
            <form onSubmit={handleSubmit}>
              <input
                name="task"
                id="task"
                type="url"
                style={{ width: "50%", margin: "5px" }}
              />
              <br />
              <br />
              <div style={{ textAlign: "end" }}>
                <Button
                  type="submit"
                  sx={{ backgroundColor: "secondary.main", margin: "5px" }}
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </Box>
      </Box>
      <Box>
        <Box
          sx={{
            border: "2px solid",
            height: "450px",
            width: "310px",
            borderRadius: "8px",
          }}
        >
          <div>
            <Typography variant="h6">Sessions Roadmap</Typography>
          </div>
          <Box
            sx={{
              flexGrow: "1",
              textAlign: "center",
              paddingTop: "30px",
              paddingLeft: "8px",
            }}
          >
            <Grid container rowSpacing={2} columnSpacing={{ xs: 8 }}>
              {classList.map((val, i) => (
                <Grid item xs={2} key={i}>
                  <div style={{ display: "flex", position: "relative" }}>
                    <IconButton
                      sx={{
                        backgroundColor: "secondary.main",
                        color: "white",
                        width: "33px",
                      }}
                      size="small"
                      variant="contained"
                      disableRipple="true"
                      onClick={() => handleClass(val)}
                    >
                      {val}
                    </IconButton>
                    <div style={{}}>
                      {(val % 5 !== 0 &&
                        val !== "6" &&
                        val !== "16" &&
                        val !== "26" &&
                        val !== "36") ||
                      val == 40 ? (
                        <hr
                          style={{
                            width: "30px",
                            height: "5px",
                            backgroundColor: "grey",
                            marginTop: "12px",
                          }}
                        />
                      ) : val % 5 === 0 && val % 2 === 0 && val != 40 ? (
                        <>
                          {" "}
                          <hr
                            style={{
                              width: "30px",
                              height: "5px",
                              backgroundColor: "grey",
                              marginTop: "12px",
                            }}
                          />{" "}
                          <div
                            style={{
                              borderLeft: "thick solid grey",
                              height: "20px",
                              position: "absolute",
                              left: "10px",
                              top: "29px",
                            }}
                          ></div>
                        </>
                      ) : val % 5 === 0 && val % 2 !== 0 && val != 40 ? (
                        <div
                          style={{
                            borderLeft: "thick solid grey",
                            height: "20px",
                            position: "absolute",
                            left: "10px",
                            top: "29px",
                          }}
                        ></div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                  {/* {val % 5 === 0 && (
                    <div
                      style={{
                        borderLeft: "thick solid black",
                        height: "10px",
                        position: "absolute",
                        left: "10px",
                      }}
                    ></div>
                  )} */}
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
        <Box
          sx={{
            border: "2px solid",
            height: "400px",
            width: "300px",
            marginTop: "10px",
          }}
        >
          <div></div>
          <div></div>
        </Box>
      </Box>
    </div>
  );
};

export default ZClasses;
