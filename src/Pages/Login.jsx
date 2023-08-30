import { Button } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";
import ErrorIcon from "@mui/icons-material/Error";
import { Link, useNavigate } from "react-router-dom";
import backendInstance from "../Axios/axios";

const Login = () => {
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
      console.log(data);
      const res = await backendInstance.post("/users/login", data);
      console.log(res.data);
      sessionStorage.setItem("user", JSON.stringify(res.data));
      if (res.data.msg === "Invalid Credentials") {
        alert("Invalid Credentials");
      } else if (res.data.msg === "User doesnt exist") {
        alert("User doesnt exist");
      } else {
        formData.resetForm();
        navigate("/");
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
      }}
    >
      <div
        style={{
          marginTop: "150px",
        }}
      >
        <form onSubmit={formData.handleSubmit}>
          <label htmlFor="email">Email</label>
          <br />
          <input
            type="email"
            name="email"
            id="email"
            onChange={formData.handleChange}
            onBlur={formData.handleBlur}
            value={formData.email}
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
          <label htmlFor="password">Password</label>
          <br />
          <input
            type="password"
            name="password"
            id="password"
            onChange={formData.handleChange}
            onBlur={formData.handleBlur}
            value={formData.password}
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
          <Button variant="contained" type="submit">
            Log IN{" "}
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Link style={{ textDecoration: "none" }} to="/register">
            Don't have account ? Register
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
