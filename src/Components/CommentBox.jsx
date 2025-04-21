import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/material";

const CommentBox = ({ arr, open, handleClose }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{}}
    >
      <DialogTitle id="alert-dialog-title">Comments</DialogTitle>
      <DialogContent sx={{ width: "600px" }}>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              // display: "flex",
              // flexWrap: "wrap",
              // justifyContent: "space-around",
              borderRadius: "8px",
              // border: "1px solid red",
              margin: "5%",
              // boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
              // maxWidth: "90%",
            }}
          >
            {arr.map((data) => (
              <div
                style={{
                  margin: "15px",
                  padding: "8px",
                  borderRadius: "8px",
                  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                  backgroundColor: "#F0F2F5",
                }}
              >
                <p
                  style={{
                    fontSize: "15px",
                    margin: "0px",
                    display: "inline-flex",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "15px",
                    fontWeight: "bolder",
                    color: "black",
                  }}
                >
                  {data.user_name}
                </p>
                <p style={{ fontSize: "14px", margin: "0px" }}>
                  {data.comments}
                </p>
              </div>
            ))}
          </Box>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default CommentBox;
