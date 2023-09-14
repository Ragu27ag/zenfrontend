import { Button } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import backendInstance from "../Axios/axios";
import { useNavigate } from "react-router-dom";
import SnackBarComp from "../Components/SnackBarComp";

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

  const [openSnack, setOpenSnack] = React.useState(false);

  const [dataMsg, setDataMsg] = React.useState("");

  const handleClick = () => {
    console.log("opened");
    setDataMsg("Uploaded Successfully");
    setOpenSnack(true);
  };

  const handleDownload = async () => {
    try {
      const res = await backendInstance.get("/upload", {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: res.data.type });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "syllabus.pdf";
      link.click();
      console.log(res.data.type);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpload = async (e) => {
    try {
      document.getElementById("uploadbutt").disabled = true;
      e.preventDefault();
      console.log(uploadFile.current.files[0]);
      let filup = uploadFile.current.files[0];
      const dataObj = new FormData();
      dataObj.append("name", name);
      dataObj.append("file", filup);
      const res = await backendInstance.post("/upload", dataObj);

      if (res.data.msg === "Inserted Successfully") {
        handleClick();
        document.getElementById("fname").value = "";
        uploadFile.current.value = "";
      } else {
        document.getElementById("uploadbutt").disabled = false;
      }

      document.getElementById("uploadbutt").disabled = false;

      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
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
            marginTop: "100px",
            border: "1px solid grey",
            textAlign: "center",
            width: "400px",
            height: "150px",
            borderRadius: "8px",
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          }}
        >
          <p style={{ color: "#555A8F" }}>FSD_MERN</p>
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
            marginTop: "100px",
            border: "1px solid grey",

            width: "500px",
            height: "200px",
            borderRadius: "8px",
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          }}
        >
          <div style={{ margin: "15px" }}>
            <label style={{ color: "#555A8F" }} htmlFor="fname">
              FileName :{" "}
            </label>
            <br />
            <input
              style={{ color: "#555A8F" }}
              name="fname"
              id="fname"
              onChange={(e) => setName(e.target.value)}
              required
            />
            <br />
            <br />
            <input
              style={{ color: "#555A8F" }}
              ref={uploadFile}
              type="file"
              required
            />
            <span style={{ color: "#555A8F" }}>(only .pdf)</span>
            <br /> <br />
            <Button
              variant="contained"
              sx={{ backgroundColor: "buttcolor.main" }}
              onClick={handleUpload}
              id="uploadbutt"
            >
              Upload
            </Button>
          </div>
        </div>
      )}
      <SnackBarComp
        openSnack={openSnack}
        setOpenSnack={setOpenSnack}
        dataMsg={dataMsg}
      />
    </div>
  );
};

export default Syllabus;
