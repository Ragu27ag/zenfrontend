import { Button } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";
import ErrorIcon from "@mui/icons-material/Error";
import { Link } from "react-router-dom";
import backendInstance from "../Axios/axios";

const Register = () => {
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
        }}
      >
        <form onSubmit={formData.handleSubmit}>
          <label htmlFor="name">User Name</label>
          <br />
          <input
            name="name"
            id="name"
            onChange={formData.handleChange}
            onBlur={formData.handleBlur}
            value={formData.email}
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
          <label htmlFor="confirmpassword">Confirm Password</label>
          <br />
          <input
            type="password"
            name="confirmpassword"
            id="confirmpassword"
            onChange={formData.handleChange}
            onBlur={formData.handleBlur}
            value={formData.confirmpassword}
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
          <Button variant="contained" type="submit">
            Log IN{" "}
          </Button>
          &nbsp;&nbsp;&nbsp;
        </form>
      </div>
    </div>
  );
};

export default Register;
