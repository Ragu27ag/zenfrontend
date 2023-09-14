import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import backendInstance from "../Axios/axios";
import { Button, Typography } from "@mui/material";
import SnackBarComp from "../Components/SnackBarComp";

const Portfolio = () => {
  const User = useMemo(
    () => JSON.parse(sessionStorage.getItem("user")) || {},
    []
  );
  const navigate = useNavigate();

  const [data, setdata] = useState([]);
  const [result, setResult] = useState([]);

  const [openSnack, setOpenSnack] = React.useState(false);

  const [dataMsg, setDataMsg] = React.useState("");

  const handleClick = () => {
    console.log("opened");
    setDataMsg("Submitted Successfully");
    setOpenSnack(true);
    getData();
    getAdminData();
  };

  const getData = useCallback(async () => {
    try {
      const res = await backendInstance.get(`/portfolio/${User.email}`);
      setdata(res.data);
      // setResult({ ...data });
    } catch (error) {
      console.log(error);
    }
  }, [setdata, User.email]);

  const getAdminData = useCallback(async () => {
    try {
      const resultData = await backendInstance.get(`/portfolio`);
      console.log(resultData.data);
      setResult(resultData.data);
    } catch (error) {
      console.log(error);
    }
  }, [setResult]);

  useEffect(() => {
    if (Object.keys(User).length === 0) {
      navigate("/login");
    } else {
      if (User.role === "student") {
        getData();
      } else {
        getAdminData();
      }
    }
  }, [User, navigate, getData, getAdminData]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      console.log(e);
      document.getElementById("submitbutt").disabled = true;
      let obj = {};
      Array.from(e.target.elements).forEach((ele) => {
        if (ele.nodeName === "INPUT") {
          obj[ele.name] = ele.value;
        }
      });
      obj = {
        ...obj,
        name: User.name,
        email: User.email,
        evaluated: false,
        reviewedby: "",
        comments: "",
      };

      const res = await backendInstance.post("/portfolio", obj);

      if (res.data.msg === "Inserted Successfully") {
        handleClick();
        document.getElementById("submitform").reset();
      } else {
        document.getElementById("submitbutt").disabled = false;
      }
      document.getElementById("submitbutt").disabled = false;
    } catch (error) {
      console.log(error);
    }
  };

  const handleMark = async (e, val) => {
    try {
      document.getElementById("markbutt").disabled = true;
      console.log(val);
      e.preventDefault();
      let marks = {};
      Array.from(e.target.elements).forEach((ele) => {
        if (ele.nodeName === "INPUT" || ele.nodeName === "TEXTAREA") {
          marks[ele.name] = ele.value;
        }
      });

      marks = {
        ...marks,
        email: val.email,
        evaluated: true,
        reviewedby: User.name,
      };

      const res = await backendInstance.put("/portfolio", marks);
      if (res) {
        document.getElementById("markform").reset();
        handleClick();
      } else {
        document.getElementById("markbutt").disabled = false;
      }
      document.getElementById("markbutt").disabled = false;
    } catch (error) {
      console.log(error);
    }
  };

  console.log(result);
  return (
    <div
    // style={{
    //   display: "flex",
    //   justifyContent: "center",
    //   flexWrap: "wrap",
    //   alignItems: "center",
    // }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          border: "1px solid grey",
          borderRadius: "8px",
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
        }}
      >
        {User.role === "student" ? (
          <>
            <div style={{ marginTop: "15px" }}>
              {" "}
              <Typography variant="h6" sx={{ color: "head.main" }} gutterBottom>
                Submit your code
              </Typography>
              <form id="submitform" onSubmit={handleSubmit}>
                <label style={{ color: "#7E8E9F" }} htmlFor="github">
                  Github URL :{" "}
                </label>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  id="github"
                  name="github"
                  type="url"
                  defaultValue={data[0]?.github}
                  required
                />
                <br />
                <br />
                <label style={{ color: "#7E8E9F" }} htmlFor="port">
                  Portfolio URL :
                </label>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  id="port"
                  name="port"
                  type="url"
                  required
                  defaultValue={data[0]?.port}
                />
                <br />
                <br />
                <label style={{ color: "#7E8E9F" }} htmlFor="resume">
                  Resume URL :
                </label>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  id="resume"
                  name="resume"
                  type="url"
                  required
                  defaultValue={data[0]?.resume}
                />
                <br />
                <br />
                {data.length === 0 ? (
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "buttcolor.main",
                      marginBottom: "15px",
                    }}
                    type="submit"
                    id="submitbutt"
                  >
                    SUBMIT
                  </Button>
                ) : (
                  <div></div>
                )}
              </form>
            </div>
            <div style={{}}>
              <Typography variant="h6" sx={{ color: "head.main" }}>
                Portfolio Review
              </Typography>
              {data.map((val, i) => (
                <div key={i}>
                  <div>
                    <p style={{ color: "#555A8F" }}>
                      <span style={{ color: "#7E8E9F" }}>Status : </span>
                      {val.evaluated === true ? "Reviewed" : "Under Review"}
                    </p>
                    <p style={{ color: "#555A8F" }}>
                      <span style={{ color: "#7E8E9F" }}>Batch:</span>
                      {User.batch || "-"}
                    </p>
                  </div>
                  <div>
                    {" "}
                    <p
                      style={{
                        overflowWrap: "break-word",
                        width: "300px",
                        color: "#7E8E9F",
                      }}
                    >
                      Comment :
                      <span
                        style={{ overflowWrap: "break-word", color: "#555A8F" }}
                      >
                        {" "}
                        {val.comments}
                      </span>
                    </p>
                    <p style={{ color: "#555A8F" }}>
                      <span style={{ color: "#7E8E9F" }}>Reviwed By : </span>
                      {val.reviewedby}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div>
            {result.filter((res) => res.evaluated === false).length === 0 ? (
              <p style={{ margin: "5px", color: "#555A8F" }}>
                No portfolio submietted for review
              </p>
            ) : (
              result
                .filter((res) => res.evaluated === false)
                .map((val) => {
                  return (
                    <div style={{ margin: "15px" }}>
                      <div>
                        <Typography variant="h5" sx={{ color: "head.main" }}>
                          {val.name} - ({val.email})
                        </Typography>
                        <p>{val.batch}</p>
                      </div>
                      <div>
                        <p style={{ color: "#555A8F" }}>
                          <span style={{ color: "#7E8E9F" }}>
                            Github URL :{" "}
                          </span>
                          {val.github}
                        </p>
                        <p style={{ color: "#555A8F" }}>
                          <span style={{ color: "#7E8E9F" }}>Portfolio : </span>
                          {val.port}
                        </p>
                        <p style={{ color: "#555A8F" }}>
                          <span style={{ color: "#7E8E9F" }}>
                            Resume URL :{" "}
                          </span>
                          {val.resume}
                        </p>
                      </div>
                      <div>
                        <form
                          id="markform"
                          onSubmit={(e) => handleMark(e, val)}
                        >
                          <label
                            style={{ color: "#7E8E9F" }}
                            htmlFor="comments"
                          >
                            Comments :{" "}
                          </label>
                          <br />
                          <textarea
                            rows={10}
                            cols={30}
                            id="comments"
                            name="comments"
                          ></textarea>
                          <br />
                          <br />
                          <Button
                            sx={{
                              backgroundColor: "buttcolor.main",
                              marginBottom: "15px",
                            }}
                            type="submit"
                            variant="contained"
                            id="markbutt"
                          >
                            Submit
                          </Button>
                        </form>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        )}
        <SnackBarComp
          openSnack={openSnack}
          setOpenSnack={setOpenSnack}
          dataMsg={dataMsg}
        />
      </div>
    </div>
  );
};

export default Portfolio;
