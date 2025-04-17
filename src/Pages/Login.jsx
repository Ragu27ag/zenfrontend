import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import * as yup from "yup";
import ErrorIcon from "@mui/icons-material/Error";
import { Link, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import banner from "../pics/WhatsApp Image 2025-04-13 at 7.24.04 PM.jpeg";
import backendInstance from "../Axios/axios";
import logo from "../pics/latest_logo.jpeg";

const Login = () => {
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  const validation = yup.object().shape({
    email: yup.string().email().required("Enter email"),
    password: yup.string().required("Enter the password"),
  });
  const formData = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (data) => {
      try {
        setLoad(true);
        document.getElementById("loginbutt").disabled = true;
        console.log(data);
        const res = await backendInstance.post("/api/v1/login-user", data);
        console.log(res.data);
        sessionStorage.setItem("user", JSON.stringify(res.data.data));
        console.log(res);
        if (res.data.message === "Login success") {
          formData.resetForm();
          navigate("/");
        }
      } catch (error) {
        console.log(error);
        setLoad(false);
        alert(error.response.data.message);
        // document.getElementById("registerform").reset();
        document.getElementById("loginbutt").disabled = false;
      }
    },
    validationSchema: validation,
  });
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        flexWrap: "wrap",
        height: "100vh",
        width: "100vw",
      }}
    >
      <div style={{ width: "40%", height: "100%" }}>
        <img
          src={banner}
          height={"100%"}
          width={"100%"}
          style={{
            marginTop: "5px",
            borderRadius: "8px",
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          }}
          alt="logo"
        />
      </div>

      <div
        style={{
          display: "flex",
          flexFlowflow: "wrap",
          gap: "24px",
          marginTop: "20px",
          flexWrap: "wrap",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          width: "50%",
          height: "100%",
        }}
      >
        <div
          style={{
            width: "100%",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "64px",
              letterSpacing: "1px",
              color: "#2C3E50",
              margin: "10px",
            }}
          >
            Herfemora
          </h1>
          <h4
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontSize: "24px",
              letterSpacing: "1px",
              color: "#2C3E50",
              marginBottom: "8px",
            }}
          >
            {" "}
            Elevating women's Artisanal Excellence and Enterpreneurship
          </h4>
        </div>
        <div style={{ position: "absolute", top: "0", left: "5px" }}>
          {/* <img src={logo} height={100} width={100} alt="logo" /> */}
        </div>
        <div
          style={{
            borderRadius: "8px",
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
            width: "350px",
          }}
        >
          <form onSubmit={formData.handleSubmit}>
            <TextField
              type="email"
              name="email"
              id="email"
              label="Email"
              variant="outlined"
              onChange={formData.handleChange}
              onBlur={formData.handleBlur}
              value={formData.email}
              style={{ margin: "5px" }}
              size="small"
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
            <TextField
              type="password"
              name="password"
              id="password"
              label="Password"
              variant="outlined"
              onChange={formData.handleChange}
              onBlur={formData.handleBlur}
              value={formData.password}
              style={{ margin: "5px" }}
              size="small"
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
            <br />
            <Button
              variant="contained"
              type="submit"
              sx={{
                margin: "5px",
                backgroundColor: "secondary.main",
                color: "white",
              }}
              id="loginbutt"
            >
              {load ? <CircularProgress size="15px" /> : "Log IN"}
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Link style={{ textDecoration: "none" }} to="/register">
              Don't have account ? Register
            </Link>
          </form>
        </div>
        {/* <div style={{ position: "absolute", top: "0", right: "5px" }}>
        <img src={log_image} height={800} width={500} alt="logo" />
      </div> */}
      </div>
    </div>
  );
};

export default Login;
