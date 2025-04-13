import { Button } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import * as yup from "yup";
import ErrorIcon from "@mui/icons-material/Error";
import backendInstance from "../Axios/axios";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

import logo from "./zenimage.png";

const Register = () => {
  const [load, setLoad] = useState(false);

  const navigate = useNavigate();
  const validation = yup.object().shape({
    user_name: yup.string().required("Enter the username"),
    email: yup.string().email().required("Enter email"),
    password: yup.string().required("Enter the password"),
    confirmpassword: yup.string().required("Enter the mobile number"),
    mobile_number: yup
      .string()
      .required("Enter the password")
      .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  });
  const formData = useFormik({
    initialValues: {
      user_name: "",
      email: "",
      password: "",
      mobile_number: "",
    },
    onSubmit: async (data) => {
      try {
        setLoad(true);
        document.getElementById("registerbutt").disabled = true;
        console.log(data);
        if (data.confirmpassword !== data.password) {
          alert("Password doesnt match");
          setLoad(false);
          document.getElementById("registerbutt").disabled = false;
        } else {
          delete data.confirmpassword;
          const obj = {
            ...data,
          };
          const res = await backendInstance.post("/api/v1/addusers", obj);
          console.log("res", res);
          if (res.data.message === "Inserted Successfully") {
            document.getElementById("registerform").reset();
            navigate("/login");
          }
          console.log(res);
        }
      } catch (error) {
        console.log(error);
        if (error.response.data.message === "Email already exists") {
          setLoad(false);
          alert("Email already exists");
          // document.getElementById("registerform").reset();
          document.getElementById("registerbutt").disabled = false;
        }
      }
    },
    validationSchema: validation,
  });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", top: "0", left: "5px" }}>
        <img src={logo} height={100} width={100} alt="logo" />
      </div>

      <div
        style={{
          marginTop: "150px",
          border: "1px solid grey",
          borderRadius: "8px",
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          width: "300px",
        }}
      >
        <form id="registerform" onSubmit={formData.handleSubmit}>
          <label
            style={{ margin: "5px", color: "#555A8F" }}
            htmlFor="USer_name"
          >
            User Name
          </label>
          <br />
          <input
            name="user_name"
            id="user_name"
            onChange={formData.handleChange}
            onBlur={formData.handleBlur}
            value={formData.email}
            style={{ margin: "5px", color: "#555A8F" }}
          />
          {formData.touched.user_name && formData.errors.user_name && (
            <div
              style={{
                color: "red",
                fontSize: "15px",
                marginTop: "15px",
              }}
            >
              <span>
                <ErrorIcon sx={{ fontSize: "15px", textAlign: "center" }} />
                &nbsp;
                {formData.errors.user_name}
              </span>{" "}
            </div>
          )}
          <br />
          <label style={{ margin: "5px", color: "#555A8F" }} htmlFor="email">
            Email
          </label>
          <br />
          <input
            type="email"
            name="email"
            id="email"
            onChange={formData.handleChange}
            onBlur={formData.handleBlur}
            value={formData.email}
            style={{ margin: "5px", color: "#555A8F" }}
          />
          {formData.touched.email && formData.errors.email && (
            <div
              style={{
                color: "red",
                fontSize: "15px",
                marginTop: "15px",
              }}
            >
              <span>
                <ErrorIcon sx={{ fontSize: "15px", textAlign: "center" }} />
                &nbsp;
                {formData.errors.email}
              </span>{" "}
            </div>
          )}
          <br />
          <label
            style={{ margin: "5px", color: "#555A8F" }}
            htmlFor="mobile_number"
          >
            Mobile Number
          </label>
          <br />
          <input
            type="tel"
            name="mobile_number"
            id="mobile_number"
            onChange={formData.handleChange}
            onBlur={formData.handleBlur}
            value={formData.mobile_number}
            style={{ margin: "5px", color: "#555A8F" }}
          />
          {formData.touched.mobile_number && formData.errors.mobile_number && (
            <div
              style={{
                color: "red",
                fontSize: "15px",
                marginTop: "15px",
              }}
            >
              <span>
                <ErrorIcon sx={{ fontSize: "15px", textAlign: "center" }} />
                &nbsp;
                {formData.errors.mobile_number}
              </span>{" "}
            </div>
          )}
          <br />
          <label style={{ margin: "5px", color: "#555A8F" }} htmlFor="password">
            Password
          </label>
          <br />
          <input
            type="password"
            name="password"
            id="password"
            onChange={formData.handleChange}
            onBlur={formData.handleBlur}
            value={formData.password}
            style={{ margin: "5px", color: "#555A8F" }}
          />
          {formData.touched.password && formData.errors.password && (
            <div
              style={{
                color: "red",
                fontSize: "15px",
                marginTop: "15px",
              }}
            >
              <span>
                <ErrorIcon sx={{ fontSize: "15px", textAlign: "center" }} />
                &nbsp;
                {formData.errors.password}
              </span>{" "}
            </div>
          )}
          <br />
          <label
            style={{ margin: "5px", color: "#555A8F" }}
            htmlFor="confirmpassword"
          >
            Confirm Password
          </label>
          <br />
          <input
            type="password"
            name="confirmpassword"
            id="confirmpassword"
            onChange={formData.handleChange}
            onBlur={formData.handleBlur}
            value={formData.confirmpassword}
            style={{ margin: "5px", color: "#555A8F" }}
          />
          {formData.touched.confirmpassword &&
            formData.errors.confirmpassword && (
              <div
                style={{
                  color: "red",
                  fontSize: "15px",
                  marginTop: "15px",
                }}
              >
                <span>
                  <ErrorIcon sx={{ fontSize: "15px", textAlign: "center" }} />
                  &nbsp;
                  {formData.errors.confirmpassword}
                </span>{" "}
              </div>
            )}
          <br />
          <br />
          <Button
            variant="contained"
            type="submit"
            sx={{
              margin: "5px",
              backgroundColor: "secondary.main",
              color: "white",
            }}
            id="registerbutt"
          >
            {load ? <CircularProgress size="15px" /> : "Register"}
          </Button>
          &nbsp;&nbsp;&nbsp;
        </form>
      </div>
    </div>
  );
};

export default Register;
