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

  const handleClose = () => {
    setOpen(false);
  };

  const [leave, setLeave] = useState([]);
  const [adLeave, setAdLeave] = useState([]);

  const leaveData = useCallback(async () => {
    const { data } = await backendInstance.get(`/leave/${User.email}`);
    setLeave(data);
  }, [User.email, setLeave]);

  const getAdminData = useCallback(async () => {
    const { data } = await backendInstance.get("/leave");
    setAdLeave(data);
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

  const handleApprove = (e, ldata, request) => {
    // document.getElementById("approvebutt").disabled = true;
    e.preventDefault();

    const dataObj = {
      name: ldata.name,
      email: ldata.email,
      date: ldata.date,
      approval: request,
      reason: ldata.reason,
    };

    console.log(dataObj);
    const res = backendInstance.put("/leave", dataObj);
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
              sx={{ backgroundColor: "buttcolor.main" }}
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleClickOpen}
            >
              Create Query
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
                <TableBody>
                  {leave.map((lev) => (
                    <TableRow
                      key={lev.date}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {lev.date}
                      </TableCell>
                      <TableCell align="right">
                        {lev?.to?.slice(0, 10)}
                      </TableCell>
                      <TableCell align="right">{lev.approval || "-"}</TableCell>
                      <TableCell align="right">{lev.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      ) : (
        <div>
          <div>
            {adLeave
              .filter((leav) => leav.approval === "")
              .map((ldata) => (
                <div>
                  <p>
                    <span>Name :</span> {ldata.name}
                    &nbsp;&nbsp;
                    <span>Email :</span> {ldata.email}
                  </p>
                  <p>
                    <span>From :</span> {ldata.date}
                    &nbsp;&nbsp;
                    <span>No of Days :</span> {ldata.days}
                  </p>
                  <div>
                    {" "}
                    <p>
                      <span>Reason :</span> {ldata.reason}
                    </p>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "buttcolor.main" }}
                      type="submit"
                      onClick={(e) => handleApprove(e, ldata, "Approved")}
                      id="approvebutt"
                    >
                      Approve
                    </Button>
                    &nbsp;&nbsp;
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "buttcolor.main" }}
                      type="submit"
                      onClick={(e) => handleApprove(e, ldata, "Denied")}
                      id="approvebutt"
                    >
                      Deny
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveApp;
