import { Button, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import * as yup from "yup";
import ErrorIcon from "@mui/icons-material/Error";
import backendInstance from "../Axios/axios";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import banner from "../pics/WhatsApp Image 2025-04-13 at 7.24.04 PM.jpeg";

const Register = () => {
  const [load, setLoad] = useState(false);
  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const navigate = useNavigate();
  const validation = yup.object().shape({
    user_name: yup.string().required("Enter the username"),
    email: yup.string().email().required("Enter email"),
    password: yup.string().required("Enter the password"),
    confirmpassword: yup.string().required("Enter the password"),
    customer_type: yup.string().required("Select customer type"),
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
          flexWrap: "wrap",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          width: "50%",
          height: "100%",
        }}
      >
        {/* <div style={{ position: "absolute", top: "0", left: "5px" }}>
          <img src={logo} height={100} width={100} alt="logo" />
        </div> */}
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
              margin: "0px",
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
              margin: "0px",
            }}
          >
            {" "}
            Elevating women's Artisanal Excellence and Enterpreneurship
          </h4>
        </div>
        <form id="registerform" onSubmit={formData.handleSubmit}>
          <div
            style={{
              marginTop: "10px",
              borderRadius: "8px",
              boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
              // width: "80%",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <TextField
                name="user_name"
                id="user_name"
                variant="outlined"
                label="User Name"
                size="small"
                onChange={formData.handleChange}
                onBlur={formData.handleBlur}
                value={formData.email}
                style={{ margin: "5px", color: "#555A8F" }}
              />
              {formData.touched.user_name && formData.errors.user_name && (
                <div
                  style={{
                    color: "red",
                    fontSize: "10px",
                  }}
                >
                  <span>
                    <ErrorIcon sx={{ fontSize: "10px", textAlign: "center" }} />
                    &nbsp;
                    {formData.errors.user_name}
                  </span>{" "}
                </div>
              )}
              <br />
              <TextField
                type="email"
                name="email"
                id="email"
                variant="outlined"
                label="Email"
                size="small"
                onChange={formData.handleChange}
                onBlur={formData.handleBlur}
                value={formData.email}
                style={{ margin: "5px", color: "#555A8F" }}
              />
              {formData.touched.email && formData.errors.email && (
                <div
                  style={{
                    color: "red",
                    fontSize: "10px",
                  }}
                >
                  <span>
                    <ErrorIcon sx={{ fontSize: "10px", textAlign: "center" }} />
                    &nbsp;
                    {formData.errors.email}
                  </span>{" "}
                </div>
              )}
            </div>
            <div>
              <TextField
                type="tel"
                name="mobile_number"
                id="mobile_number"
                variant="outlined"
                label="Mobile Number"
                size="small"
                onChange={formData.handleChange}
                onBlur={formData.handleBlur}
                value={formData.mobile_number}
                style={{ margin: "5px", color: "#555A8F" }}
              />
              {formData.touched.mobile_number &&
                formData.errors.mobile_number && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "10px",
                    }}
                  >
                    <span>
                      <ErrorIcon
                        sx={{ fontSize: "10px", textAlign: "center" }}
                      />
                      &nbsp;
                      {formData.errors.mobile_number}
                    </span>{" "}
                  </div>
                )}
              <br />
              <TextField
                type="password"
                name="password"
                id="password"
                variant="outlined"
                label="Password"
                size="small"
                onChange={formData.handleChange}
                onBlur={formData.handleBlur}
                value={formData.password}
                style={{ margin: "5px", color: "#555A8F" }}
              />
              {formData.touched.password && formData.errors.password && (
                <div
                  style={{
                    color: "red",
                    fontSize: "10px",
                  }}
                >
                  <span>
                    <ErrorIcon sx={{ fontSize: "10px", textAlign: "center" }} />
                    &nbsp;
                    {formData.errors.password}
                  </span>{" "}
                </div>
              )}
            </div>
            <div>
              <TextField
                type="password"
                name="confirmpassword"
                id="confirmpassword"
                variant="outlined"
                label="Confirm Password"
                size="small"
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
                      fontSize: "10px",
                    }}
                  >
                    <span>
                      <ErrorIcon
                        sx={{ fontSize: "10px", textAlign: "center" }}
                      />
                      &nbsp;
                      {formData.errors.confirmpassword}
                    </span>
                  </div>
                )}
              <br />
              <select
                name="customer_type"
                id="customer_type"
                onChange={formData.handleChange}
                onBlur={formData.handleBlur}
                style={{
                  // padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontFamily: "Poppins, sans-serif",
                  width: "222.4px",
                  padding: "8.5px 14px",
                  height: "40px",
                }}
              >
                <option value="" disabled>
                  Customer Type
                </option>
                <option value="Buyer">Buyer</option>
                <option value="Seller">Seller</option>
              </select>
              {formData.touched.customer_type &&
                formData.errors.customer_type && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "10px",
                    }}
                  >
                    <span>
                      <ErrorIcon
                        sx={{ fontSize: "10px", textAlign: "center" }}
                      />
                      &nbsp;
                      {formData.errors.customer_type}
                    </span>
                  </div>
                )}
            </div>
            <div>
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
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
