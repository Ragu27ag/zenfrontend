import React from "react";
import { Typography, Button } from "@mui/material";

const ApplicationList = ({ result, setOpen }) => {
  return (
    <div
      style={{
        marginTop: "20px",
      }}
    >
      {" "}
      <div
        style={{
          margin: "10px",
        }}
      >
        <Button
          variant="contained"
          sx={{ backgroundColor: "buttcolor.main" }}
          id="submitbutt"
          onClick={() => setOpen(false)}
          size="small"
        >
          back{" "}
        </Button>
        {result.length === 0 ? (
          <p style={{ margin: "5px", color: "#555A8F" }}>
            Classes not yet assigned
          </p>
        ) : (
          result.map((val) => (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-around",
                margin: "10px",
                border: "1px solid grey",
                boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                borderRadius: "8px",
                color: "#555A8F",
              }}
            >
              <div>
                <Typography variant="h5">{val.company}</Typography>
                <div style={{ marginTop: "70px" }}>
                  {" "}
                  <p>
                    {" "}
                    <span style={{ backgroundColor: "#FF9A28" }}>
                      {val.name}
                    </span>
                  </p>
                  <p style={{ backgroundColor: "#FF9A28" }}>
                    {val.email} - {val.isApplied}
                  </p>
                </div>
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-around",
                    width: "300px",
                  }}
                >
                  <div>
                    <p>
                      <span>Role</span> <br />
                      {val.role}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span>Nature of job</span> <br />
                      {val.nature}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span>Deadline</span>
                      <br />
                      {val.deadline}
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-around",
                  }}
                >
                  <div>
                    <p>
                      <span>CTC</span>
                      <br />
                      {val.ctc}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span>Openings</span>
                      <br />
                      {val.openings}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span>Program</span>
                      <br />
                      {val.program}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApplicationList;
