import { Button } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import LeaveForm from "./LeaveForm";
import { useNavigate } from "react-router-dom";
import backendInstance from "../Axios/axios";
import SnackBarComp from "../Components/SnackBarComp";

const LeaveApp = () => {
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();

  const User = useMemo(
    () => JSON.parse(sessionStorage.getItem("user")) || {},
    []
  );

  const userMail = User.email;
  const userName = User.name;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const [leave, setLeave] = useState([]);
  const [adLeave, setAdLeave] = useState([]);

  const leaveData = useCallback(async () => {
    try {
      const { data } = await backendInstance.get(`/leave/${User.email}`);
      setLeave(data);
    } catch (error) {
      console.log(error);
    }
  }, [User.email, setLeave]);

  const getAdminData = useCallback(async () => {
    try {
      const { data } = await backendInstance.get("/leave");
      setAdLeave(data);
    } catch (error) {
      console.log(error);
    }
  }, [setAdLeave]);

  console.log(leave);

  useEffect(() => {
    if (Object.keys(User).length === 0) {
      navigate("/login");
    } else {
      if (User.role === "student") {
        leaveData();
      } else {
        getAdminData();
      }
    }
  }, [User, navigate, leaveData, getAdminData]);

  const handleClose = useCallback(() => {
    setOpen(false);
    leaveData();
  }, [setOpen, leaveData]);

  const [openSnack, setOpenSnack] = React.useState(false);

  const [dataMsg, setDataMsg] = React.useState("");

  const handleClick = (msg) => {
    console.log("opened");
    setDataMsg(msg);
    setOpenSnack(true);
    getAdminData();
  };

  const handleApprove = async (e, ldata, request) => {
    try {
      document.getElementById("approvebutt").disabled = true;

      e.preventDefault();

      const dataObj = {
        name: ldata.name,
        email: ldata.email,
        date: ldata.date,
        approval: request,
        reason: ldata.reason,
      };

      console.log(dataObj);
      const res = await backendInstance.put("/leave", dataObj);
      if (res) {
        handleClick(request);
      } else {
        document.getElementById("approvebutt").disabled = false;
      }
      document.getElementById("approvebutt").disabled = false;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {User.role === "student" ? (
        <>
          <LeaveForm
            open={open}
            handleClose={handleClose}
            userMail={userMail}
            userName={userName}
          />{" "}
          <div>
            {" "}
            <Button
              sx={{ backgroundColor: "buttcolor.main", marginBottom: "15px" }}
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleClickOpen}
            >
              apply leave
            </Button>
          </div>
          <div style={{ height: 400, width: "100%" }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>From</TableCell>
                    <TableCell align="right">To</TableCell>
                    <TableCell align="right">Approved</TableCell>
                    <TableCell align="right">Reason</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{}}>
                  {leave.map((lev) => (
                    <TableRow
                      key={lev.date}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell
                        sx={{ color: "mild.main" }}
                        component="th"
                        scope="row"
                      >
                        {lev.date}
                      </TableCell>
                      <TableCell sx={{ color: "mild.main" }} align="right">
                        {lev?.to?.slice(0, 10)}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                        }}
                        align="right"
                      >
                        <span style={{ backgroundColor: "#FF9A28" }}>
                          {lev.approval || "Pending"}
                        </span>
                      </TableCell>
                      <TableCell
                        sx={{ color: "mild.main" }}
                        width={100}
                        align="center"
                      >
                        <p
                          style={{
                            overflowWrap: "break-word",
                            width: "100px",
                          }}
                        >
                          {lev.reason}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      ) : (
        <div>
          <div style={{}}>
            {adLeave.filter((leav) => leav.approval === "").length === 0 ? (
              <p style={{ margin: "5px", color: "#555A8F" }}>
                No leave applications
              </p>
            ) : (
              adLeave
                .filter((leav) => leav.approval === "")
                .map((ldata) => (
                  <div
                    style={{
                      border: "1px solid grey",
                      borderRadius: "8px",
                      boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                      margin: "10px",
                    }}
                  >
                    <p style={{ color: "#7E8E9F" }}>
                      <span style={{ color: "#555A8F" }}>Name :</span>{" "}
                      {ldata.name}
                      &nbsp;&nbsp;&nbsp;
                      <span style={{ color: "#555A8F" }}>Email :</span>{" "}
                      {ldata.email}
                    </p>
                    <p style={{ color: "#7E8E9F" }}>
                      <span style={{ color: "#555A8F" }}>From :</span>{" "}
                      {ldata.date}
                      &nbsp;&nbsp;&nbsp;
                      <span style={{ color: "#555A8F" }}>
                        No of Days :
                      </span>{" "}
                      {ldata.days}
                    </p>
                    <div>
                      {" "}
                      <p
                        style={{
                          width: "350px",
                          overflowWrap: "break-word",
                          color: "#7E8E9F",
                        }}
                      >
                        <span style={{ color: "#555A8F" }}>Reason :</span>{" "}
                        {ldata.reason}
                      </p>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "buttcolor.main",
                          margin: "5px",
                        }}
                        type="submit"
                        onClick={(e) => handleApprove(e, ldata, "Approved")}
                        id="approvebutt"
                      >
                        Approve
                      </Button>
                      &nbsp;&nbsp;&nbsp;
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "buttcolor.main",
                          margin: "5px",
                        }}
                        type="submit"
                        onClick={(e) => handleApprove(e, ldata, "Denied")}
                        id="approvebutt"
                      >
                        Deny
                      </Button>
                    </div>
                  </div>
                ))
            )}
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

export default LeaveApp;
