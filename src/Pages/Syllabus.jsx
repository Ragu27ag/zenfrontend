import { Button } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import backendInstance from "../Axios/axios";
import { useNavigate } from "react-router-dom";

const Syllabus = () => {
  const [name, setName] = useState("");
  const uploadFile = useRef(null);
  const User = useMemo(
    () => JSON.parse(sessionStorage.getItem("user")) || {},
    []
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (Object.keys(User).length === 0) {
      navigate("/login");
    }
  }, [User, navigate]);
  const handleDownload = async () => {
    const res = await backendInstance.get("/upload", { responseType: "blob" });
    const blob = new Blob([res.data], { type: res.data.type });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "syllabus.pdf";
    link.click();
    console.log(res.data.type);
  };
  const handleUpload = async (e) => {
    e.preventDefault();
    console.log(uploadFile.current.files[0]);
    let filup = uploadFile.current.files[0];
    const dataObj = new FormData();
    dataObj.append("name", name);
    dataObj.append("file", filup);
    const res = await backendInstance.post("/upload", dataObj);

    console.log(res.data);
  };
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {User.role === "student" ? (
        <div
          style={{
            marginTop: "40px",
            border: "1px solid",
            textAlign: "center",
            width: "400px",
            height: "100px",
          }}
        >
          <p>FSD_MERN</p>
          <Button
            variant="contained"
            sx={{ backgroundColor: "buttcolor.main" }}
            onClick={handleDownload}
          >
            download
          </Button>
        </div>
      ) : (
        <div
          style={{
            marginTop: "40px",
            border: "1px solid",
            width: "300px",
          }}
        >
          <div style={{ margin: "15px" }}>
            <input
              name="fname"
              id="fname"
              onChange={(e) => setName(e.target.value)}
            />
            <br />
            <br />
            <input ref={uploadFile} type="file" />
            <br /> <br />
            <Button
              variant="contained"
              sx={{ backgroundColor: "buttcolor.main" }}
              onClick={handleUpload}
            >
              Upload
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Syllabus;
