import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Typography } from "@mui/material";
import { useFormik } from "formik";
import ErrorIcon from "@mui/icons-material/Error";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

import backendInstance from "../Axios/axios";
import ApplicationList from "../Components/ApplicationList";
import SnackBarComp from "../Components/SnackBarComp";

const Requirements = () => {
  const User = useMemo(
    () => JSON.parse(sessionStorage.getItem("user")) || {},
    []
  );
  const navigate = useNavigate();

  const [data, setdata] = useState([]);
  const [result, setResult] = useState([]);
  const [open, setOpen] = useState(false);
  const [applied, setApplied] = useState([]);

  const [openSnack, setOpenSnack] = React.useState(false);

  const [dataMsg, setDataMsg] = React.useState("");

  const handleClick = (msg) => {
    //"Applied Successfully"
    console.log("opened");
    setDataMsg(msg);
    setOpenSnack(true);
    getData();
    getAdminData();
  };

  const getData = useCallback(async () => {
    const res = await backendInstance.get("/requirements");
    const resData = await backendInstance.get(`/applicationlist/${User.email}`);
    setApplied(resData.data);
    setdata(res.data);
  }, [setdata, setApplied, User.email]);

  const getAdminData = useCallback(async () => {
    const resultData = await backendInstance.get(`/applicationlist`);
    setResult(resultData.data);
  }, [setResult]);

  const validation = yup.object().shape({
    company: yup.string().required("Enter email"),
    role: yup.string().required("Enter the role"),
    nature: yup.string().required("Enter the nature"),
    deadline: yup.string().required("Enter the deadline"),
    ctc: yup.string().required("Enter the ctc"),
    openings: yup.string().required("Enter the openings"),
    program: yup.string().required("Enter the program"),
  });

  const formData = useFormik({
    initialValues: {
      company: "",
      role: "",
      nature: "",
      deadline: "",
      ctc: "",
      openings: "",
      program: "",
    },
    onSubmit: async (data) => {
      document.getElementById("submitbutt").disabled = true;
      console.log(data);
      const res = await backendInstance.post("/requirements", data);
      console.log(res.data);

      if (res.data.msg === "Inserted Successfully") {
        document.getElementById("submitform").reset();
        handleClick("Added Successfully");
      } else {
        document.getElementById("submitbutt").disabled = false;
      }
      document.getElementById("submitbutt").disabled = false;
    },
    validationSchema: validation,
  });

  const handleApply = async (val, apply) => {
    document.getElementById("applybutt").disabled = true;
    const dataObj = {
      ...val,
      name: User.name,
      email: User.email,
      isApplied: apply,
    };
    console.log(1);
    const res = await backendInstance.post(
      `/requirements/:${User.email}`,
      dataObj
    );
    console.log(2);
    const res2 = await backendInstance.put(`/requirements`, dataObj);

    if (res.data.msg === "Inserted Successfully" && res2.data) {
      handleClick("Applied Successfully");
    }

    console.log(res, res2);
  };

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

  return (
    <div className="first-div">
      {User.role === "student" ? (
        <div>
          {data.map((val) => (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-around",
                border: "1px solid grey",
                marginTop: "10px",
                boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
              }}
              className="first-div-1"
            >
              <div>
                <Typography
                  sx={{ color: "head.main", marginTop: "10px" }}
                  variant="h5"
                >
                  {val.company}
                </Typography>
                <div style={{ marginTop: "70px" }}>
                  {" "}
                  {val.appliedBy.every((arr) => arr !== User.email) ? (
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "buttcolor.main" }}
                      type="submit"
                      id="applybutt"
                      onClick={() => handleApply(val, "Applied")}
                    >
                      apply{" "}
                    </Button>
                  ) : (
                    <p
                      style={{
                        color: "#7E8E9F",
                        backgroundColor: "#FF9A28",
                        textAlign: "center",
                      }}
                    >
                      Applied
                    </p>
                  )}
                </div>
              </div>
              <div style={{ color: "#7E8E9F" }}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-around",
                    width: "300px",
                  }}
                >
                  <div>
                    <p>
                      <span>Role:</span> <br />
                      {val.role}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span>Nature of job:</span> <br />
                      {val.nature}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span>Deadline:</span>
                      <br />
                      {val.deadline}
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-around",
                    width: "300px",
                  }}
                >
                  <div>
                    <p>
                      <span>CTC:</span>
                      <br />
                      {val.ctc}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span>Openings:</span>
                      <br />
                      {val.openings}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span>Program:</span>
                      <br />
                      {val.program}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <Button
            variant="contained"
            sx={{ backgroundColor: "buttcolor.main", height: "50px" }}
            type="submit"
            onClick={() => setOpen(!open)}
            size="small"
          >
            application list
          </Button>{" "}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                border: "1px solid grey ",
                boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                width: "400px",
                textAlign: "center",
                color: "#555A8F",
              }}
            >
              {" "}
              <form id="submitform" onSubmit={formData.handleSubmit}>
                <label htmlFor="company">Company</label>
                <br />
                <input
                  name="company"
                  id="company"
                  onChange={formData.handleChange}
                  onBlur={formData.handleBlur}
                  value={formData.company}
                />
                {formData.touched.company && formData.errors.company && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "15px",
                      marginTop: "15px",
                    }}
                  >
                    <span>
                      <ErrorIcon
                        sx={{ fontSize: "15px", textAlign: "center" }}
                      />
                      &nbsp;
                      {formData.errors.company}
                    </span>{" "}
                  </div>
                )}
                <br />
                <label htmlFor="role">Role</label>
                <br />
                <input
                  name="role"
                  id="role"
                  onChange={formData.handleChange}
                  onBlur={formData.handleBlur}
                  value={formData.role}
                />
                {formData.touched.role && formData.errors.role && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "15px",
                      marginTop: "15px",
                    }}
                  >
                    <span>
                      <ErrorIcon
                        sx={{ fontSize: "15px", textAlign: "center" }}
                      />
                      &nbsp;
                      {formData.errors.role}
                    </span>{" "}
                  </div>
                )}
                <br />
                <label htmlFor="nature">Nature of job</label>
                <br />
                <input
                  name="nature"
                  id="nature"
                  onChange={formData.handleChange}
                  onBlur={formData.handleBlur}
                  value={formData.nature}
                />
                {formData.touched.nature && formData.errors.nature && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "15px",
                      marginTop: "15px",
                    }}
                  >
                    <span>
                      <ErrorIcon
                        sx={{ fontSize: "15px", textAlign: "center" }}
                      />
                      &nbsp;
                      {formData.errors.nature}
                    </span>{" "}
                  </div>
                )}
                <br />
                <br /> <label htmlFor="deadline">DeadLine</label>
                <br />
                <input
                  type="date"
                  name="deadline"
                  id="deadline"
                  onChange={formData.handleChange}
                  onBlur={formData.handleBlur}
                  value={formData.deadline}
                />
                {formData.touched.deadline && formData.errors.deadline && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "15px",
                      marginTop: "15px",
                    }}
                  >
                    <span>
                      <ErrorIcon
                        sx={{ fontSize: "15px", textAlign: "center" }}
                      />
                      &nbsp;
                      {formData.errors.deadline}
                    </span>{" "}
                  </div>
                )}
                <br />
                <br /> <label htmlFor="ctc">CTC</label>
                <br />
                <input
                  name="ctc"
                  id="ctc"
                  onChange={formData.handleChange}
                  onBlur={formData.handleBlur}
                  value={formData.ctc}
                />
                {formData.touched.ctc && formData.errors.ctc && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "15px",
                      marginTop: "15px",
                    }}
                  >
                    <span>
                      <ErrorIcon
                        sx={{ fontSize: "15px", textAlign: "center" }}
                      />
                      &nbsp;
                      {formData.errors.ctc}
                    </span>{" "}
                  </div>
                )}
                <br />
                <br /> <label htmlFor="openings">Openings</label>
                <br />
                <input
                  name="openings"
                  id="openings"
                  onChange={formData.handleChange}
                  onBlur={formData.handleBlur}
                  value={formData.openings}
                />
                {formData.touched.openings && formData.errors.openings && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "15px",
                      marginTop: "15px",
                    }}
                  >
                    <span>
                      <ErrorIcon
                        sx={{ fontSize: "15px", textAlign: "center" }}
                      />
                      &nbsp;
                      {formData.errors.openings}
                    </span>{" "}
                  </div>
                )}
                <br />
                <br /> <label htmlFor="program">Program</label>
                <br />
                <input
                  name="program"
                  id="program"
                  onChange={formData.handleChange}
                  onBlur={formData.handleBlur}
                  value={formData.program}
                />
                {formData.touched.program && formData.errors.program && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "15px",
                      marginTop: "15px",
                    }}
                  >
                    <span>
                      <ErrorIcon
                        sx={{ fontSize: "15px", textAlign: "center" }}
                      />
                      &nbsp;
                      {formData.errors.program}
                    </span>{" "}
                  </div>
                )}
                <br />
                <br />
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "buttcolor.main",
                    marginBottom: "10px",
                  }}
                  type="submit"
                  id="submitbutt"
                >
                  Add{" "}
                </Button>
                &nbsp;&nbsp;&nbsp;
              </form>
            </div>
          </div>
          {open && (
            <div>
              <ApplicationList result={result} setOpen={setOpen} />
            </div>
          )}
        </>
      )}
      <SnackBarComp
        openSnack={openSnack}
        setOpenSnack={setOpenSnack}
        dataMsg={dataMsg}
      />
    </div>
  );
};

export default Requirements;
