import { Button } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";
import ErrorIcon from "@mui/icons-material/Error";
import backendInstance from "../Axios/axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const validation = yup.object().shape({
    name: yup.string().required("Enter the username"),
    email: yup.string().email().required("Enter email"),
    password: yup.string().required("Enter the password"),
    confirmpassword: yup.string().required("Enter the password"),
  });
  const formData = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmpassword: "",
    },
    onSubmit: async (data) => {
      console.log(data);
      if (data.confirmpassword !== data.password) {
        alert("Password doesnt match");
      } else {
        delete data.confirmpassword;
        const obj = {
          ...data,
          role: "student",
        };
        const res = await backendInstance.post("/users/register", obj);
        if (res.data.msg === "Email already exists") {
          alert("Email already exists");
          document.getElementById("registerform").reset();
        } else if (res.data.msg === "Inserted Successfully") {
          document.getElementById("registerform").reset();
          navigate("/login");
        }
        console.log(res);
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
          border: "1px solid grey",
          borderRadius: "8px",
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          width: "300px",
        }}
      >
        <form id="registerform" onSubmit={formData.handleSubmit}>
          <label style={{ margin: "5px", color: "#555A8F" }} htmlFor="name">
            User Name
          </label>
          <br />
          <input
            name="name"
            id="name"
            onChange={formData.handleChange}
            onBlur={formData.handleBlur}
            value={formData.email}
            style={{ margin: "5px", color: "#555A8F" }}
          />
          {formData.touched.name && formData.errors.name && (
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
                {formData.errors.name}
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
          >
            Log IN{" "}
          </Button>
          &nbsp;&nbsp;&nbsp;
        </form>
      </div>
    </div>
  );
};

export default Register;
