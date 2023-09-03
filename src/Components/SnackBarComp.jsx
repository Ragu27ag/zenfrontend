import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const SnackBarComp = ({ openSnack, setOpenSnack, dataMsg }) => {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };
  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  console.log("msg");
  return (
    <div>
      {" "}
      <Box sx={{ width: 300, backgroundColor: "black" }}>
        <Snackbar
          open={openSnack}
          autoHideDuration={3000}
          onClose={handleClose}
          message={dataMsg}
          action={action}
        />
      </Box>
    </div>
  );
};

export default SnackBarComp;
