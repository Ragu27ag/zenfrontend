import { Box, Button, IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import EditForm from "../Components/EditForm.jsx";
import SnackBarComp from "../Components/SnackBarComp.jsx";
import backendInstance from "../Axios/axios.js";

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

  const [classes, setClasses] = useState("1");

  const [arr, setArr] = useState([]);

  const [addArr, setAddArr] = useState([]);

  const [addOpen, setAddOpen] = useState(false);

  const [currAdd, setCurrAdd] = useState("");

  const [tasks, setTasks] = useState([]);

  const [currTask, setCurrTask] = useState(null);

  // const [type, setType] = React.useState("");

  const [dataMsg, setDataMsg] = React.useState("");

  const [open, setOpen] = React.useState(false);

  // const [editData, setEditData] = useState({});

  // const [editAddData, setEditAddData] = useState({});

  const [openSnack, setOpenSnack] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getClass = useCallback(async () => {
    const res = await backendInstance.get("/classes");
    setArr(res.data);
  }, [setArr]);

  const getAddtionalClass = useCallback(async () => {
    const res = await backendInstance.get("/additionalClass");
    setAddArr(res.data);
  }, [setAddArr]);

  const tasksData = useCallback(async () => {
    const { data } = await backendInstance.get(`/tasks/${User.email}`);
    setTasks(data);
  }, [User.email, setTasks]);

  useEffect(() => {
    if (Object.keys(User).length === 0) {
      navigate("/login");
    } else {
      if (User.role === "student") {
        tasksData();
      }
      getClass();
      getAddtionalClass();
    }
  }, [getClass, navigate, User, tasksData, getAddtionalClass]);

  console.log(tasks);
  console.log(arr);

  const handleClass = (no) => {
    setAddOpen(false);
    console.log(no);
    setClasses(no);
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].day === no) {
        console.log(Number(tasks[i].day));
        setCurrTask(tasks[i].url);
        break;
      } else {
        setCurrTask(null);
      }
    }
  };
  console.log(currTask);

  const handleSubmit = async (e) => {
    document.getElementById("submitbutt").disabled = true;
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
    let taskMonth = submitted.getMonth() + 1;
    let taskYear = submitted.getFullYear();
    console.log(task);
    const obj = {
      dayTask: task[0].title,
      day: task[0].day,
      email: User.email,
      url: taskData,
      submitted: `${taskDate}/${taskMonth}/${taskYear}`,
      evaluated: false,
      name: User.name,
    };
    console.log(obj);
    const res = await backendInstance.post("/task", obj);
    if (res.data.msg === "Inserted Successfully") {
      handleClick("Submitted Successfully ");
      document.getElementById("submitform").reset();
    } else {
      document.getElementById("submitbutt").disabled = false;
    }
    document.getElementById("submitbutt").disabled = false;
  };

  const handleAdditional = (data) => {
    setAddOpen(true);
    setCurrAdd(data.title);
  };

  const handleDelete = async (data) => {
    document.getElementById("deletebutt").disabled = true;

    console.log(data);
    const res = await backendInstance.post("/deleteClass", data);
    if (res.data.msg === "Deleted Successfully") {
      handleClick("Deleted Succesfully");
    }
    document.getElementById("deletebutt").disabled = false;
  };

  // const handleEdit = async (data) => {
  //   setType("edit");
  //   setEditData({ ...data });
  //   handleClickOpen();
  // };

  // const handleAddtionalEdit = async (data) => {
  //   setEditAddData({ ...data });
  //   handleClickOpen();
  // };

  const handleClick = (msg) => {
    console.log("opened");
    setDataMsg(msg);
    setCurrTask(document.getElementById("task").value);
    getClass();
    getAddtionalClass();
    tasksData();
    setOpenSnack(true);
  };

  return (
    <div
      className="main-div"
      style={{
        display: "flex",
        flexFlowflow: "wrap",
        gap: "24px",
        marginTop: "20px",
      }}
    >
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
            border: "1px solid grey",
            marginTop: "5px",
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          }}
        >
          {!addOpen && arr.filter((val) => val.day === classes).length === 0 ? (
            <p style={{ margin: "5px", color: "#555A8F" }}>
              Classes not yet assigned
            </p>
          ) : (
            !addOpen &&
            arr
              .filter((val) => val.day === classes)
              .map((data) =>
                data.day === "" ? (
                  <p>"Classes not assigned"</p>
                ) : (
                  <div style={{ margin: "2px" }}>
                    <Typography sx={{ color: "head.main" }} variant="h5">
                      Day - {data.day}&nbsp;
                      {data.title}
                    </Typography>
                    <p style={{ color: "#7E8E9F" }}>
                      ON : {data.date} From : {data.time}
                    </p>
                    <p style={{ color: "#7E8E9F" }}>Contents</p>
                    {data.contents.split("\n").map((con) => (
                      <div style={{ paddingLeft: "12px" }}>
                        <li style={{ color: "#7E8E9F" }}>{con}</li>
                      </div>
                    ))}
                    <p style={{ color: "#7E8E9F" }}>Pre-read</p>
                    {data.preread.split("\n").map((con) => (
                      <div style={{ paddingLeft: "12px" }}>
                        <li style={{ color: "#7E8E9F" }}>{con}</li>
                      </div>
                    ))}
                    {User.role === "student" && (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "space-between",
                          marginTop: "5px",
                        }}
                      >
                        {" "}
                        <div
                          style={{
                            margin: "10px",
                          }}
                        >
                          {data.activities !== "" ? (
                            <>
                              <Typography
                                sx={{ color: "head.main" }}
                                variant="h6"
                              >
                                Activities
                              </Typography>
                              <p style={{ color: "#7E8E9F" }}>
                                {data.activities}
                              </p>
                              <form id="submitform" onSubmit={handleSubmit}>
                                <input
                                  name="task"
                                  id="task"
                                  type="url"
                                  style={{ width: "90%", margin: "5px" }}
                                  defaultValue={
                                    currTask !== null ? currTask : ""
                                  }
                                  required
                                />
                                <br />
                                <br />

                                {currTask === null ? (
                                  <div style={{ textAlign: "end" }}>
                                    <Button
                                      type="submit"
                                      variant="contanied"
                                      sx={{
                                        backgroundColor: "secondary.main",
                                        color: "white",
                                        margin: "5px",
                                        "&.MuiButtonBase-root:hover": {
                                          backgroundColor: "secondary.main",
                                        },
                                      }}
                                      id="submitbutt"
                                    >
                                      Submit
                                    </Button>
                                  </div>
                                ) : (
                                  <span style={{ backgroundColor: "#FF9A28" }}>
                                    Submitted
                                  </span>
                                )}
                              </form>
                            </>
                          ) : (
                            <div>No Activities</div>
                          )}
                        </div>
                      </Box>
                    )}
                    {User.role === "admin" && (
                      <>
                        {" "}
                        <div style={{ marginTop: "15px" }}>
                          {/* <Button
                          size="small"
                          variant="contained"
                          sx={{ backgroundColor: "buttcolor.main" }}
                          onClick={() => handleEdit(data)}
                        >
                          edit
                        </Button>{" "} */}
                          &nbsp;&nbsp;
                          <Button
                            size="small"
                            variant="contained"
                            sx={{
                              backgroundColor: "buttcolor.main",
                              marginBottom: "5px",
                            }}
                            id="deletebutt"
                            onClick={() => handleDelete(data)}
                          >
                            delete
                          </Button>{" "}
                        </div>
                      </>
                    )}
                  </div>
                )
              )
          )}
          {addOpen &&
          addArr.filter((add) => add.title === currAdd).length === 0 ? (
            <p style={{ margin: "5px", color: "#555A8F" }}>
              Classes not yet assigned
            </p>
          ) : (
            addOpen &&
            addArr
              .filter((add) => add.title === currAdd)
              .map((data) => (
                <div style={{ margin: "2px" }}>
                  <Typography variant="h5">
                    Day - {data.day}&nbsp;
                    {data.title}
                  </Typography>
                  <p style={{ color: "#7E8E9F" }}>
                    {data.date} {data.time}
                  </p>
                  {User.role === "admin" && (
                    <>
                      {" "}
                      <div style={{ marginTop: "15px" }}>
                        {/* <Button
                          size="small"
                          variant="contained"
                          sx={{ backgroundColor: "buttcolor.main" }}
                          onClick={() => handleAddtionalEdit(data)}
                        >
                          edit
                        </Button> */}
                        &nbsp;&nbsp;
                        <Button
                          size="small"
                          variant="contained"
                          sx={{
                            backgroundColor: "buttcolor.main",
                            marginBottom: "5px",
                          }}
                          onClick={() => handleDelete(data)}
                          id="deleteAddiButt"
                        >
                          delete
                        </Button>
                      </div>{" "}
                    </>
                  )}
                </div>
              ))
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",

            borderRadius: "8px",

            marginTop: "5px",
          }}
        >
          {User.role === "admin" && (
            <>
              <Button
                variant="contanied"
                sx={{
                  backgroundColor: "buttcolor.main",
                  color: "black",
                  margin: "5px",
                  "&.MuiButtonBase-root:hover": {
                    backgroundColor: "buttcolor.main",
                  },
                }}
                onClick={handleClickOpen}
                disableRipple
              >
                Add
              </Button>
            </>
          )}
        </Box>
      </Box>
      <Box>
        <Box
          sx={{
            border: "1px solid grey",
            height: "450px",
            width: "310px",
            borderRadius: "8px",
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          }}
        >
          <div>
            <Typography sx={{ color: "head.main" }} variant="h6">
              Sessions Roadmap
            </Typography>
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
                      disableRipple
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
                      val === "40" ? (
                        <hr
                          style={{
                            width: "30px",
                            height: "5px",
                            backgroundColor: "#7E8E9F",
                            marginTop: "12px",
                          }}
                        />
                      ) : val % 5 === 0 && val % 2 === 0 && val !== 40 ? (
                        <>
                          {" "}
                          <hr
                            style={{
                              width: "30px",
                              height: "5px",
                              backgroundColor: "#7E8E9F",
                              marginTop: "12px",
                            }}
                          />{" "}
                          <div
                            style={{
                              borderLeft: "thick solid #7E8E9F",
                              height: "20px",
                              position: "absolute",
                              left: "10px",
                              top: "29px",
                            }}
                          ></div>
                        </>
                      ) : val % 5 === 0 && val % 2 !== 0 && val !== "40" ? (
                        <div
                          style={{
                            borderLeft: "thick solid #7E8E9F",
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
            border: "1px solid grey",
            width: "300px",
            marginTop: "10px",
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
            borderRadius: "8px",
          }}
        >
          <Typography sx={{ color: "head.main" }} variant="h6">
            Additional sessions
          </Typography>
          {addArr.map((data) => (
            <div
              style={{ margin: "2px" }}
              onClick={() => handleAdditional(data)}
            >
              <Typography variant="h5">
                Day - {data.day}&nbsp;
                {data.title}
              </Typography>
              <p style={{ color: "#7E8E9F" }}>
                on {data.date} from {data.time}
              </p>
            </div>
          ))}
          <div>
            {" "}
            <SnackBarComp
              openSnack={openSnack}
              setOpenSnack={setOpenSnack}
              dataMsg={dataMsg}
            />
            <EditForm
              arr={arr}
              open={open}
              handleClose={handleClose}
              getAddtionalClass={getAddtionalClass}
              getClass={getClass}
            />
          </div>
        </Box>
      </Box>
    </div>
  );
};

export default ZClasses;
